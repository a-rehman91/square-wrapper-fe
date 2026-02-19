import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { getCatalog, getCatalogCategories, getLocations } from "./api/client";
import { CategoryTabs } from "./components/CategoryTabs";
import { LocationSelect } from "./components/LocationSelect";
import { MenuItemCard } from "./components/MenuItemCard";
import { logger } from "./lib/logger";
import { filterCategories } from "./lib/menu";
import type { CatalogCategoryDto, CatalogResponseDto, LocationDto } from "./types";

const LOCATION_STORAGE_KEY = "square-wrapper:selected-location";

function App() {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [catalog, setCatalog] = useState<CatalogResponseDto | null>(null);
  const [categories, setCategories] = useState<CatalogCategoryDto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({ locations: true, menu: false });
  const [error, setError] = useState<string | null>(null);

  const visibleCategories = useMemo(
    () => filterCategories(catalog?.categories ?? [], activeCategory, search),
    [catalog?.categories, activeCategory, search],
  );

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading((prev) => ({ ...prev, locations: true }));
        setError(null);
        const data = await getLocations();
        logger.info("Locations loaded", { count: data.length });
        setLocations(data);
        const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
        const fallback = data[0]?.id ?? "";
        const nextSelected = data.some((location) => location.id === saved)
          ? (saved as string)
          : fallback;
        logger.debug("Resolved selected location", {
          savedLocationId: saved,
          selectedLocationId: nextSelected,
        });
        setSelectedLocationId(nextSelected);
      } catch (error: unknown) {
        logger.error("Failed to load locations", {
          error: error instanceof Error ? error.message : String(error),
        });
        setError("Unable to load locations.");
      } finally {
        setLoading((prev) => ({ ...prev, locations: false }));
      }
    };

    void loadLocations();
  }, []);

  useEffect(() => {
    if (!selectedLocationId) return;
    logger.info("Loading menu for location", { selectedLocationId });
    localStorage.setItem(LOCATION_STORAGE_KEY, selectedLocationId);
    const loadMenu = async () => {
      try {
        setLoading((prev) => ({ ...prev, menu: true }));
        setError(null);
        const [categoryData, catalogData] = await Promise.all([
          getCatalogCategories(selectedLocationId),
          getCatalog(selectedLocationId),
        ]);
        logger.info("Menu data loaded", {
          selectedLocationId,
          categoryCount: categoryData.length,
          catalogCategoryCount: catalogData.categories.length,
        });
        setCategories(categoryData);
        setCatalog(catalogData);
      } catch (error: unknown) {
        logger.error("Failed to load menu data", {
          selectedLocationId,
          error: error instanceof Error ? error.message : String(error),
        });
        setError("Unable to load menu data.");
      } finally {
        setLoading((prev) => ({ ...prev, menu: false }));
      }
    };
    void loadMenu();
  }, [selectedLocationId]);

  return (
    <main className="container">
      <header className="header">
        <h1>Square Menu Viewer</h1>
        <p>Mobile-first menu browsing by location and category.</p>
      </header>

      {loading.locations ? (
        <div className="stateCard">Loading locations...</div>
      ) : locations.length > 0 ? (
        <LocationSelect
          locations={locations}
          selectedLocationId={selectedLocationId}
          onChange={(locationId) => {
            setActiveCategory(null);
            setSelectedLocationId(locationId);
          }}
        />
      ) : (
        <div className="stateCard">No active locations found.</div>
      )}

      <label className="stack">
        <span className="fieldLabel">Search menu</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or description"
        />
      </label>

      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={(categoryId) => {
            setActiveCategory(categoryId);
            if (categoryId) {
              document
                .getElementById(`category-${categoryId}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}

      {error && (
        <div className="stateCard error">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {loading.menu && <div className="stateCard">Loading menu...</div>}

      {!loading.menu && visibleCategories.length === 0 && !error && (
        <div className="stateCard">No items found for this location.</div>
      )}

      <section className="menuList">
        {visibleCategories.map((category) => (
          <div key={category.id} id={`category-${category.id}`} className="categoryBlock">
            <h2>{category.name}</h2>
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
