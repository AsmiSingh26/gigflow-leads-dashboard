interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">🗑️</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Delete Lead</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}
