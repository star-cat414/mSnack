import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(username, password);
      localStorage.setItem('admin_token', data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or credential match.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-brand-50 rounded-full text-brand-500 mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Control Portal</h2>
          <p className="text-sm text-gray-400 mt-1">Authorized deployment management</p>
        </div>

        {error && <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Username</label>
            <input required type="text" className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
            <input required type="password" className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors mt-2">
            Authenticate Access
          </button>
        </form>
      </div>
    </div>
  );
}