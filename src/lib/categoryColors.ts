export function getCategoryColors(category: string | undefined): { bg: string, text: string } {
  const cat = (category || 'Other').toLowerCase();
  
  // Mapping predefined categories to specific clay colors
  if (cat.includes('wedding') || cat.includes('marriage')) {
    return { bg: 'bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800', text: 'text-pink-700 dark:text-pink-400' };
  }
  if (cat.includes('birthday')) {
    return { bg: 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-400' };
  }
  if (cat.includes('baby shower') || cat.includes('naming')) {
    return { bg: 'bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-400' };
  }
  if (cat.includes('engagement') || cat.includes('reception')) {
    return { bg: 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-400' };
  }
  if (cat.includes('corporate') || cat.includes('office')) {
    return { bg: 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400' };
  }
  if (cat.includes('party')) {
    return { bg: 'bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400' };
  }
  
  // Default for "Other" or unknown
  return { bg: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-400' };
}
