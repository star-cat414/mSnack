import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import SnackModal from '../components/SnackModal';
import { Plus, Edit2, Trash2, FolderPlus } from 'lucide-react';

export default function AdminDashboard() {
  const [snacks, setSnacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnack, setEditingSnack] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login'); return; }

    refreshData();
  }, [navigate]);

  const refreshData = () => {
    Promise.all([api.getSnacks(), api.getCategories()])
      .then(([snackData, catData]) => {
        setSnacks(snackData);
        setCategories(catData);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory({ name: newCatName });
      setNewCatName('');
      refreshData();
    } catch (err) { alert(err.message); }
  };

  const handleSaveSnack = async (snackFields) => {
    try {
      if (editingSnack) {
        await api.updateSnack(editingSnack.id, snackFields);
      } else {
        await api.createSnack(snackFields);
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteSnack = async (id) => {
    if (window.confirm("Are you sure you want to delete this operational item?")) {
      try {
        await api.deleteSnack(id);
        refreshData();
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Perform complete operational CRUD metrics over inventories</p>
        </div>
        <button onClick={() => { setEditingSnack(null); setIsModalOpen(true); }} className="inline-flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 text-black font-semibold px-4 py-2.5 rounded-xl transition shadow-sm self-start">
          <Plus className="h-5 w-5" />
          <span>Add New Snack</span>
        </button>
      </div>

      {/* Category Creation Widget Block */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-md">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5"><FolderPlus className="h-4 w-4 text-brand-500" /> Quick Add Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input type="text" placeholder="e.g. Popcorn" className="border rounded-lg px-3 py-2 text-sm outline-none w-full focus:border-brand-500" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
          <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Create</button>
        </form>
      </div>

      {/* Management Grid Table Structure */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Snack Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {snacks.map((snack) => (
                <tr key={snack.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{snack.title}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {categories.find(c => c.id === snack.category_id)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 font-semibold">${snack.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setEditingSnack(snack); setIsModalOpen(true); }} className="p-1.5 inline-flex text-blue-600 hover:bg-blue-50 rounded-md transition" title="Edit"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteSnack(snack.id)} className="p-1.5 inline-flex text-red-600 hover:bg-red-50 rounded-md transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {snacks.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400 bg-white">No entries found matching parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SnackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSnack} snack={editingSnack} categories={categories} />
    </div>
  );
}