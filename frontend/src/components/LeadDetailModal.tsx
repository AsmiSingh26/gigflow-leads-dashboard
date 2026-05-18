import type { Lead } from '../types';

// status color maps (copy from LeadTable.tsx)

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
}

export default function LeadDetailModal({ lead, onClose, onEdit }: LeadDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* avatar + name + email header */}
        {/* rows: Status, Source, Created, Last Updated */}
        {/* Close + Edit Lead buttons */}
      </div>
    </div>
  );
}
