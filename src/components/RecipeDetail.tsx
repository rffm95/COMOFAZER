import { useEffect, useId, useRef, useState } from "react";
import { Check, Leaf, RotateCcw, Star, Wine, X } from "lucide-react";
import { Receita } from "../types";
import DrinkImage from "./DrinkImage";
import "./RecipeDetail.css";

interface RecipeDetailProps {
  recipe: Receita;
  onClose: () => void;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}

export default function RecipeDetail({
  recipe,
  onClose,
  isFavorite,
  toggleFavorite,
}: RecipeDetailProps) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = useRef(onClose);
  const [completed, setCompleted] = useState<number[]>([]);
  close.current = onClose;

  useEffect(() => {
    setCompleted([]);
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) {
        event.preventDefault();
        panel.current.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
      else
        document
          .querySelector<HTMLInputElement>(".header-search input")
          ?.focus();
    };
  }, [recipe.id]);

  const toggleStep = (index: number) =>
    setCompleted((current) =>
      current.includes(index)
        ? current.filter((step) => step !== index)
        : [...current, index],
    );

  return (
    <div
      className="recipe-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        className="recipe-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="recipe-dialog-toolbar">
          <span>
            Cheers <span className="recipe-toolbar-divider">/</span> Ficha de
            bar
          </span>
          <div className="recipe-dialog-actions">
            <button
              type="button"
              className={`recipe-icon-button${isFavorite ? " is-saved" : ""}`}
              onClick={() => toggleFavorite(recipe.id)}
              aria-pressed={isFavorite}
              aria-label={
                isFavorite ? "Remover dos favoritos" : "Guardar nos favoritos"
              }
            >
              <Star
                size={19}
                fill={isFavorite ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
            <button
              ref={closeButton}
              type="button"
              className="recipe-icon-button"
              onClick={onClose}
              aria-label="Fechar ficha"
            >
              <X size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="recipe-dialog-scroll">
          <header className="recipe-detail-header">
            <div className="recipe-detail-photo">
              <DrinkImage
                name={recipe.nome}
                recipeId={recipe.id}
                className="recipe-detail-image"
              />
            </div>
            <div className="recipe-detail-intro">
              <p className="recipe-eyebrow">{recipe.categoria}</p>
              <h2 id={titleId}>{recipe.nome}</h2>
              <p className="recipe-detail-summary">
                {recipe.ingredientes.length} ingredientes{" "}
                <span aria-hidden="true">·</span> {recipe.passos.length} passos
                de preparação
              </p>
              <dl className="recipe-service-facts">
                <div>
                  <dt>
                    <Wine size={16} aria-hidden="true" /> Copo
                  </dt>
                  <dd>{recipe.copo}</dd>
                </div>
                <div>
                  <dt>Técnica</dt>
                  <dd>{recipe.tecnica}</dd>
                </div>
              </dl>
            </div>
          </header>
          <div className="recipe-detail-body">
            <section
              className="recipe-ingredients"
              aria-labelledby={`${titleId}-ingredients`}
            >
              <div className="recipe-section-heading">
                <span className="recipe-section-number">01</span>
                <h3 id={`${titleId}-ingredients`}>Ingredientes</h3>
              </div>
              <ul className="recipe-ingredient-list">
                {recipe.ingredientes.map((ingredient, index) => (
                  <li key={index}>
                    <span>{ingredient.nome}</span>
                    <strong>
                      {ingredient.quantidade}{" "}
                      <small>{ingredient.unidade}</small>
                    </strong>
                  </li>
                ))}
              </ul>
              <div className="recipe-garnish">
                <h4>
                  <Leaf size={17} aria-hidden="true" /> Garnish & acabamento
                </h4>
                <p>{recipe.garnish}</p>
              </div>
            </section>
            <section
              className="recipe-preparation"
              aria-labelledby={`${titleId}-preparation`}
            >
              <div className="recipe-section-heading">
                <span className="recipe-section-number">02</span>
                <h3 id={`${titleId}-preparation`}>Preparação</h3>
              </div>
              <div className="recipe-step-status">
                <span aria-live="polite">
                  {completed.length === recipe.passos.length
                    ? "Preparação concluída"
                    : `${completed.length} de ${recipe.passos.length} passos concluídos`}
                </span>
                <button
                  type="button"
                  onClick={() => setCompleted([])}
                  disabled={completed.length === 0}
                >
                  <RotateCcw size={14} aria-hidden="true" /> Reiniciar
                </button>
              </div>
              <ol className="recipe-step-list">
                {recipe.passos.map((step, index) => (
                  <li
                    key={index}
                    className={completed.includes(index) ? "is-complete" : ""}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={completed.includes(index)}
                        onChange={() => toggleStep(index)}
                        aria-label={`Passo ${index + 1}: ${step}`}
                      />
                      <span className="recipe-step-marker" aria-hidden="true">
                        {completed.includes(index) ? (
                          <Check size={17} />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </span>
                      <span className="recipe-step-text">{step}</span>
                    </label>
                  </li>
                ))}
              </ol>
            </section>
          </div>
          {recipe.observacoes && (
            <aside className="recipe-service-note">
              <h3>Nota de serviço</h3>
              <p>{recipe.observacoes}</p>
            </aside>
          )}
          <footer className="recipe-detail-footer">
            <span>O cuidado está em cada detalhe.</span>
            <button type="button" onClick={onClose}>
              Voltar às bebidas
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
