import React, { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  color: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    color: '#3b82f6'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setFormData({ name: '', type: '', color: '#3b82f6' });
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');
  const incomeCategories = categories.filter(cat => cat.type === 'INCOME');

  if (loading) {
    return (
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-gray-600">Loading categories...</p>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-gray-600">Manage your expense and income categories.</p>
      </header>

      {/* Add New Category Form */}
      <div className="panel">
        <div className="panel-title">Add New Category</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g., Groceries"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type
              </label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input w-full"
                required
              >
                <option value="">Select Type</option>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-12 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors cursor-pointer bg-gray-50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn primary"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {/* Expense Categories */}
        {expenseCategories.length > 0 && (
          <div className="panel">
            <div className="panel-title flex items-center gap-2">
              <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-gray-700 text-xs">-</span>
              Expense Categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income Categories */}
        {incomeCategories.length > 0 && (
          <div className="panel">
            <div className="panel-title flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-gray-700 text-xs">+</span>
              Income Categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {incomeCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length === 0 && (
          <div className="panel text-center py-8">
            <p className="text-gray-600">No categories yet. Create your first category above!</p>
          </div>
        )}
      </div>
    </section>
  );
}
