import { Search, Moon, Sun, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  favoritesCount: number;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  toggleDarkMode,
  showFavorites,
  setShowFavorites,
  favoritesCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 px-4 py-3 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              C
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Cheers <span className="text-amber-500 not-italic">Guide</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2 rounded-lg relative transition-colors ${
                showFavorites 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Star size={20} fill={showFavorites ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 w-full max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Pesquisar bebida ou ingrediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-slate-800 border border-slate-700 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
          />
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              showFavorites 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star size={16} fill={showFavorites ? "currentColor" : "none"} />
            <span>Favoritos</span>
            {favoritesCount > 0 && (
              <span className={`ml-1 w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                showFavorites ? 'bg-slate-950 text-white' : 'bg-slate-700 text-white'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>
          <div className="h-8 w-px bg-slate-800 mx-2"></div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
