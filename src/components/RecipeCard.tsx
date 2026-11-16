import { Receita } from "../types";
import {
  Star,
  ArrowUpRight,
  GlassWater,
  SlidersHorizontal,
} from "lucide-react";
import DrinkImage from "./DrinkImage";
interface Props {
  recipe: Receita;
  isFavorite: boolean;
  toggleFavorite: (e: React.MouseEvent, id: string) => void;
  onClick: () => void;
}
export default function RecipeCard({
  recipe,
  isFavorite,
  toggleFavorite,
  onClick,
}: Props) {
  return (
    <article className="recipe-card">
      <button
        className="recipe-open"
        onClick={onClick}
        aria-label={"Ver receita de " + recipe.nome}
      >
        <div className="recipe-visual">
          <DrinkImage name={recipe.nome} recipeId={recipe.id} />
          <span className="recipe-category">{recipe.categoria}</span>
          <span className="image-open" aria-hidden="true">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <div className="recipe-copy">
          <h3>{recipe.nome}</h3>
          <p className="recipe-flavours">
            {recipe.tags.slice(0, 3).join(" · ")}
          </p>
          <div className="recipe-specs">
            <span>
              <GlassWater size={14} />
              {recipe.copo}
            </span>
            <span>
              <SlidersHorizontal size={14} />
              {recipe.tecnica}
            </span>
          </div>
          <div className="recipe-bottom">
            <span>
              {recipe.ingredientes.length} ingredientes <i>·</i>{" "}
              {recipe.passos.length} passos
            </span>
            <b>
              Ver receita <ArrowUpRight size={14} />
            </b>
          </div>
        </div>
      </button>
      <button
        className={"card-favorite " + (isFavorite ? "active" : "")}
        onClick={(e) => toggleFavorite(e, recipe.id)}
        aria-label={
          (isFavorite ? "Remover " : "Guardar ") +
          recipe.nome +
          (isFavorite ? " dos" : " nos") +
          " favoritos"
        }
        aria-pressed={isFavorite}
      >
        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
