import { Categoria } from "../types";
import { CupSoda, LayoutGrid, Leaf, Martini, Wine } from "lucide-react";

interface Props {
  activeCategory: Categoria | "Todos";
  setActiveCategory: (category: Categoria | "Todos") => void;
  counts: Record<string, number>;
}

const categories = [
  { id: "Todos", label: "Tudo", icon: LayoutGrid },
  { id: "Cocktails", label: "Cocktails", icon: Martini },
  { id: "Garnish de Gins", label: "Gin & tónica", icon: Leaf },
  { id: "Sem Álcool", label: "Sem álcool", icon: CupSoda },
  { id: "Sangrias", label: "Sangrias", icon: Wine },
] as const;

export default function CategoryFilters({
  activeCategory,
  setActiveCategory,
  counts,
}: Props) {
  return (
    <nav className="chips" aria-label="Categorias de bebidas">
      {categories.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          aria-pressed={activeCategory === id}
          onClick={() => setActiveCategory(id)}
          className={"chip" + (activeCategory === id ? " is-active" : "")}
        >
          <Icon size={17} aria-hidden="true" />
          <span>{label}</span>
          <b>{counts[id] || 0}</b>
        </button>
      ))}
    </nav>
  );
}
