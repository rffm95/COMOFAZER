import { Categoria } from '../types';
import { Martini, CupSoda, Droplets, Leaf } from 'lucide-react';

interface CategoryFiltersProps {
  activeCategory: Categoria | 'Todos';
  setActiveCategory: (category: Categoria | 'Todos') => void;
  counts: Record<string, number>;
}

export default function CategoryFilters({
  activeCategory,
  setActiveCategory,
  counts
}: CategoryFiltersProps) {
  const categories = [
    { id: 'Todos', label: 'Todos', icon: null },
    { id: 'Cocktails', label: 'Cocktails', icon: <Martini size={16} /> },
    { id: 'Sem Álcool', label: 'Sem Álcool', icon: <CupSoda size={16} /> },
    { id: 'Sangrias', label: 'Sangrias', icon: <Droplets size={16} /> },
    { id: 'Garnish de Gins', label: 'Gins', icon: <Leaf size={16} /> },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-4 md:px-0">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id as any)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all text-xs font-black uppercase tracking-wider border ${
            activeCategory === cat.id
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
          }`}
        >
          {cat.icon && <span className="opacity-70">{cat.icon}</span>}
          {cat.label}
          <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
            activeCategory === cat.id
              ? 'bg-slate-950/20 text-slate-900'
              : 'bg-slate-700 text-slate-500'
          }`}>
            {counts[cat.id] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
