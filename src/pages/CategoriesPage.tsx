import React, { useState, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { categoryService } from '../services/categoryService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await categoryService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setNewCategory('');
      // Optimistic UI update
      setCategories([...categories, cat]);
      const success = await categoryService.addCategory(cat);
      if (!success) {
        // Revert on failure
        loadCategories();
      }
    }
  };

  const handleRemove = async (cat: string) => {
    // Optimistic UI update
    setCategories(categories.filter(c => c !== cat));
    const success = await categoryService.deleteCategory(cat);
    if (!success) {
      // Revert on failure
      loadCategories();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Categories Manager</h2>
        <p className="text-muted-foreground mt-1">Manage the types of functions and events you book.</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Anniversary Party"
            className="flex-1 px-4 py-2 bg-secondary border-none rounded-md focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newCategory.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Existing Categories</h3>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">No categories found.</p>
          ) : (
            categories.map(category => (
              <div key={category} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50 group hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{category}</span>
                </div>
                <button
                  onClick={() => handleRemove(category)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove category"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
