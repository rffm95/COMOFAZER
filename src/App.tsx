import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, LayoutGrid, List, SearchX, Star, X } from "lucide-react";
import { RECIPES } from "./data/recipes";
import { GIN_GARNISHES } from "./data/ginGarnish";
import { getDrinkImage } from "./data/drinkImages";
import { Categoria, Receita } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { matchesQuery } from "./lib/search";
import Header from "./components/Header";
import CategoryFilters from "./components/CategoryFilters";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import GinGarnishTable from "./components/GinGarnishTable";
import DrinkImage from "./components/DrinkImage";

const prefersCompact = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(max-width: 640px)").matches;

export default function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("dark-mode", true);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);
  const [layout, setLayout] = useLocalStorage<"grid" | "list">(
    "cheers-layout",
    prefersCompact() ? "list" : "grid",
  );
  const [activeCategory, setActiveCategory] = useState<Categoria | "Todos">(
    "Todos",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Receita | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sort, setSort] = useState<"menu" | "az">("menu");

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDarkMode ? "#0f0e0c" : "#f6f1e7");
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
            [
              gin.gin,
              "gin tonica",
              gin.tonica,
              gin.garnish,
              gin.notas || "",
            ].join(" "),
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
  const isBrowsing = !searchQuery && !showFavorites;

  const reset = () => {
    setSearchQuery("");
    setShowFavorites(false);
    setActiveCategory("Todos");
  };

  const title = showFavorites
    ? "Os teus favoritos"
    : searchQuery
      ? "Resultados"
      : activeCategory === "Todos"
        ? "Todas as bebidas"
        : activeCategory === "Garnish de Gins"
          ? "Gin & tónica"
          : activeCategory;

  const heroRecipe =
    RECIPES.find((r) => r.id === "pornstar-martini") || RECIPES[0];

  return (
    <div className="app">
      <a className="skip-link" href="#bebidas">
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

      <main className="page">
        {isBrowsing && activeCategory === "Todos" && (
          <section className="intro" aria-label="Manual de bar Cheers">
            <div className="intro-copy">
              <p className="kicker">Cheers Experiences · Equipa de bar</p>
              <h1>
                Cada medida, <em>cada detalhe.</em>
              </h1>
              <p className="intro-lead">
                Receitas, medidas, copos e garnish da casa, prontos a consultar
                em segundos durante o serviço.
              </p>
              <ul className="intro-stats">
                <li>
                  <b>{RECIPES.length}</b> receitas
                </li>
                <li>
                  <b>{GIN_GARNISHES.length}</b> gins com garnish
                </li>
                <li>
                  <b>{counts["Sem Álcool"]}</b> sem álcool
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="feature"
              onClick={() => setSelectedRecipe(heroRecipe)}
              aria-label={"Abrir ficha: " + heroRecipe.nome}
            >
              <DrinkImage
                name={heroRecipe.nome}
                imageId={heroRecipe.id}
                eager
              />
              <span className="feature-caption">
                <span>
                  <small>Assinatura da casa</small>
                  <strong>{heroRecipe.nome}</strong>
                </span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </button>
          </section>
        )}

        <section
          id="bebidas"
          className="collection"
          aria-label="Bebidas e receitas"
        >
          <div className="collection-bar">
            <CategoryFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              counts={counts}
            />
          </div>

          <div className="collection-head">
            <h2>
              {title}
              <span className="count" role="status" aria-live="polite">
                {total} {total === 1 ? "resultado" : "resultados"}
              </span>
            </h2>
            <div className="collection-controls">
              <label className="select">
                <span className="sr-only">Ordenar</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "menu" | "az")}
                >
                  <option value="menu">Ordem da casa</option>
                  <option value="az">A–Z</option>
                </select>
              </label>
              {activeCategory !== "Garnish de Gins" && (
                <div
                  className="segmented"
                  role="group"
                  aria-label="Apresentação"
                >
                  <button
                    type="button"
                    aria-label="Vista em cartões"
                    aria-pressed={layout === "grid"}
                    onClick={() => setLayout("grid")}
                  >
                    <LayoutGrid size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Vista em lista rápida"
                    aria-pressed={layout === "list"}
                    onClick={() => setLayout("list")}
                  >
                    <List size={19} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {!isBrowsing && (
            <div className="active-filters">
              {searchQuery && <span>“{searchQuery}”</span>}
              {showFavorites && (
                <span>
                  <Star size={13} aria-hidden="true" /> Só favoritos
                </span>
              )}
              <button type="button" onClick={reset}>
                Limpar <X size={14} aria-hidden="true" />
              </button>
            </div>
          )}

          {total ? (
            <>
              {filteredRecipes.length > 0 && (
                <div
                  className={layout === "list" ? "recipe-list" : "recipe-grid"}
                >
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      variant={layout}
                      isFavorite={favorites.includes(recipe.id)}
                      toggleFavorite={toggleFavorite}
                      onOpen={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              )}
              {filteredGins.length > 0 && (
                <section className="gin-section" aria-label="Gin & tónica">
                  {filteredRecipes.length > 0 && (
                    <div className="subsection-head">
                      <h2>Gin & tónica</h2>
                      <p>Tónica e garnish certos para cada gin.</p>
                    </div>
                  )}
                  <GinGarnishTable
                    data={filteredGins}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                </section>
              )}
            </>
          ) : (
            <div className="empty-state">
              {showFavorites && !searchQuery ? (
                <Star size={32} aria-hidden="true" />
              ) : (
                <SearchX size={34} aria-hidden="true" />
              )}
              <h3>
                {showFavorites && !favorites.length
                  ? "Ainda sem favoritos"
                  : "Não encontrámos essa bebida"}
              </h3>
              <p>
                {showFavorites && !favorites.length
                  ? "Toca na estrela de uma bebida para a teres sempre à mão aqui."
                  : "Experimenta outro nome, um ingrediente (ex.: maracujá) ou um garnish."}
              </p>
              <button type="button" className="primary-button" onClick={reset}>
                Ver todas as bebidas
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span className="footer-brand">
          cheers<span>.</span>
        </span>
        <p>O cuidado está em cada detalhe.</p>
        <a
          href="https://menu.cheersexperiences.com/cheers"
          target="_blank"
          rel="noreferrer"
        >
          Consultar a carta <ArrowUpRight size={15} aria-hidden="true" />
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
