import { describe, expect, it } from "vitest";
import { filterCategories, formatPrice } from "./menu";

describe("formatPrice", () => {
  it("formats cents to USD", () => {
    expect(formatPrice(1250)).toBe("$12.50");
  });
});

describe("filterCategories", () => {
  const categories = [
    {
      id: "sandwiches",
      name: "Sandwiches",
      items: [
        {
          id: "1",
          name: "Turkey Club",
          description: "Bacon and turkey",
          category: "Sandwiches",
          imageUrl: null,
          variations: [],
        },
      ],
    },
  ];

  it("filters by search term", () => {
    const result = filterCategories(categories, null, "turkey");
    expect(result).toHaveLength(1);
    expect(result[0].items).toHaveLength(1);
  });

  it("returns no categories if search misses", () => {
    const result = filterCategories(categories, null, "pasta");
    expect(result).toHaveLength(0);
  });
});
