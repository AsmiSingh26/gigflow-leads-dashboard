import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeadsApi, createLeadApi, updateLeadApi, deleteLeadApi, exportCSVApi } from '../api/leads.api';
import type { Lead } from '../types';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Instagram', 'Referral'];

const statusColors: Record<string, string> = {
  New: 'bg-blue-50 text-blue-600',
  Contacted: 'bg-amber-50 text-amber-600',
  Qualified: 'bg-green-50 text-green-600',
  Lost: 'bg-red-50 text-red-500',
};

const statusDot: Record<string, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-green-500',
  Lost: 'bg-red-500',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState({ name: '', email: '', status: 'New', source: 'Website' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getLeadsApi({
        page, limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
        sort,
      });
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
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sourceFilter, sort]);

  const openCreate = () => {
    setEditLead(null);
    setForm({ name: '', email: '', status: 'New', source: 'Website' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
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

  const handleDelete = async (id: string) => {
    try {
      await deleteLeadApi(id);
      setDeleteId(null);
      fetchLeads();
    } catch { setError('Failed to delete lead'); }
  };

  const statCards = [
    { label: 'Total Leads', value: total, color: 'from-rose-400 to-rose-600', icon: '👥' },
    { label: 'New', value: leads.filter(l => l.status === 'New').length, color: 'from-blue-400 to-blue-600', icon: '✨' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, color: 'from-green-400 to-green-600', icon: '✅' },
    { label: 'Lost', value: leads.filter(l => l.status === 'Lost').length, color: 'from-gray-400 to-gray-600', icon: '❌' },
  ];

  return (
    <div className="flex min-h-screen bg-rose-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg">G</div>
              <div>
                <h1 className="font-bold text-gray-800">GigFlow</h1>
                <p className="text-xs text-gray-400">Leads Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <div className="bg-rose-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-rose-500">📊</span>
              <span className="text-sm font-medium text-rose-600">Dashboard</span>
            </div>
          </nav>
          <div className="p-4 border-t border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{user?.role}</span>
              </div>
            </div>
            <button onClick={logout} className="w-full text-sm text-gray-500 hover:text-rose-500 transition text-left px-2 py-1">
              → Sign out
            </button>
          </div>
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-rose-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-400 hover:text-rose-500 transition text-xl">☰</button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Good morning, {user?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-xs text-gray-400">Here's what's happening with your leads today.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => exportCSVApi()} className="flex items-center gap-2 border border-rose-200 text-rose-500 px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-50 transition">
              📥 Export CSV
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition shadow-md shadow-rose-200">
              + Add Lead
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statCards.map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-3`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-400">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-50 p-4 mb-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                <option value="">All Sources</option>
                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</div>}

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">All Leads</h3>
              <span className="text-sm text-gray-400">{total} total</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-medium text-gray-400">No leads found</p>
                <p className="text-sm mt-1">Try adjusting filters or add a new lead</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Source</th>
                    <th className="px-6 py-3 text-left">Created</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-rose-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lead.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[lead.status]}`}></span>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lead.source}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button onClick={() => openEdit(lead)}
                            className="text-rose-400 hover:text-rose-600 text-sm font-medium transition">
                            Edit
                          </button>
                          {user?.role === 'admin' && (
                            <button onClick={() => setDeleteId(lead._id)}
                              className="text-gray-300 hover:text-red-400 text-sm font-medium transition">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-1.5 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:border-rose-300 hover:text-rose-500 transition">
                    ← Prev
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-4 py-1.5 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:border-rose-300 hover:text-rose-500 transition">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white">
                {editLead ? '✏️' : '➕'}
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                {editLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
            </div>
            {formError && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Lead name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="lead@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Source</label>
                  <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                    {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="flex-1 bg-gradient-to-r from-rose-400 to-rose-600 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-rose-200">
                  {formLoading ? 'Saving...' : editLead ? 'Update Lead' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🗑️</div>
              <h2 className="text-lg font-bold text-gray-800">Delete Lead</h2>
              <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}