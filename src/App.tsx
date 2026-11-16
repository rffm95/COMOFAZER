import { useState, useMemo, useEffect } from "react";
import { RECIPES } from "./data/recipes";
import { GIN_GARNISHES } from "./data/ginGarnish";
import { Categoria, Receita } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Header from "./components/Header";
import CategoryFilters from "./components/CategoryFilters";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import GinGarnishTable from "./components/GinGarnishTable";
import DrinkImage from "./components/DrinkImage";
import {
  ArrowUpRight,
  SearchX,
  Star,
  BookOpen,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { matchesQuery } from "./lib/search";
import { getDrinkImage } from "./data/drinkImages";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("dark-mode", false);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);
  const [activeCategory, setActiveCategory] = useState<Categoria | "Todos">(
    "Todos",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Receita | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [layout, setLayout] = useLocalStorage<"grid" | "list">(
    "cheers-layout",
    "grid",
  );
  const [sort, setSort] = useState("menu");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);
  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  const filteredRecipes = useMemo(
    () =>
      RECIPES.filter(
        (recipe) =>
          (activeCategory === "Todos" || recipe.categoria === activeCategory) &&
          (!showFavorites || favorites.includes(recipe.id)) &&
          matchesQuery(
            searchQuery,
            [
              recipe.nome,
              recipe.categoria,
              recipe.copo,
              recipe.tecnica,
              recipe.garnish,
              ...recipe.tags,
              ...recipe.ingredientes.map((i) => i.nome),
            ].join(" "),
          ),
      ).sort((a, b) =>
        sort === "az"
          ? a.nome.localeCompare(b.nome, "pt")
          : Number(Boolean(getDrinkImage(b.id))) -
            Number(Boolean(getDrinkImage(a.id))),
      ),
    [searchQuery, activeCategory, showFavorites, favorites, sort],
  );
  const filteredGins = useMemo(
    () =>
      GIN_GARNISHES.filter(
        (gin) =>
          (activeCategory === "Todos" ||
            activeCategory === "Garnish de Gins") &&
          (!showFavorites || favorites.includes("gin:" + gin.id)) &&
          matchesQuery(
            searchQuery,
            [gin.gin, "gin", gin.tonica, gin.garnish, gin.notas || ""].join(
              " ",
            ),
          ),
      ).sort((a, b) => (sort === "az" ? a.gin.localeCompare(b.gin, "pt") : 0)),
    [searchQuery, activeCategory, showFavorites, favorites, sort],
  );
  const counts = {
    Todos: RECIPES.length + GIN_GARNISHES.length,
    Cocktails: RECIPES.filter((r) => r.categoria === "Cocktails").length,
    "Sem Álcool": RECIPES.filter((r) => r.categoria === "Sem Álcool").length,
    Sangrias: RECIPES.filter((r) => r.categoria === "Sangrias").length,
    "Garnish de Gins": GIN_GARNISHES.length,
  };
  const total = filteredRecipes.length + filteredGins.length;
  const reset = () => {
    setSearchQuery("");
    setShowFavorites(false);
    setActiveCategory("Todos");
  };
  const categoryTitle =
    activeCategory === "Todos"
      ? "A coleção de bebidas"
      : activeCategory === "Garnish de Gins"
        ? "Gins & garnish"
        : activeCategory;
  const heroRecipe =
    RECIPES.find((r) => r.id === "pornstar-martini") || RECIPES[3];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#collection">
        Saltar para as bebidas
      </a>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        showFavorites={showFavorites}
        setShowFavorites={(show) => {
          setShowFavorites(show);
          setActiveCategory("Todos");
        }}
        favoritesCount={favorites.length}
      />
      <main className="main-content">
        {!searchQuery && !showFavorites && (
          <section
            className="editorial-hero"
            aria-label="O manual de bar Cheers"
          >
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> CHEERS EXPERIENCES{" "}
                <span className="eyebrow-divider">/</span> EQUIPA DE BAR
              </p>
              <h1>
                A arte de servir.
                <br />
                <em>O detalhe de cada bebida.</em>
              </h1>
              <p className="hero-description">
                Da primeira medida ao último toque. Receitas, técnicas e
                apresentação, sempre à mão.
              </p>
              <div className="hero-meta">
                <span>
                  <BookOpen size={16} /> {RECIPES.length} receitas de bar
                </span>
                <span>{GIN_GARNISHES.length} gins & garnish</span>
                <span className="hero-meta-last">Um serviço de excelência</span>
              </div>
            </div>
            <button
              className="hero-feature"
              onClick={() => setSelectedRecipe(heroRecipe)}
              aria-label={"Ver receita de " + heroRecipe.nome}
            >
              <DrinkImage name={heroRecipe.nome} recipeId={heroRecipe.id} />
              <div className="hero-feature-caption">
                <span>
                  <small>DA NOSSA CARTA</small>
                  <strong>{heroRecipe.nome}</strong>
                </span>
                <ArrowUpRight size={23} />
              </div>
            </button>
          </section>
        )}
        <section
          id="collection"
          className="collection"
          aria-label="Bebidas e receitas"
        >
          <CategoryFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            counts={counts}
          />
          <div className="collection-heading">
            <div>
              <p className="eyebrow">
                {showFavorites ? "A TUA SELEÇÃO" : "CONSULTA RÁPIDA"}
              </p>
              <h2>
                {showFavorites
                  ? "Os teus favoritos"
                  : searchQuery
                    ? "Resultados da pesquisa"
                    : categoryTitle}
                <span className="result-count" role="status" aria-live="polite">
                  {total} {total === 1 ? "bebida" : "bebidas"}
                </span>
              </h2>
            </div>
            <div className="collection-controls">
              <label className="sort-control">
                <span className="sr-only">Ordenar bebidas</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="menu">Ordem da casa</option>
                  <option value="az">Nome: A–Z</option>
                </select>
              </label>
              <div
                className="view-switch"
                role="group"
                aria-label="Apresentação das bebidas"
              >
                <button
                  aria-label="Vista em grelha"
                  aria-pressed={layout === "grid"}
                  onClick={() => setLayout("grid")}
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  aria-label="Vista em lista"
                  aria-pressed={layout === "list"}
                  onClick={() => setLayout("list")}
                >
                  <List size={19} />
                </button>
              </div>
            </div>
          </div>
          {(searchQuery || showFavorites) && (
            <div className="active-filters">
              {searchQuery && <span>Pesquisa: “{searchQuery}”</span>}
              {showFavorites && (
                <span>
                  <Star size={13} /> Só favoritos
                </span>
              )}
              <button onClick={reset}>
                Limpar filtros <X size={13} />
              </button>
            </div>
          )}
          {total ? (
            <div
              className={
                "results-layout " + (layout === "list" ? "is-list" : "")
              }
            >
              {filteredRecipes.length > 0 && (
                <div className="recipe-grid">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favorites.includes(recipe.id)}
                      toggleFavorite={(event, id) => {
                        event.stopPropagation();
                        toggleFavorite(id);
                      }}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              )}
              {filteredGins.length > 0 && (
                <section className="gin-section" aria-label="Gins e garnish">
                  {filteredRecipes.length > 0 && (
                    <div className="subsection-heading">
                      <h2>Gins & garnish</h2>
                      <span>A combinação certa, em cada serviço.</span>
                    </div>
                  )}
                  <GinGarnishTable
                    data={filteredGins}
                    searchQuery=""
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    showSummary={false}
                  />
                </section>
              )}
            </div>
          ) : (
            <div className="empty-state">
              {showFavorites && !searchQuery ? (
                <Star size={32} />
              ) : (
                <SearchX size={36} />
              )}
              <h3>
                {showFavorites && !favorites.length
                  ? "As tuas bebidas, sempre à mão."
                  : "Não encontrámos essa bebida."}
              </h3>
              <p>
                {showFavorites && !favorites.length
                  ? "Toca na estrela de uma bebida para a guardar aqui."
                  : "Experimenta outro nome, ingrediente ou garnish, ou remove os filtros."}
              </p>
              <button className="primary-button" onClick={reset}>
                Explorar todas as bebidas <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">cheers.</span>
        <p>
          O cuidado está em cada detalhe.
          <small>MANUAL DE BAR · CHEERS EXPERIENCES</small>
        </p>
        <a
          href="https://menu.cheersexperiences.com/cheers"
          target="_blank"
          rel="noreferrer"
        >
          Consultar a carta <ArrowUpRight size={15} />
        </a>
      </footer>
      {selectedRecipe && (
        <RecipeDetail
          key={selectedRecipe.id}
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favorites.includes(selectedRecipe.id)}
          toggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
