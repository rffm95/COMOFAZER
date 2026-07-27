import { Receita } from '../types';
import { Star, ChevronRight, Beer, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface RecipeCardProps {
  recipe: Receita;
  isFavorite: boolean;
  toggleFavorite: (e: React.MouseEvent, id: string) => void;
  onClick: () => void;
}

export default function RecipeCard({ recipe, isFavorite, toggleFavorite, onClick }: RecipeCardProps) {
  const badgeStyles: Record<string, string> = {
    'Cocktails': 'bg-slate-800 text-slate-300',
    'Sem Álcool': 'bg-emerald-950 text-emerald-400',
    'Sangrias': 'bg-rose-950 text-rose-400',
    'Garnish de Gins': 'bg-indigo-950 text-indigo-400'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl hover:border-amber-500/50 transition-all cursor-pointer flex flex-col gap-4 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start">
        <span className={`badge text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${badgeStyles[recipe.categoria] || 'bg-slate-800 text-slate-400'}`}>
          {recipe.categoria}
        </span>
        <button
          onClick={(e) => toggleFavorite(e, recipe.id)}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite 
              ? 'text-amber-500 bg-amber-500/10' 
              : 'text-slate-600 hover:text-amber-500'
          }`}
        >
          <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-col gap-1 pr-4">
        <h3 className="text-lg font-black text-white uppercase italic leading-none group-hover:text-amber-500 transition-colors">
          {recipe.nome}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-950 px-2 py-1 rounded">
          <Beer size={10} className="text-amber-500" />
          <span>{recipe.copo}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-950 px-2 py-1 rounded">
          <Info size={10} className="text-amber-500" />
          <span>{recipe.tecnica}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          {recipe.ingredientes.length} ITEMS
        </span>
        <ChevronRight size={14} className="text-slate-700 group-hover:text-amber-500 transition-colors" />
      </div>
    </motion.div>
  );
}
