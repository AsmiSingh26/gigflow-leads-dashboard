import type { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col border-r border-rose-50 dark:border-gray-700">
      <div className="p-6 border-b border-rose-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg">G</div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-white">GigFlow</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Leads Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <div className="bg-rose-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-rose-500">📊</span>
          <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Dashboard</span>
        </div>
      </nav>
      <div className="p-4 border-t border-rose-100 dark:border-gray-700">
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-2 py-2 mb-3 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-gray-800 transition">
          <span>{isDark ? '☀️' : '🌙'}</span>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
            <span className="text-xs bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition text-left px-2 py-1">
          → Sign out
        </button>
      </div>
    </aside>
  );
}
