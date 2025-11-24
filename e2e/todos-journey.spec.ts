/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

async function login(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/dashboard");
}

test.describe("Complete Todo Journey", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await login(page);
  });

  test("should show empty state initially", async ({ page }) => {
    await page.goto("/todos");
    await expect(page.getByText("No todos yet")).toBeVisible();
  });

  test("complete todo workflow: add,complete,delete", async ({ page }) => {
    await page.goto("/todos");

    await page.getByPlaceholder(/new todo/i).fill("Buy groceries");
    await page.getByRole("button", { name: "Add Todo" }).click();
    await expect(page.getByText("Buy groceries")).toBeVisible();

    await page.getByPlaceholder(/new todo/i).fill("Walk the dog");
    await page.getByRole("button", { name: "Add todo" }).click();
    await expect(page.getByText("Walk the dog")).toBeVisible();

    await expect(page.getByText("Buy groceries")).toBeVisible();
    await expect(page.getByText("Walk the dog")).toBeVisible();

    const firstCheckbox = page.getByRole("checkbox", {
      name: /Toggle Buy groceries/i,
    });
    await firstCheckbox.check();

    const todoText = page.locator("span").filter({ hasText: "Buy groceries" });
    await expect(todoText).toHaveClass(/line-through/);

    await page.getByRole("button", { name: "Delete Buy groceries" }).click();
    await expect(page.getByText("Buy groceries")).not.toBeVisible();

    await expect(page.getByText("Walk the dog")).toBeVisible();
  });

  test("should add todo using Enter key", async ({ page }) => {
    await page.goto("/todos");

    const input = page.getByPlaceholder(/new todo/i);
    await input.fill("Test with Enter");
    await input.press("Enter");

    await expect(page.getByText("Test with Enter")).toBeVisible();
  });

  test("should not add empty todo", async ({ page }) => {
    await page.goto("/todos");

    await page.getByRole("button", { name: "Add Todo" }).click();
    await expect(page.getByText("No todos yet. Add one above!")).toBeVisible();
  });

  test("should toggle todo completion", async ({ page }) => {
    await page.goto("/todos");

    await page.getByPlaceholder(/new todo/i).fill("Toggle test");
    await page.getByRole("button", { name: "Add Todo" }).click();

    const checkbox = page.getByRole("checkbox", { name: "Toggle Toggle test" });
    const todoText = page.locator("span").filter({ hasText: "Toggle test" });

    await expect(todoText).not.toHaveClass(/line-through/);

    await checkbox.check();
    await expect(todoText).toHaveClass(/line-through/);

    await checkbox.uncheck();
    await expect(todoText).not.toHaveClass(/line-through/);
  });
});
