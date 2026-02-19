import type { CategoryGroupDto } from "../types";

export function formatPrice(priceCents: number | null): string {
  if (priceCents === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceCents / 100);
}

export function filterCategories(
  categories: CategoryGroupDto[],
  activeCategory: string | null,
  search: string,
): CategoryGroupDto[] {
  const normalizedSearch = search.trim().toLowerCase();
  return categories
    .filter((category) => !activeCategory || category.id === activeCategory)
    .map((category) => {
      if (!normalizedSearch) return category;
      return {
        ...category,
        items: category.items.filter((item) => {
          const haystack = `${item.name} ${item.description}`.toLowerCase();
          return haystack.includes(normalizedSearch);
        }),
      };
    })
    .filter((category) => category.items.length > 0);
}
