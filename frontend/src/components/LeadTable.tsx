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

interface LeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;  // added
}

export default function LeadTable({ leads, isAdmin, onEdit, onDelete, onView }: LeadTableProps) {  // added onView
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-3">📭</div>
        <p className="font-medium text-gray-400">No leads found</p>
        <p className="text-sm mt-1 text-gray-400">Try adjusting filters or add a new lead</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        <tr>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Email</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-left">Source</th>
          <th className="px-6 py-3 text-left">Created</th>
          <th className="px-6 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
        {leads.map(lead => (
          <tr key={lead._id} className="hover:bg-rose-50 dark:hover:bg-gray-700/40 transition">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{lead.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[lead.status]}`}></span>
                {lead.status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{lead.source}</td>
            <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">
              {new Date(lead.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-3">
                <button onClick={() => onView(lead)} className="text-gray-400 hover:text-rose-500 text-sm font-medium transition">View</button>  {/* added */}
                <button onClick={() => onEdit(lead)} className="text-rose-400 hover:text-rose-600 text-sm font-medium transition">Edit</button>
                {isAdmin && (
                  <button onClick={() => onDelete(lead._id)} className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-sm font-medium transition">Delete</button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
