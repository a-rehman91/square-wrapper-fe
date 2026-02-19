import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./api/client", () => ({
  getLocations: vi.fn(async () => [
    {
      id: "loc_1",
      name: "Downtown",
      address: "1 Main St",
      timezone: "America/New_York",
      status: "ACTIVE",
    },
  ]),
  getCatalogCategories: vi.fn(async () => [
    { id: "sandwiches", name: "Sandwiches", itemCount: 1 },
  ]),
  getCatalog: vi.fn(async () => ({
    locationId: "loc_1",
    categories: [
      {
        id: "sandwiches",
        name: "Sandwiches",
        items: [
          {
            id: "item_1",
            name: "Turkey Club",
            description: "Toasted and tasty",
            category: "Sandwiches",
            imageUrl: null,
            variations: [{ id: "v1", name: "Regular", priceCents: 1200 }],
          },
        ],
      },
    ],
  })),
}));

describe("App integration", () => {
  it("renders menu and supports search", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Turkey Club")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search by name or description");
    await userEvent.type(searchInput, "pasta");
    expect(screen.queryByText("Turkey Club")).not.toBeInTheDocument();
  });
});
