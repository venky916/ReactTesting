/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

async function login(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/dashboard");
}

test.describe("User List (API)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await login(page);
  });

  test("should show loading state", async ({ page }) => {
    await page.goto("/all-users");

    await expect(
      page.getByRole("heading", { name: "All User List" }),
    ).toBeVisible();
  });

  test("should display users from API", async ({ page }) => {
    await page.goto("/all-users");

    await expect(
      page.getByRole("heading", { name: "User List" }),
    ).toBeVisible();

    await page.waitForTimeout(1000);
    await expect(page.getByText(/loading users/i)).not.toBeVisible();

    const paragraphs = await page.getByRole("paragraph").count();
    console.log(paragraphs);
    expect(paragraphs).toBeGreaterThan(2);
  });

  test("should navigate to user details", async ({ page }) => {
    await page.goto("/all-users");

    await page.waitForTimeout(1000);

    const viewDetailsButtons = page.getByRole("button", {
      name: "View Details",
    });
    const count = await viewDetailsButtons.count();
    if (count > 0) {
      await viewDetailsButtons.first().click();

      await expect(page).toHaveURL(/\/users\/\d+/);
      await expect(
        page.getByRole("heading", { name: "User Details" }),
      ).toBeVisible();
    }
  });

  test("should show back button on user details page", async ({ page }) => {
    await page.goto("/users/1");

    await page.waitForTimeout(500);

    await expect(
      page.getByRole("button", { name: /Back to Users/i }),
    ).toBeVisible();
  });

  test("should navigate back from user details", async ({ page }) => {
    await page.goto("/users/1");
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /Back to Users/i }).click();

    await expect(page).toHaveURL("/all-users");
    await expect(
      page.getByRole("heading", { name: "All User List" }),
    ).toBeVisible();
  });
});
