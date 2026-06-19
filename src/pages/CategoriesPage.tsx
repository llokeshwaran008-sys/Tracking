import React, { useState, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { Skeleton } from '../components/ui/Skeleton';
import { getCategoryColors } from '../lib/categoryColors';
import { cn } from '../lib/utils';

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

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl animate-float-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient-clay">Categories Manager</h2>
        <p className="text-muted-foreground mt-1">Manage the types of functions and events you book.</p>
      </div>

      <div className="clay-card bg-card p-6 border border-border/50">
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Anniversary Party"
            className="clay-input flex-1 px-4 py-2 bg-secondary/60 text-foreground"
          />
          <button
            type="submit"
            disabled={!newCategory.trim()}
            className="clay-btn px-5 py-2 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, hsl(252 80% 60%), hsl(220 80% 62%))' }}
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Existing Categories</h3>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-2xl border-2 border-dashed border-border/60">
              <span className="text-4xl opacity-50 block mb-2">🏷️</span>
              <p>No categories found.</p>
            </div>
          ) : (
            categories.map((category, index) => {
              const catColor = getCategoryColors(category);
              return (
                <div 
                  key={category} 
                  className="clay-item flex items-center justify-between p-4 bg-card group animate-float-in"
                  style={{ animationDelay: `${index * 50}ms`, cursor: 'default' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl border", catColor.bg, catColor.text)}>
                      <Tag className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">{category}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(category)}
                    className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    title="Remove category"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
