import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SnackModal({ isOpen, onClose, onSave, snack, categories }) {
  const [formData, setFormData] = useState({
    title: '', price: '', caption: '', image_url: '', category_id: ''
  });

  useEffect(() => {
    if (snack) {
      setFormData({
        title: snack.title,
        price: snack.price,
        caption: snack.caption || '',
        image_url: snack.image_url || '',
        category_id: snack.category_id
      });
    } else {
      setFormData({
        title: '', price: '', caption: '', image_url: '', category_id: categories[0]?.id || ''
      });
    }
  }, [snack, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      category_id: parseInt(formData.category_id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden relative">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{snack ? 'Edit Snack' : 'Add New Snack'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Title *</label>
            <input required type="text" className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Price ($) *</label>
              <input required type="number" step="0.01" className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Category *</label>
              <select className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500 bg-white" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Image URL</label>
            <input type="url" className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Caption</label>
            <textarea rows="3" className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-gray-600 rounded-lg font-medium">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
