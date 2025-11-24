import { test, expect } from "@playwright/test"

test.describe("404 Not Found Page", () => {
    test("should show 404 page for invalid route", async ({ page }) => {
        await page.goto("/this-page-does-not-exist")

        await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
        await expect(page.getByText("Page Not Found")).toBeVisible()
    })

    test("should navigate home from 404 page", async ({ page }) => {
        await page.goto("/invalid-route")
        await page.getByRole("link", { name: "Go Home" }).click()

        await expect(page).toHaveURL("/")
        await expect(page.getByRole("heading", { name: "Welcome to Testing App" })).toBeVisible()
    })

    test("should show 404 for invalid nested routes", async ({ page }) => {
        await page.goto("/users/invalid/nested/route")

        await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
    })
})