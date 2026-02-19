import axios from "axios";
import type {
  CatalogCategoryDto,
  CatalogResponseDto,
  LocationDto,
} from "../types";
import { logger } from "../lib/logger";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  logger.debug("API request", {
    method: config.method?.toUpperCase() ?? "GET",
    url: config.url ?? "",
    params: config.params ?? null,
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    logger.debug("API response", {
      method: response.config.method?.toUpperCase() ?? "GET",
      url: response.config.url ?? "",
      statusCode: response.status,
    });
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      logger.error("API request failed", {
        method: error.config?.method?.toUpperCase() ?? "GET",
        url: error.config?.url ?? "",
        statusCode: error.response?.status ?? null,
        message: error.message,
      });
    } else {
      logger.error("API request failed with unknown error", {
        error: String(error),
      });
    }
    return Promise.reject(error);
  },
);

export async function getLocations(): Promise<LocationDto[]> {
  const response = await api.get<LocationDto[]>("/api/locations");
  return response.data;
}

export async function getCatalog(locationId: string): Promise<CatalogResponseDto> {
  const response = await api.get<CatalogResponseDto>("/api/catalog", {
    params: { location_id: locationId },
  });
  return response.data;
}

export async function getCatalogCategories(
  locationId: string,
): Promise<CatalogCategoryDto[]> {
  const response = await api.get<CatalogCategoryDto[]>("/api/catalog/categories", {
    params: { location_id: locationId },
  });
  return response.data;
}
