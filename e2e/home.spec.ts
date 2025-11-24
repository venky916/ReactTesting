import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {

    test("should load home page", async ({ page }) => {
        await page.goto("/")

        await expect(page.locator("h1")).toContainText("Welcome to Testing App");

        // await expect(page.locator("text=A complete React testing demonstration")).toBeVisible()
        await expect(page.getByText("A complete React testing demonstration")).toBeVisible()
    })

    test("should show login button when not authenticated", async ({ page }) => {
        await page.goto("/");

        // const loginButton = page.locator("text=Get Started - Login");
        const loginButton = page.getByRole("link", { name: "Get started - Login" })
        await expect(loginButton).toBeVisible()

        // await expect(page.locator('text=Go to Dashboard')).not.toBeVisible()
        await expect(page.getByRole("link", { name: "Go to Dashboard" })).not.toBeVisible()
    })

    test("should have working counter on home page", async ({ page }) => {
        await page.goto("/");

        // await expect(page.locator("text=Count: 0")).toBeVisible()

        // await page.click('button:has-text("Increment")')
        // await expect(page.locator("text=Count: 1")).toBeVisible()

        // await page.click("button:has-text('Increment')")
        // await expect(page.locator("text=Count: 2")).toBeVisible()

        // await page.click("button:has-text('Decrement')")
        // await expect(page.locator("text=Count: 1")).toBeVisible()

        // await page.click("button:has-text('Reset')")
        // await expect(page.locator("text=Count: 0")).toBeVisible()

        await expect(page.getByText("Count: 0")).toBeVisible();

        await page.getByRole("button",{name:"Increment"}).click()
        await expect(page.getByText("Count: 1")).toBeVisible();

        await page.getByRole("button",{name:"Increment"}).click()
        await expect(page.getByText("Count: 2")).toBeVisible();

        await page.getByRole("button",{name:"Decrement"}).click()
        await expect(page.getByText("Count: 1")).toBeVisible();

        await page.getByRole("button",{name:"Reset"}).click()
        await expect(page.getByText("Count: 0")).toBeVisible();
    })

    test("should navigate to login page", async ({ page }) => {
        await page.goto("/")

        // await page.click('text=Get started - Login')
        await page.getByRole("link", { name: "Get started - Login" }).click()

        await expect(page).toHaveURL("/login")
        // to vage not specice text ao rexact text match  if loginnan dloginPage match if both have h2 tag
        // await expect(page.locator('h2')).toContainText("Login")
        await expect(page.getByRole("heading", { name: "Login", exact: true })).toBeVisible()
    })
})

// both work above comment one are generally use getByRole specific role

// 🎓 KEY LEARNINGS:
//
// 1. Use getBy methods (BEST):
//    - page.getByRole('button', { name: 'Text' })
//    - page.getByText('Text')
//    - page.getByLabel('Text')
//
// 2. Text selectors need quotes if text has spaces:
//    - text="Get Started"  ✅
//    - text=GetStarted     ✅
//    - text=Get Started    ❌
//
// 3. Avoid complex selectors:
//    - page.locator('text:"Count: 1"')  ❌
//    - page.getByText('Count: 1')       ✅
//
// 4. Use specific roles:
//    - getByRole('link')    for <a> tags
//    - getByRole('button')  for buttons
//    - getByRole('heading') for h1, h2, etc.

// What you wantHow to find it
// Button               page.getByRole('button', { name: 'Text' })
// Link                 page.getByRole('link', { name: 'Text' })
// Heading              page.getByRole('heading', { name: 'Text' })
// Input by label       page.getByLabel('Email')Any textpage.getByText('Text')
// Placeholder          page.getByPlaceholder('Text')