import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App2 from "./App2";

describe("App component -Counter Test", () => {
  // TEST 1: Check if the component renders
  it("should render the heading", () => {
    render(<App2 />);

    const heading = screen.getByText("Learning Testing with React");
    expect(heading).toBeInTheDocument();
  });

  // TEST 2: Check if count starts at 0
  it("should start with count 0", () => {
    render(<App2 />);

    const countText = screen.getByText("Count: 0");
    expect(countText).toBeInTheDocument();
  });

  // TEST 3: Check if all buttons are present
  it("should render all the three buttons", () => {
    render(<App2 />);

    expect(
      screen.getByRole("button", { name: "Increment" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrement" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  // TEST 4: Check if Increment button works
  it("should increment count when Increment button is clicked", async () => {
    const user = userEvent.setup();
    render(<App2 />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    await user.click(incrementButton);

    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  // TEST 5: Check if Decrement button works
  it("should decrement count when Decrement button is clicked", async () => {
    const user = userEvent.setup();
    render(<App2 />);
    const decrementButton = screen.getByRole("button", { name: "Decrement" });
    await user.click(decrementButton);
    expect(screen.getByText("Count: -1")).toBeInTheDocument();
  });

  // TEST 6: Check if Reset button works
  it("should reset count to 0 when Reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<App2 />);
    const incrementButton = screen.getByRole("button", { name: "Increment" });
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(screen.getByText("Count: 3")).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: "Reset" });
    await user.click(resetButton);

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  //Test 7 : Check multiple increments
  it("should handle multiple increments correctly", async () => {
    const user = userEvent.setup();
    render(<App2 />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });

    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(screen.getByText("Count: 5")).toBeInTheDocument();
  });
});

/* 🎓 LEARNING NOTES: */
//
// 1. describe() - Groups related tests together
// 2. it() or test() - Individual test case
// 3. expect() - Assertion to check if something is true
// 4. render() - Renders your React component for testing
// 5. screen - Query the rendered component
// 6. userEvent - Simulates user interactions (clicks, typing, etc.)
// 7. async/await - Used because user interactions take time
//
// Common queries:
// - getByText() - Find element by text content
// - getByRole() - Find element by accessibility role (button, heading, etc.)
// - getByLabelText() - Find input by label
// - getByTestId() - Find by data-testid attribute
//
// Common assertions:
// - toBeInTheDocument() - Element exists in DOM
// - toHaveTextContent() - Element has specific text
// - toBeDisabled() - Element is disabled
// - toHaveValue() - Input has specific value
