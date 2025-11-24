import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => localStorage.clear())
    })


    test("should login with valid credentials", async ({ page }) => {
        await page.goto("/login")

        await page.getByLabel("Email").fill("test@example.com")
        await page.getByLabel("Password").fill("password123")
        await page.getByRole("button", { name: "Login" }).click()

        await expect(page).toHaveURL("/dashboard")
        await expect(page.getByText("Welcome Back!")).toBeVisible()
        await expect(page.getByRole("paragraph").getByText("Test User")).toBeVisible()

        await expect(page.locator("nav").getByText("Test User")).toBeVisible()
        await expect(page.getByRole("button", { name: "Logout" })).toBeVisible()

    })

    test("should show error with invalid credentials", async ({ page }) => {
        await page.goto("/login")

        await page.getByLabel("Email").fill("wrong@exmaple.com")
        await page.getByLabel("Password").fill("wrongpassword")
        await page.getByRole("button", { name: "Login" }).click()

        await expect(page).toHaveURL("/login")
        await expect(page.getByText("Invalid credentials")).toBeVisible()
    })

    test("should logout successfully", async ({ page }) => {
        await page.goto("/login")
        await page.getByLabel("Email").fill("test@example.com")
        await page.getByLabel("Password").fill("password123")
        await page.getByRole("button", { name: "Login" }).click()
        await expect(page).toHaveURL("/dashboard")

        await page.getByRole("button", { name: "Logout" }).click()
        await expect(page).toHaveURL("/login")

        await expect(page.getByRole("heading", { name: "LoginPage" })).toBeVisible()
        await expect(page.locator("nav").getByText("Test User")).not.toBeVisible()

    })

    test("should persist login after page reload", async ({ page }) => {
        await page.goto("/login")
        await page.getByLabel("Email").fill("test@example.com")
        await page.getByLabel("Password").fill("password123")
        await page.getByRole("button", { name: "Login" }).click()
        await expect(page).toHaveURL("/dashboard")

        await page.reload()

        await expect(page).toHaveURL("/dashboard")
        await expect(page.locator("nav").getByText("Test User")).toBeVisible()
    })
})