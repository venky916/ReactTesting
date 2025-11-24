import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "./ThemeContext";
import { ThemeSwitcher, ThemedContent } from "../components/ThemeSwitcher";

function renderWithTheme(component: React.ReactElement) {
  return render(<ThemeProvider>{component}</ThemeProvider>);
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should start with light theme", () => {
    renderWithTheme(<ThemeSwitcher />);
    expect(screen.getByText(/current theme:/i)).toHaveTextContent("light");
  });

  it("should toggle to dark theme", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSwitcher />);

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(screen.getByText(/current theme:/i)).toHaveTextContent("dark");
  });

  it("should toggle back to light theme", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSwitcher />);

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(screen.getByText(/current theme:/i)).toHaveTextContent("dark");

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(screen.getByText(/current theme:/i)).toHaveTextContent("light");
  });

  it("should share theme across components", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <>
        <ThemeSwitcher />
        <ThemedContent />
      </>
    );

    expect(screen.getByText(/current theme:/i)).toHaveTextContent("light");
    expect(screen.getByText(/theme is: light/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(screen.getByText(/current theme:/i)).toHaveTextContent("dark");
    expect(screen.getByText(/theme is: dark/i)).toBeInTheDocument();
  });
});



// 🎓 WHAT WE LEARNED:
//
// 1. localStorage persists between tests!
//    - Test 1 might set "dark"
//    - Test 2 starts with "dark" instead of "light"
//    - Tests become dependent on each other (BAD!)
//
// 2. beforeEach() - Runs before EVERY test
//    - localStorage.clear() resets state
//    - Each test starts fresh
//    - Tests are independent (GOOD!)
//
// 3. afterEach() - Cleanup after tests
//    - Optional but good practice
//    - Prevents side effects
//
// 4. Why this happens:
//    - useLocalStorage saves to browser localStorage
//    - localStorage persists across re-renders
//    - Tests share the same localStorage
//
// 5. General rule for testing:
//    - Always clean up side effects
//    - localStorage, sessionStorage, cookies
//    - Network requests, timers, event listeners