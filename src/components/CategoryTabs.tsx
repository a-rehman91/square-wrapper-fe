import type { CatalogCategoryDto } from "../types";
import clsx from "clsx";

interface Props {
  categories: CatalogCategoryDto[];
  activeCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: Props) {
  return (
    <div className="categoryTabs">
      <button
        className={clsx("pill", { active: activeCategory === null })}
        onClick={() => onSelect(null)}
        type="button"
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={clsx("pill", { active: activeCategory === category.id })}
          onClick={() => onSelect(category.id)}
          type="button"
        >
          {category.name} ({category.itemCount})
        </button>
      ))}
    </div>
  );
}
