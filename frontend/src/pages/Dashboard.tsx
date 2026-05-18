import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeadsApi, createLeadApi, updateLeadApi, deleteLeadApi, exportCSVApi } from '../api/leads.api';
import type { Lead } from '../types';

import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import LeadFilters from '../components/LeadFilters';
import LeadTable from '../components/LeadTable';
import Pagination from '../components/Pagination';
import LeadModal from '../components/LeadModal';
import type { LeadFormData } from '../components/LeadModal';
import DeleteModal from '../components/DeleteModal';

const EMPTY_FORM: LeadFormData = { name: '', email: '', status: 'New', source: 'Website' };

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sourceFilter, sort]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getLeadsApi({ page, limit: 10, search: debouncedSearch, status: statusFilter, source: sourceFilter, sort });
      setLeads(res.leads);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sourceFilter, sort]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const openCreate = () => { setEditLead(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true); };
  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setForm({ name: lead.name, email: lead.email, status: lead.status as LeadFormData['status'], source: lead.source });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.email) { setFormError('Name and email are required'); return; }
    try {
      setFormLoading(true);
      if (editLead) await updateLeadApi(editLead._id, form);
      else await createLeadApi(form);
      setShowModal(false);
      fetchLeads();
    } catch { setFormError('Something went wrong'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteLeadApi(deleteId); setDeleteId(null); fetchLeads(); }
    catch { setError('Failed to delete lead'); }
  };

  const statCards = [
    { label: 'Total Leads', value: total, color: 'from-rose-400 to-rose-600', icon: '👥' },
    { label: 'New', value: leads.filter(l => l.status === 'New').length, color: 'from-blue-400 to-blue-600', icon: '✨' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, color: 'from-green-400 to-green-600', icon: '✅' },
    { label: 'Lost', value: leads.filter(l => l.status === 'Lost').length, color: 'from-gray-400 to-gray-600', icon: '❌' },
  ];

  return (
    <div className="flex min-h-screen bg-rose-50 dark:bg-gray-950">
      {sidebarOpen && <Sidebar user={user} onLogout={logout} />}

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 border-b border-rose-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-400 hover:text-rose-500 transition text-xl">☰</button>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Good morning, {user?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Here's what's happening with your leads today.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => exportCSVApi()} className="flex items-center gap-2 border border-rose-200 dark:border-rose-800 text-rose-500 dark:text-rose-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition">
              📥 Export CSV
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition shadow-md shadow-rose-200">
              + Add Lead
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statCards.map(card => <StatCard key={card.label} {...card} />)}
          </div>

          <LeadFilters
            search={search} statusFilter={statusFilter} sourceFilter={sourceFilter} sort={sort}
            onSearchChange={setSearch} onStatusChange={setStatusFilter} onSourceChange={setSourceFilter} onSortChange={setSort}
          />

          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</div>}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-rose-50 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-white">All Leads</h3>
              <span className="text-sm text-gray-400 dark:text-gray-500">{total} total</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              </div>
            ) : (
              <LeadTable leads={leads} isAdmin={user?.role === 'admin'} onEdit={openEdit} onDelete={setDeleteId} />
            )}

            <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />
          </div>
        </main>
      </div>

      {showModal && <LeadModal editLead={editLead} form={form} formError={formError} formLoading={formLoading} onFormChange={setForm} onSubmit={handleSubmit} onClose={() => setShowModal(false)} />}
      {deleteId && <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
