import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserManagement } from "./UserManagement";
import { userService } from "../services/userService";

describe("UserManagement Integration Tests", () => {
  beforeEach(() => {
    userService.clearUsers();
  });

  afterEach(() => {
    userService.clearUsers();
  });

  // TEST 1: Initial render shows empty state
  it("should show empty state when no users exists", async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  // TEST 2: COMPLETE FLOW - Add user and see it in list
  it("should add user and display in list", async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    //fill form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.selectOptions(screen.getByLabelText(/role/i), "admin");

    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("admin")).toBeInTheDocument();
    });
  });

  // TEST 3: Form clears after successful submission
  it("should clear form after adding user", async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.queryByText("Adding...")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue("");
      expect(screen.getByLabelText(/email/i)).toHaveValue("");
    });
  });

  // TEST 4: Add multiple users
  it("should add multiple users", async () => {
    const user = userEvent.setup();

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "User One");
    await user.type(screen.getByLabelText(/email/i), "user1@example.com");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("User One")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "User Two");
    await user.type(screen.getByLabelText(/email/i), "user2@exmaple.com");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("User Two")).toBeInTheDocument();
    });

    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(screen.getByText("User Two")).toBeInTheDocument();
  });

  // TEST 5: Delete user removes from list
  it("should delete user from the list", async () => {
    const user = userEvent.setup();

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@exmaple.com");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  // TEST 6: Validation - Empty form
  it("should show error when submitting empty form", async () => {
    const user = userEvent.setup();

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/name and email are required/i)
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/john Doe/i)).not.toBeInTheDocument();
  });

  // TEST 7: Complete workflow
  it("should handle complete user management workflow", async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@exmaple.com");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "Bob");
    await user.type(screen.getByLabelText(/email/i), "bob@exmaple.com");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  // TEST 8: Role selection works
  it("should allow selecting different roles", async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), "Admin User");
    await user.type(screen.getByLabelText(/email/i), "admin@exmaple.com");
    await user.selectOptions(screen.getByLabelText(/role/i), "admin");
    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText("admin")).toBeInTheDocument();
    });
  });
});


// 🎓 INTEGRATION TESTING KEY CONCEPTS:
//
// 1. Test Complete Workflows
//    - Not just individual pieces
//    - Test how components work together
//    - Test data flow between components
//
// 2. Real User Scenarios
//    - Fill form → Submit → See result
//    - Add item → Delete item → List updates
//    - Error → Fix → Success
//
// 3. Multiple Components
//    - Parent component
//    - Child components
//    - Shared state/services
//
// 4. State Management
//    - Parent state updates
//    - Child receives new props
//    - Re-renders happen correctly
//
// 5. Async Operations
//    - Wait for loading
//    - Wait for API calls
//    - Wait for UI updates
//
// 6. Clean Up Between Tests
//    - beforeEach/afterEach
//    - Clear service data
//    - Fresh state for each test
//
// 7. Test Multiple Operations
//    - Add → Add → Delete → Add
//    - Test sequences of actions
//    - Test state consistency