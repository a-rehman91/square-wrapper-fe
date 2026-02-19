import { test, expect } from "@playwright/test";

test("menu flow smoke test", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page.getByText("Square Menu Viewer")).toBeVisible();
  await expect(page.getByLabel("Search menu")).toBeVisible();
});
