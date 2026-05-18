const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Instagram', 'Referral'];

interface LeadFiltersProps {
  search: string;
  statusFilter: string;
  sourceFilter: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function LeadFilters({ search, statusFilter, sourceFilter, sort, onSearchChange, onStatusChange, onSourceChange, onSortChange }: LeadFiltersProps) {
  const selectClass = "border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-rose-50 dark:border-gray-700 p-4 mb-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <select value={statusFilter} onChange={e => onStatusChange(e.target.value)} className={selectClass}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => onSourceChange(e.target.value)} className={selectClass}>
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={e => onSortChange(e.target.value)} className={selectClass}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}
