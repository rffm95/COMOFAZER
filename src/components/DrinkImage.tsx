import { useState } from "react";
import { Martini } from "lucide-react";
import { getDrinkImage } from "../data/drinkImages";
import { GIN_GARNISHES } from "../data/ginGarnish";
import { RECIPES } from "../data/recipes";

interface Props {
  name: string;
  recipeId?: string;
  className?: string;
}
export default function DrinkImage({ name, recipeId, className = "" }: Props) {
  const id =
    recipeId ||
    GIN_GARNISHES.find((g) => g.gin === name)?.id ||
    RECIPES.find((r) => r.nome === name)?.id ||
    "";
  const image = getDrinkImage(id);
  const [failedSource, setFailedSource] = useState("");
  const available = image && image.src !== failedSource;
  return (
    <div
      className={
        "drink-image " +
        (available ? "" : "drink-image-placeholder ") +
        className
      }
    >
      {available ? (
        <>
          <img
            src={image.src}
            alt={
              name +
              (image.kind === "illustration"
                ? " — imagem ilustrativa da carta"
                : " — imagem da carta Cheers")
            }
            loading="lazy"
            decoding="async"
            onError={() => setFailedSource(image.src)}
          />
          {image.kind === "illustration" && (
            <span className="image-disclaimer">Imagem ilustrativa</span>
          )}
        </>
      ) : (
        <div className="image-placeholder-content">
          <span className="placeholder-frame">
            <Martini size={43} strokeWidth={0.85} aria-hidden="true" />
          </span>
          <span className="placeholder-monogram">CHEERS</span>
          <small>
            {image ? "Imagem indisponível" : "Sem fotografia na carta"}
          </small>
        </div>
      )}
    </div>
  );
}
