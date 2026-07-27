import { Receita } from '../types';
import { X, Star, CupSoda, Info, ListNumbers, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeDetailProps {
  recipe: Receita;
  onClose: () => void;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}

export default function RecipeDetail({ recipe, onClose, isFavorite, toggleFavorite }: RecipeDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-3xl bg-slate-900 rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh] border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 md:p-10 border-b border-slate-800 bg-slate-900">
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className={`p-2.5 rounded-xl bg-slate-800 border border-slate-700 transition-colors ${
                isFavorite ? 'text-amber-500 bg-amber-500/10 border-amber-500/50' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="max-w-[85%]">
            <span className="text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-2 block">
              {recipe.categoria}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic uppercase leading-none mb-6">
              {recipe.nome}
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Copo</p>
                <p className="text-sm font-bold text-slate-200">{recipe.copo}</p>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Técnica</p>
                <p className="text-sm font-bold text-slate-200">{recipe.tecnica}</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-lg">
                <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest">Garnish</p>
                <p className="text-sm font-bold text-amber-500">{recipe.garnish}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 no-scrollbar">
          {/* Ingredientes */}
          <section>
            <h3 className="text-lg font-black text-white uppercase italic tracking-widest flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              Ingredientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredientes.map((ing, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-colors">
                  <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                    {ing.nome}
                  </span>
                  <div className="flex items-baseline gap-1.5 ml-4">
                    <span className="text-lg font-black text-amber-500">{ing.quantidade}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{ing.unidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Preparação */}
          <section>
            <h3 className="text-lg font-black text-white uppercase italic tracking-widest flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              Preparação
            </h3>
            <div className="space-y-4">
              {recipe.passos.map((passo, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-amber-500 flex items-center justify-center font-black text-lg group-hover:border-amber-500/50 transition-colors">
                    {idx + 1}
                  </div>
                  <p className="text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed pt-1.5 text-base">
                    {passo}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Notas Adicionais */}
          {recipe.observacoes && (
            <section className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>
              <div className="flex items-center gap-2 mb-3 text-slate-500">
                <MessageCircle size={18} />
                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Observações de Serviço</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic">{recipe.observacoes}</p>
            </section>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-8 bg-slate-900 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20"
          >
            Fechar Manual
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Leaf({ size, className, ...props }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className} 
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13L11 20z" />
      <path d="M9 13c.5-2 1.5-3.5 3-4" />
      <path d="M11 20c-1 1-3 1-4 1" />
    </svg>
  );
}
