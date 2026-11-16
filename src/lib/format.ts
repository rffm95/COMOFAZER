import { Ingrediente } from "../types";

/** Medida tal como um barman a lê: "5 cl", "Top", "1/2 jarra", "q.b.". */
export function formatMeasure({ quantidade, unidade }: Ingrediente) {
  if (quantidade === "q.b.") {
    return unidade === "completar" || unidade === "top" ? "Top" : "q.b.";
  }
  return { quantidade, unidade };
}

export function measureText(ingredient: Ingrediente) {
  const measure = formatMeasure(ingredient);
  return typeof measure === "string"
    ? measure
    : `${measure.quantidade} ${measure.unidade}`;
}

/** Nome curto para pré-visualizações (sem notas entre parênteses). */
export function shortName(name: string) {
  return name.replace(/\s*\(.*?\)\s*/g, " ").trim();
}
