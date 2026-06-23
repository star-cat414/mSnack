import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cookie, LogOut, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('admin_token');
  const isAdminPage = location.pathname.includes('/admin/dashboard');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Cookie className="h-7 w-7 text-brand-500 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-bold text-xl tracking-tight text-gray-900">
            M's <span className="text-brand-500">Snacks</span>
          </span>
        </Link>

        <div>
          {token ? (
            <div className="flex items-center space-x-4">
              {!isAdminPage && (
                <Link to="/admin/dashboard" className="text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-md">
                  Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center space-x-1 font-medium text-sm text-gray-500 hover:text-red-600 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/admin/login" 
              className="text-gray-400 hover:text-brand-500 transition-colors p-2 rounded-full"
              title="Admin Portal"
            >
              <ShieldAlert className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}