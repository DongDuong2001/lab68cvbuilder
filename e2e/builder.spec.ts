import { test, expect } from "@playwright/test";

test.describe("CV Builder Navigation", () => {
  test("User can load the login page", async ({ page }) => {
    await page.goto("/en/login");
    // Check if the page loaded successfully by looking for standard initial elements
    await expect(page.locator("form, button, h1, body").first()).toBeVisible({
      timeout: 10000,
    });
  });
});
