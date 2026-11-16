import { useEffect, useRef } from "react";
import { Search, Moon, Sun, Star, X, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  favoritesCount: number;
}
export default function Header(props: HeaderProps) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !document.querySelector('[aria-modal=\"true\"]') &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) &&
        !target.isContentEditable
      ) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="wordmark"
          href={import.meta.env.BASE_URL}
          aria-label="Cheers — início"
        >
          <span className="brand-seal" aria-hidden="true">
            c.
          </span>
          <span>
            <strong>
              cheers<span>.</span>
            </strong>
            <small>THE BAR MANUAL</small>
          </span>
        </a>
        <div className="header-search" role="search">
          <Search size={19} aria-hidden="true" />
          <input
            ref={input}
            aria-label="Pesquisar bebida, ingrediente ou garnish"
            type="search"
            placeholder="Encontra uma bebida, ingrediente ou garnish…"
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
          />
          {props.searchQuery ? (
            <button
              className="search-clear"
              aria-label="Limpar pesquisa"
              onClick={() => {
                props.setSearchQuery("");
                input.current?.focus();
              }}
            >
              <X size={17} />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>
        <div className="header-actions">
          <button
            className={
              "favorites-toggle " + (props.showFavorites ? "active" : "")
            }
            aria-label={
              "Favoritos: " + props.favoritesCount + " bebidas guardadas"
            }
            aria-pressed={props.showFavorites}
            onClick={() => props.setShowFavorites(!props.showFavorites)}
          >
            <Star
              size={17}
              fill={props.showFavorites ? "currentColor" : "none"}
            />
            <span>Favoritos</span>
            <b>{props.favoritesCount}</b>
          </button>
          <button
            className="icon-button theme-toggle"
            aria-label={
              props.isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"
            }
            onClick={props.toggleDarkMode}
          >
            {props.isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <a
            className="menu-link"
            href="https://menu.cheersexperiences.com/cheers"
            target="_blank"
            rel="noreferrer"
          >
            Ver carta <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </header>
  );
}
