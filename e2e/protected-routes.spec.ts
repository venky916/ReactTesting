import { test, expect } from "@playwright/test";

test.describe("Protected Routes", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/")
        await page.evaluate(() => localStorage.clear())
    })

    test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
        await page.goto("/dashboard")
        await expect(page).toHaveURL("/login")
    })

    test("should redirect to login when accessing users without login", async ({ page }) => {
        await page.goto("/users")
        await expect(page).toHaveURL("/login")
    })

    test("should redirect to login when accessing todos without auth", async ({ page }) => {
        await page.goto("/todos")
        await expect(page).toHaveURL("/login")
    })

    test("should redirect to login when accessing profile without auth", async ({ page }) => {
        await page.goto("/profile")
        await expect(page).toHaveURL("/login")
    })


    test("should allow access to protected routes after login", async ({ page }) => {
        await page.goto("/login")
        await page.getByLabel("Email").fill("test@example.com")
        await page.getByLabel("Password").fill("password123")
        await page.getByRole("button", { name: "Login" }).click()
        await expect(page).toHaveURL("/dashboard")

        await page.goto("/users")
        await expect(page).toHaveURL("/users")
        await expect(page.getByRole("heading", { name: "User Management",exact:true })).toBeVisible()

        await page.goto("/todos")
        await expect(page).toHaveURL("/todos")
        await expect(page.getByRole("heading", { name: "My Todos" })).toBeVisible()

        await page.goto("/profile")
        await expect(page).toHaveURL("/profile")
        await expect(page.getByRole("heading", { name: "My Profile" })).toBeVisible()


    })

    test("should block protected routes after logout", async ({ page }) => {
        await page.goto("/login")
        await page.getByLabel("Email").fill("test@example.com")
        await page.getByLabel("Password").fill("password123")
        await page.getByRole("button", { name: "Login" }).click()
        await expect(page).toHaveURL("/dashboard")

        await page.getByRole("button", { name: "Logout" }).click()
        await expect(page).toHaveURL("/login")

        await page.goto("/dashboard")
        await expect(page).toHaveURL("/login")
    })
})
