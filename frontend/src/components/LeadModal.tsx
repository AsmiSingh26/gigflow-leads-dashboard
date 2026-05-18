import type { Lead } from '../types';

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Instagram', 'Referral'];

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: string;
}

interface LeadModalProps {
  editLead: Lead | null;
  form: LeadFormData;
  formError: string;
  formLoading: boolean;
  onFormChange: (form: LeadFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function LeadModal({ editLead, form, formError, formLoading, onFormChange, onSubmit, onClose }: LeadModalProps) {
  const inputClass = "w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white">
            {editLead ? '✏️' : '➕'}
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{editLead ? 'Edit Lead' : 'Add New Lead'}</h2>
        </div>
        {formError && <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl mb-4 text-sm">{formError}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => onFormChange({ ...form, name: e.target.value })} className={inputClass} placeholder="Lead name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => onFormChange({ ...form, email: e.target.value })} className={inputClass} placeholder="lead@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
              <select value={form.status} onChange={e => onFormChange({ ...form, status: e.target.value as LeadStatus })} className={inputClass}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Source</label>
              <select value={form.source} onChange={e => onFormChange({ ...form, source: e.target.value })} className={inputClass}>
                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 bg-gradient-to-r from-rose-400 to-rose-600 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-rose-200">
              {formLoading ? 'Saving...' : editLead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
