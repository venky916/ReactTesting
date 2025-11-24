import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthProvider } from "./AuthContext";
import { Login, UserProfile } from "../components/Login";

// hoc
function renderWithAuth(component: React.ReactElement) {
  return render(<AuthProvider>{component}</AuthProvider>);
}

describe("AuthContext", () => {
  // TEST 1: Initial state - not authenticated
  it("should start with no user", () => {
    renderWithAuth(<UserProfile />);
    expect(
      screen.getByText(/please login to view profile/i)
    ).toBeInTheDocument();
  });

  // TEST 2: Successful login
  it("should login with valid credentials", async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <>
        <Login />
        <UserProfile />
      </>
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  // TEST 3: Failed login
  it("should show error with invalid credentials", async () => {
    const user = userEvent.setup();
    renderWithAuth(<Login />);

    await user.type(screen.getByLabelText(/email/i), "wrong@exmaple.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  // TEST 4: Logout functionality
  it("should logout and clear user", async () => {
    const user = userEvent.setup();

    renderWithAuth(
      <>
        <Login />
        <UserProfile />
      </>
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /logout/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/please login to view profile/i)
      ).toBeInTheDocument();
    });
  });

  // TEST 5: Loading state
  it("should show loading state during login", async () => {
    const user = userEvent.setup();
    renderWithAuth(<Login />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
    });
  });

  // TEST 6: Multiple components using same context
  it("should share auth state across components", async () => {
    const user = userEvent.setup();

    const TestComponent = () => (
      <>
        <Login />
        <UserProfile />
        <UserProfile />
      </>
    );

    renderWithAuth(<TestComponent />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const userNames = screen.getAllByText("Test User");
      expect(userNames).toHaveLength(2);
    });
  });
});


// 🎓 CONTEXT TESTING CONCEPTS:
//
// 1. Wrap with Provider
//    - Create helper function renderWithAuth()
//    - Always wrap test components with provider
//
// 2. Test Context Values
//    - Test initial state
//    - Test state updates
//    - Test shared state across components
//
// 3. Test Context Actions
//    - login() updates state
//    - logout() clears state
//    - Error handling works
//
// 4. Test Loading States
//    - Async operations show loading
//    - Loading clears after completion
//
// 5. Integration Testing
//    - Multiple components use same context
//    - State updates propagate correctly