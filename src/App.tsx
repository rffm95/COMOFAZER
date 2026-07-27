import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RECIPES } from './data/recipes';
import { GIN_GARNISHES } from './data/ginGarnish';
import { Categoria, Receita } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import CategoryFilters from './components/CategoryFilters';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import GinGarnishTable from './components/GinGarnishTable';
import { Star, Inbox } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [activeCategory, setActiveCategory] = useState<Categoria | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Receita | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleFavorite = (e: React.MouseEvent | string, id?: string) => {
    if (typeof e === 'object') {
      e.stopPropagation();
    }
    const targetId = typeof e === 'string' ? e : id!;
    
    setFavorites(prev => 
      prev.includes(targetId) 
        ? prev.filter(fid => fid !== targetId) 
        : [...prev, targetId]
    );
  };

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter(recipe => {
      const matchesSearch = 
        recipe.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredientes.some(ing => ing.nome.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'Todos' || recipe.categoria === activeCategory;
      const matchesFavorites = !showFavorites || favorites.includes(recipe.id);
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchQuery, activeCategory, showFavorites, favorites]);

  const counts = useMemo(() => {
    const countsMap: Record<string, number> = {
      Todos: RECIPES.length,
      'Garnish de Gins': GIN_GARNISHES.length
    };
    
    RECIPES.forEach(r => {
      countsMap[r.categoria] = (countsMap[r.categoria] || 0) + 1;
    });
    
    return countsMap;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Filters Area */}
        {!showFavorites && (
          <CategoryFilters 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            counts={counts}
          />
        )}

        {showFavorites && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Meus Favoritos</h2>
            </div>
            <button 
              onClick={() => setShowFavorites(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors"
            >
              Voltar ao menu
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1">
          {activeCategory === 'Garnish de Gins' && !showFavorites ? (
            <GinGarnishTable data={GIN_GARNISHES} searchQuery={searchQuery} />
          ) : (
            <>
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard 
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={favorites.includes(recipe.id)}
                        toggleFavorite={toggleFavorite}
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-600 gap-4">
                  <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800">
                    <Inbox size={64} strokeWidth={1} className="opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white uppercase italic tracking-widest">Sem resultados</p>
                    <p className="text-sm mt-1">Tenta pesquisar por outro nome ou ingrediente.</p>
                  </div>
                  {(searchQuery || showFavorites || activeCategory !== 'Todos') && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setShowFavorites(false);
                        setActiveCategory('Todos');
                      }}
                      className="mt-4 px-6 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-amber-500 hover:bg-slate-800 transition-colors"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="py-12 px-4 text-center border-t border-slate-900 mt-auto bg-slate-950">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">
          Cheers Bar &bull; Operação de Balcão
        </p>
        <p className="text-[9px] text-slate-800 font-bold uppercase tracking-widest">
          Premium Operational Guide &copy; 2024
        </p>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetail 
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            isFavorite={favorites.includes(selectedRecipe.id)}
            toggleFavorite={(id) => toggleFavorite(id, id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
