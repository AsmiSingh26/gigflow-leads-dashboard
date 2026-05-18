import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('All fields are required'); return; }
    try {
      setLoading(true);
      const res = await loginApi(form);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-rose-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl border border-rose-100 dark:border-gray-700 text-gray-400 hover:text-rose-500 bg-white dark:bg-gray-900 transition"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-rose-200">
            G
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to GigFlow</h1>
          <p className="text-gray-400 mt-1">Sign in to manage your leads</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-rose-100 dark:border-gray-700 p-8">
          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
              <input type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-rose-400 to-rose-600 text-white py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-rose-200 mt-2">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-rose-500 hover:text-rose-600 font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
