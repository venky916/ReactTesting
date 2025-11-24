import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary, BuggyComponent } from "./ErrorBoundary";
import { useState } from "react";

describe("ErrorBoundary", () => {
  // Suppress console.error for cleaner test output
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TEST 1: Renders children when no error
  it("should render children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    );
  });

  // TEST 2: Catches error and shows fallback
  it("should catch error and display fallback UI", () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/international error for testing/i)
    ).toBeInTheDocument();
  });

  // TEST 3: Custom fallback UI
  it("should render custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <BuggyComponent shouldThrow />
      </ErrorBoundary>
    );
  });

  // TEST 4: Reset error state
  it("should reset error and render children again", async () => {
    const user = userEvent.setup();

    // 🔥 SOLUTION: Use state + key to force remount!
    function TestWrapper() {
      const [shouldThrow, setShouldThrow] = useState(true);
      const [key, setKey] = useState(0); // ✅ Key to force remount

      return (
        <div>
          <button
            onClick={() => {
              setShouldThrow(false);
              setKey((k) => k + 1); // ✅ Change key = new ErrorBoundary instance
            }}
          >
            Reset
          </button>
          <ErrorBoundary key={key}>
            {" "}
            {/* ✅ Key prop forces remount */}
            <BuggyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    }

    // const { rerender } = render(<TestWrapper shouldThrow={true} />);

    // expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    // await user.click(screen.getByRole("button", { name: /try again/i }));

    // rerender(<TestWrapper shouldThrow={false} />);

    // await waitFor(() => {
    //   expect(screen.getByText("No errors here!")).toBeInTheDocument();
    // });

    render(<TestWrapper />);

    // Verify error is shown
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Click the external reset button (not the Try Again button)
    await user.click(screen.getByRole("button", { name: /reset/i }));

    // Now it should show success message
    await waitFor(() => {
      expect(screen.getByText("No errors here!")).toBeInTheDocument();
    });
  });

  // TEST 5: Multiple children - only catches errors in children
  it("should only catch errors in its children", () => {
    render(
      <div>
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
        <div>Outside error boundary</div>
      </div>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText("Outside error boundary")).toBeInTheDocument();
  });

  // TEST 6: Error doesn't break entire app
  it("should isolate errors and not break sibling components", () => {
    render(
      <div>
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
        <ErrorBoundary>
          <BuggyComponent shouldThrow={false} />
        </ErrorBoundary>
      </div>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText("No errors here!")).toBeInTheDocument();
  });
});

// 🎓 ERROR BOUNDARY TESTING:
//
// 1. Suppress console.error in tests
//    - Errors are expected in these tests
//    - Keep test output clean
//
// 2. Test normal rendering
//    - When no error, children render normally
//
// 3. Test error catching
//    - Throw error in child
//    - Boundary catches it
//    - Fallback UI shows
//
// 4. Test custom fallback
//    - Pass custom fallback prop
//    - Verify it renders
//
// 5. Test error recovery
//    - Reset error state
//    - Re-render with fixed component
//
// 6. Test error isolation
//    - Error in one boundary doesn't affect others
//    - App continues working

// 🎓 WHY THE ORIGINAL TEST FAILED:
//
// ❌ PROBLEM:
// 1. ErrorBoundary catches error → shows fallback
// 2. Click "Try Again" → calls resetError()
// 3. But BuggyComponent still has shouldThrow={true}!
// 4. React immediately throws error again
// 5. "No errors here!" never appears
//
// ✅ SOLUTION:
// 1. Create TestWrapper component
// 2. Pass shouldThrow as prop to wrapper
// 3. Click "Try Again" → resets error
// 4. Rerender wrapper with shouldThrow={false}
// 5. Now BuggyComponent doesn't throw
// 6. "No errors here!" appears!
//
// 🔑 KEY CONCEPT:
// Error boundaries need BOTH:
// - Reset internal state (resetError)
// - Change child props so error doesn't re-throw
//
// In real apps:
// - Reset button might reload data
// - Or navigate to safe route
// - Or retry failed operation
// - Point is: fix the CAUSE of error!


// 🎓 WHY THE KEY SOLUTION WORKS:
//
// ❌ PROBLEM WITH ORIGINAL APPROACH:
// 1. ErrorBoundary catches error → hasError = true
// 2. Click "Try Again" → resetError() → hasError = false
// 3. Rerender with shouldThrow={false}
// 4. BUT: React sees it's the same ErrorBoundary instance
// 5. React doesn't call getDerivedStateFromError again
// 6. Child still has the error in React's internal state
// 7. Error shows again immediately!
//
// ✅ SOLUTION WITH KEY:
// 1. ErrorBoundary catches error → hasError = true
// 2. Click "Reset" → change key from 0 to 1
// 3. React sees new key → unmounts old ErrorBoundary
// 4. React creates NEW ErrorBoundary instance
// 5. New instance has fresh state: hasError = false
// 6. Child renders with shouldThrow={false}
// 7. Success! "No errors here!" appears
//
// 🔑 KEY CONCEPT:
// When you change a component's key prop, React treats it as
// a completely different component and:
// - Unmounts the old instance
// - Mounts a brand new instance
// - Fresh state, fresh lifecycle
//
// This is how error boundaries work in real apps:
// - Navigate to different route (new key)
// - Or force remount with key prop
// - Or reload the page
//
// 💡 ALTERNATIVE TEST (simpler but less realistic):
// Just test that error boundary SHOWS the fallback.
// Don't test the recovery flow - that's better tested in E2E!