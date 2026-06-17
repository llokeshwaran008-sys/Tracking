import { supabase } from '../lib/supabase';

class CategoryService {
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (data || []).map(row => row.name);
  }

  async addCategory(name: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .insert({ name });

    if (error) {
      console.error('Error adding category:', error);
      return false;
    }

    return true;
  }

  async deleteCategory(name: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  }
}

export const categoryService = new CategoryService();
