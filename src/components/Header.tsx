import { useEffect, useRef } from "react";
import { ArrowUpRight, Moon, Search, Star, Sun, X } from "lucide-react";

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
        !document.querySelector('[aria-modal="true"]') &&
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
    <header className="topbar">
      <div className="topbar-inner">
        <a
          className="brand"
          href={import.meta.env.BASE_URL}
          aria-label="Cheers, manual de bar: início"
        >
          <span className="brand-mark" aria-hidden="true">
            c.
          </span>
          <span className="brand-text">
            <strong>
              cheers<span>.</span>
            </strong>
            <small>Manual de bar</small>
          </span>
        </a>

        <div className="search" role="search">
          <Search size={20} aria-hidden="true" />
          <input
            ref={input}
            aria-label="Pesquisar bebida, ingrediente, copo ou garnish"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Bebida, ingrediente ou garnish"
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") props.setSearchQuery("");
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
          {props.searchQuery ? (
            <button
              type="button"
              className="search-clear"
              aria-label="Limpar pesquisa"
              onClick={() => {
                props.setSearchQuery("");
                input.current?.focus();
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className={
              "pill-button" + (props.showFavorites ? " is-active" : "")
            }
            aria-label={`Favoritos: ${props.favoritesCount} guardados`}
            aria-pressed={props.showFavorites}
            onClick={() => props.setShowFavorites(!props.showFavorites)}
          >
            <Star
              size={18}
              fill={props.showFavorites ? "currentColor" : "none"}
              aria-hidden="true"
            />
            <span className="pill-label">Favoritos</span>
            {props.favoritesCount > 0 && (
              <b className="pill-count">{props.favoritesCount}</b>
            )}
          </button>
          <button
            type="button"
            className="pill-button"
            aria-label={
              props.isDarkMode
                ? "Mudar para modo dia (fundo claro)"
                : "Mudar para modo bar (fundo escuro)"
            }
            onClick={props.toggleDarkMode}
          >
            {props.isDarkMode ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
            <span className="pill-label">
              {props.isDarkMode ? "Modo dia" : "Modo bar"}
            </span>
          </button>
          <a
            className="menu-link"
            href="https://menu.cheersexperiences.com/cheers"
            target="_blank"
            rel="noreferrer"
          >
            Carta <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
