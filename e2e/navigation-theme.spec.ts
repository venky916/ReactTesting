import { expect, test } from "@playwright/test";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function login(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/dashboard");
}

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("should navigate between pages using navbar", async ({ page }) => {
    await login(page);

    await page
      .locator("nav")
      .getByRole("link", { name: "Users", exact: true })
      .click();
    await expect(page).toHaveURL("/users");
    await expect(
      page.getByRole("heading", { name: "User Management" }),
    ).toBeVisible();

    await page.locator("nav").getByRole("link", { name: "Todos" }).click();
    await expect(page).toHaveURL("/todos");
    await expect(page.getByRole("heading", { name: "My Todos" })).toBeVisible();

    await page.locator("nav").getByRole("link", { name: "Profile" }).click();
    await expect(page).toHaveURL("/profile");
    await expect(
      page.getByRole("heading", { name: "My Profile" }),
    ).toBeVisible();

    await page.locator("nav").getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });

  test("should work with browser back/forward buttons", async ({ page }) => {
    await login(page);
    await page
      .locator("nav")
      .getByRole("link", { name: "Users", exact: true })
      .click();
    await expect(page).toHaveURL("/users");

    await page.locator("nav").getByRole("link", { name: "Todos" }).click();
    await expect(page).toHaveURL("/todos");

    await page.goBack();
    await expect(page).toHaveURL("/users");

    await page.goBack();
    await expect(page).toHaveURL("/dashboard");

    await page.goForward();
    await expect(page).toHaveURL("/users");
  });

  test("should persist global counter across pages", async ({ page }) => {
    await login(page);

    await page.getByRole("button", { name: "+" }).click();
    await expect(page.getByText("Global Counter: 1")).toBeVisible();

    await page
      .locator("nav")
      .getByRole("link", { name: "Users", exact: true })
      .click();
    await expect(page.getByText("Global Counter: 1")).toBeVisible();

    await page.getByRole("button", { name: "+" }).click();
    await expect(page.getByText("Global Counter: 2")).toBeVisible();

    await page.locator("nav").getByRole("link", { name: "Todos" }).click();
    await expect(page.getByText("Global Counter: 2")).toBeVisible();
  });
});

test.describe("Theme Toggle", () => {
  test("should toggle theme", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page
      .locator("nav")
      .getByRole("button", { name: "Toggle Theme" })
      .click();
    await expect(html).toHaveClass(/dark/);

    await page
      .locator("nav")
      .getByRole("button", { name: "Toggle Theme" })
      .click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("should persist theme across pages", async ({ page }) => {
    await page.goto("/");

    await page
      .locator("nav")
      .getByRole("button", { name: "Toggle Theme" })
      .click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/login");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should persist theme after page reload", async ({ page }) => {
    await page.goto("/");

    await page
      .locator("nav")
      .getByRole("button", { name: "Toggle Theme" })
      .click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
