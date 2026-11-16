import { Info, Leaf, Search, Star } from "lucide-react";
import { GinGarnish } from "../types";
import DrinkImage from "./DrinkImage";
import "./GinGarnishTable.css";

interface GinGarnishTableProps {
  data: GinGarnish[];
  searchQuery: string;
  favorites?: string[];
  toggleFavorite?: (id: string) => void;
  showSummary?: boolean;
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-PT")
    .trim();

export function filterGins(data: GinGarnish[], searchQuery: string) {
  const terms = normalize(searchQuery).split(/\s+/).filter(Boolean);
  return data.filter((item) => {
    const searchable = normalize(
      `${item.gin} ${item.tonica} ${item.garnish} ${item.notas || ""}`,
    );
    return terms.every((term) => searchable.includes(term));
  });
}

export default function GinGarnishTable({
  data,
  searchQuery,
  favorites = [],
  toggleFavorite,
  showSummary = true,
}: GinGarnishTableProps) {
  const filtered = filterGins(data, searchQuery);
  return (
    <div className="gin-guide">
      {showSummary && (
        <p className="gin-results" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "gin disponível" : "gins disponíveis"}{" "}
          <span>· Tónica e garnish de serviço</span>
        </p>
      )}
      {filtered.length ? (
        <div className="gin-card-grid">
          {filtered.map((item) => {
            const favoriteId = `gin:${item.id}`;
            const isFavorite = favorites.includes(favoriteId);
            return (
              <article className="gin-service-card" key={item.id}>
                <div className="gin-card-photo">
                  <DrinkImage name={item.gin} className="gin-card-image" />
                  {toggleFavorite && (
                    <button
                      type="button"
                      className={`gin-save-button${isFavorite ? " is-saved" : ""}`}
                      onClick={() => toggleFavorite(favoriteId)}
                      aria-pressed={isFavorite}
                      aria-label={`${isFavorite ? "Remover" : "Guardar"} ${item.gin} ${isFavorite ? "dos" : "nos"} favoritos`}
                    >
                      <Star
                        size={18}
                        fill={isFavorite ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
                <div className="gin-card-content">
                  <span className="gin-card-eyebrow">Gin & tónica</span>
                  <h3>{item.gin}</h3>
                  <dl>
                    <div>
                      <dt>Tónica</dt>
                      <dd>{item.tonica}</dd>
                    </div>
                  </dl>
                  <div className="gin-garnish-line">
                    <Leaf size={16} aria-hidden="true" />
                    <p>
                      <span>Garnish</span>
                      {item.garnish}
                    </p>
                  </div>
                  {item.notas && <p className="gin-card-note">{item.notas}</p>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="gin-empty">
          <Search size={26} aria-hidden="true" />
          <h3>Nenhum gin encontrado</h3>
          <p>Tenta outro nome, uma tónica ou um garnish.</p>
        </div>
      )}
      <aside className="gin-service-policy">
        <Info size={18} aria-hidden="true" />
        <p>
          <strong>Padrão de serviço Cheers.</strong> Nas receitas que indicavam
          Fever Tree, servir tónica 1724.
        </p>
      </aside>
    </div>
  );
}
