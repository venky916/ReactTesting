/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test } from "@playwright/test";

async function login(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/dashboard");
}

test.describe("User Management (Integration)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await login(page);
  });

  test("should show empty state initially", async ({ page }) => {
    await page.goto("/users");
    await expect(
      page.getByText("No users found. Add one above!"),
    ).toBeVisible();
  });

  test("should add user and display in list", async ({ page }) => {
    await page.goto("/users");

    await page.getByLabel("Name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Role").selectOption("admin");

    await page.getByRole("button", { name: "Add User" }).click();

    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("john@example.com")).toBeVisible();
    await expect(page.locator(".bg-blue-100").getByText("admin")).toBeVisible();
  });

  test("should clear from after adding user", async ({ page }) => {
    await page.goto("/users");

    const nameInput = page.getByLabel("Name");
    const emailInput = page.getByLabel("Email");

    await nameInput.fill("John Doe");
    await emailInput.fill("jane@example.com");
    await page.getByRole("button", { name: "Add User" }).click();

    await expect(nameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
  });

  test("should add multiple users", async ({ page }) => {
    await page.goto("/users");

    await page.getByLabel("Name").fill("User One");
    await page.getByLabel("Email").fill("user1@example.com");
    await page.getByRole("button", { name: "Add User" }).click();
    await expect(page.getByText("User One")).toBeVisible();

    await page.getByLabel("Name").fill("User Two");
    await page.getByLabel("Email").fill("user2@example.com");
    await page.getByRole("button", { name: "Add User" }).click();
    await expect(page.getByText("User Two")).toBeVisible();

    await expect(page.getByText("User One")).toBeVisible();
    await expect(page.getByText("User Two")).toBeVisible();
  });

  test("should delete user from list", async ({ page }) => {
    await page.goto("/users");

    await page.getByLabel("Name").fill("Delete Me");
    await page.getByLabel("Email").fill("delete@example.com");
    await page.getByRole("button", { name: "Add User" }).click();
    await expect(page.getByText("Delete Me")).toBeVisible();

    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Delete Me")).not.toBeVisible();
    await expect(
      page.getByText("No users found. Add one above!"),
    ).toBeVisible();
  });

  test("should show error when submitting empty form", async ({ page }) => {
    await page.goto("/users");

    await page.getByRole("button", { name: "Add User" }).click();
    await expect(page.getByText("Name and email are required")).toBeVisible();
  });
});
