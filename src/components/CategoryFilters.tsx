import { Categoria } from "../types";
import { Martini, CupSoda, Wine, Leaf, LayoutGrid } from "lucide-react";
interface Props {
  activeCategory: Categoria | "Todos";
  setActiveCategory: (category: Categoria | "Todos") => void;
  counts: Record<string, number>;
}
const categories = [
  { id: "Todos", label: "Todas as bebidas", icon: LayoutGrid },
  { id: "Cocktails", label: "Cocktails", icon: Martini },
  { id: "Sem Álcool", label: "Sem álcool", icon: CupSoda },
  { id: "Sangrias", label: "Sangrias", icon: Wine },
  { id: "Garnish de Gins", label: "Gins & garnish", icon: Leaf },
] as const;
export default function CategoryFilters({
  activeCategory,
  setActiveCategory,
  counts,
}: Props) {
  return (
    <nav className="category-filters" aria-label="Categorias de bebidas">
      {categories.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          aria-pressed={activeCategory === id}
          onClick={() => setActiveCategory(id)}
          className={
            "category-filter " + (activeCategory === id ? "active" : "")
          }
        >
          <Icon size={17} aria-hidden="true" />
          <span>{label}</span>
          <b>{counts[id] || 0}</b>
        </button>
      ))}
    </nav>
  );
}
