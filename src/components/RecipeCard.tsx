import { ChevronRight, GlassWater, Star, Wand2 } from "lucide-react";
import { Receita } from "../types";
import { measureText, shortName } from "../lib/format";
import DrinkImage from "./DrinkImage";

interface Props {
  recipe: Receita;
  variant: "grid" | "list";
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onOpen: () => void;
}

export default function RecipeCard({
  recipe,
  variant,
  isFavorite,
  toggleFavorite,
  onOpen,
}: Props) {
  const preview = variant === "grid" ? recipe.ingredientes.slice(0, 3) : [];
  const hidden = recipe.ingredientes.length - preview.length;

  return (
    <article className={"recipe-card is-" + variant}>
      <button
        type="button"
        className="recipe-open"
        onClick={onOpen}
        aria-label={`Abrir ficha: ${recipe.nome}`}
      >
        <DrinkImage
          name={recipe.nome}
          imageId={recipe.id}
          className="recipe-thumb"
        />
        <div className="recipe-body">
          <p className="recipe-kicker">{recipe.categoria}</p>
          <h3>{recipe.nome}</h3>
          <p className="recipe-meta">
            <span>
              <GlassWater size={15} aria-hidden="true" />
              {recipe.copo}
            </span>
            <span>
              <Wand2 size={15} aria-hidden="true" />
              {recipe.tecnica}
            </span>
          </p>
          {variant === "grid" ? (
            <ul className="spec-preview" aria-label="Principais ingredientes">
              {preview.map((ingredient, index) => (
                <li key={index}>
                  <b>{measureText(ingredient)}</b>
                  <span>{shortName(ingredient.nome)}</span>
                </li>
              ))}
              {hidden > 0 && (
                <li className="spec-more">
                  + {hidden} {hidden === 1 ? "ingrediente" : "ingredientes"}
                </li>
              )}
            </ul>
          ) : (
            <p className="spec-line">
              {recipe.ingredientes
                .map((i) => `${measureText(i)} ${shortName(i.nome)}`)
                .join(" · ")}
            </p>
          )}
          {variant === "grid" && (
            <span className="recipe-cta" aria-hidden="true">
              Ver ficha <ChevronRight size={16} />
            </span>
          )}
        </div>
        {variant === "list" && (
          <ChevronRight className="row-chevron" size={20} aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        className={"fav-button" + (isFavorite ? " is-active" : "")}
        onClick={() => toggleFavorite(recipe.id)}
        aria-label={`${isFavorite ? "Remover" : "Guardar"} ${recipe.nome} ${isFavorite ? "dos" : "nos"} favoritos`}
        aria-pressed={isFavorite}
      >
        <Star
          size={18}
          fill={isFavorite ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>
    </article>
  );
}
