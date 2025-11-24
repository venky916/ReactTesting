import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCounterStore } from "./counterStore";
import { ZustandCounter, CountDisplay } from "../components/ZustandCounter";

describe("Zustand Counter Store", () => {
  beforeEach(() => {
    act(() => {
      useCounterStore.setState({ count: 0 });
    });
  });

  // TEST 1: Initial state
  it("should have initial count of 0", () => {
    render(<ZustandCounter />);

    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });

  // TEST 2: Increment action
  it("should increment count", async () => {
    const user = userEvent.setup();
    render(<ZustandCounter />);

    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });

  // TEST 3: Decrement action
  it("should decrement count", async () => {
    const user = userEvent.setup();

    render(<ZustandCounter />);
    await user.click(screen.getByRole("button", { name: /decrement/i }));
    expect(screen.getByText(/count: -1/i)).toBeInTheDocument();
  });

  // TEST 4: Reset action
  it("should reset count to 0", async () => {
    const user = userEvent.setup();
    render(<ZustandCounter />);

    await user.click(screen.getByRole("button", { name: /increment/i }));
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText(/count: 2/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });

  // TEST 5: Shared state across components
  it("should share state across multiple components", async () => {
    const user = userEvent.setup();

    render(
      <>
        <ZustandCounter />
        <CountDisplay />
      </>
    );

    // expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
    // expect(screen.getByText(/current count: 0/i)).toBeInTheDocument();

    // await user.click(screen.getByRole("button", { name: /increment/i }));

    // expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
    // expect(screen.getByText(/current count: 1/i)).toBeInTheDocument();

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
    expect(screen.getByText("Current count: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /increment/i }));

    expect(screen.getByText("Count: 1")).toBeInTheDocument();
    expect(screen.getByText("Current count: 1")).toBeInTheDocument();
  });

  // TEST 6: Direct store manipulation
  it("should allow direct store updates", () => {
    render(<CountDisplay />);

    expect(screen.getByText(/current count: 0/i)).toBeInTheDocument();
    act(() => {
      useCounterStore.setState({ count: 100 });
    });
    expect(screen.getByText(/current count: 100/i)).toBeInTheDocument();
  });

  // TEST 7: Multiple actions in sequence
  it("should handle multiple actions correctly", async () => {
    const user = userEvent.setup();
    render(<ZustandCounter />);

    await user.click(screen.getByRole("button", { name: /increment/i }));
    await user.click(screen.getByRole("button", { name: /increment/i }));
    await user.click(screen.getByRole("button", { name: /decrement/i }));

    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });
});


// 🎓 ZUSTAND TESTING CONCEPTS:
//
// 1. Reset store before each test
//    - use beforeEach
//    - setState({ count: 0 })
//    - Ensures clean state
//
// 2. Test store actions
//    - increment, decrement, reset
//    - Verify state updates
//
// 3. Test shared state
//    - Multiple components using same store
//    - All update when store changes
//
// 4. Direct store manipulation
//    - Can set state directly in tests
//    - Useful for setting up test scenarios
//
// 5. Wrap in act()
//    - When updating store outside components
//    - Ensures React processes updates
//
// 6. No provider needed!
//    - Unlike Context, no wrapper required
//    - Simpler testing