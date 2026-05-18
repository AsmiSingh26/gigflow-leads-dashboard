import type { Lead } from '../types';

const statusColors: Record<string, string> = {
  New: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  Qualified: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

const statusDot: Record<string, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-green-500',
  Lost: 'bg-red-500',
};

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
}

export default function LeadDetailModal({ lead, onClose, onEdit }: LeadDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{lead.name}</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">{lead.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Status</span>
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[lead.status]}`}></span>
              {lead.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Source</span>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{lead.source}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Created</span>
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {new Date(lead.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Last Updated</span>
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {new Date(lead.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-gradient-to-r from-rose-400 to-rose-600 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition shadow-md shadow-rose-200"
          >
            ✏️ Edit Lead
          </button>
        </div>
      </div>
    </div>
  );
}
