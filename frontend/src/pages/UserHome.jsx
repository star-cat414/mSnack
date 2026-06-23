import React, { useState, useEffect } from 'react';
import { api } from '../api';
import SnackCard from '../components/SnackCard';

export default function UserHome() {
  const [categories, setCategories] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getSnacks()])
      .then(([catData, snackData]) => {
        setCategories(catData);
        setSnacks(snackData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setLoading(true);
    api.getSnacks(id).then(data => {
      setSnacks(data);
      setLoading(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Horizontal Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <button
          onClick={() => handleCategorySelect(null)}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-500'
          }`}
        >
          All Snacks
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Snack Grid Showcase */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading crispy deliciousness...</div>
      ) : snacks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
          No snacks discovered here yet!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {snacks.map(snack => (
            <SnackCard key={snack.id} snack={snack} />
          ))}
        </div>
      )}
    </div>
  );
}