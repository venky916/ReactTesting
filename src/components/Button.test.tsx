import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
  // TEST 1: Does it render with the correct label?
  it("should render with the correct label", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Click Me" })
    ).toBeInTheDocument();
  });

  // TEST 2: Does onClick get called when clicked?
  it("should call onClick when clicked", async () => {
    // vi.fn() creates a "mock function" - we can track if it was called
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button label="Click Me" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Click Me" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // TEST 3: Does it call onClick multiple times?
  it("should call onClick multiple times on multiple clicks", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button label="Click Me" onClick={handleClick} />);
    const button = screen.getByRole("button");

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  // TEST 4: Is the button disabled when disabled prop is true?
  it("should be disabled when disabled prop is true", () => {
    render(<Button label="Click Me" onClick={() => {}} disabled={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  // TEST 5: Does it NOT call onClick when disabled?
  it("should not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button label="Click Me" onClick={handleClick} disabled={true} />);
    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  // TEST 6: Does it render with primary variant by default?
  it("should have primary variant style by default", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-500");
  });

  // TEST 7: Does it apply danger variant styles?
  it("should apply danger variant styles", () => {
    render(<Button label="Delete" onClick={() => {}} variant="danger" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-500");
  });

  // TEST 8: Does it apply secondary variant styles?
  it("should apply secondary variant styles", () => {
    render(<Button label="Cancel" onClick={() => {}} variant="secondary" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-500");
  });
});

// 🎓 NEW CONCEPTS LEARNED:
//
// 1. vi.fn() - Mock function
//    - Tracks if function was called
//    - Tracks how many times it was called
//    - Tracks what arguments it was called with
//
// 2. Testing Props:
//    - We can pass different props to test different scenarios
//    - Test both presence and absence of optional props
//
// 3. Testing Classes:
//    - toHaveClass() checks if element has a CSS class
//    - Useful for testing conditional styling
//
// 4. Testing Disabled State:
//    - toBeDisabled() checks if element is disabled
//    - not.toHaveBeenCalled() checks function was NOT called
