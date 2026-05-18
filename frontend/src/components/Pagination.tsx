interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <p className="text-sm text-gray-400 dark:text-gray-500">Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={page === 1} className="px-4 py-1.5 text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl disabled:opacity-40 hover:border-rose-300 hover:text-rose-500 transition">← Prev</button>
        <button onClick={onNext} disabled={page === totalPages} className="px-4 py-1.5 text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl disabled:opacity-40 hover:border-rose-300 hover:text-rose-500 transition">Next →</button>
      </div>
    </div>
  );
}
