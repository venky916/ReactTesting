import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserList } from "./UserList";

import * as userApi from "../services/userApi";

vi.mock("../services/userApi");

describe("UserList Component", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  // TEST 1: Does it show loading state initially?
  it("should show loading state initially", () => {
    // Make the API call hang (never resolve) so loading stays visible
    vi.mocked(userApi.fetchUsers).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithRouter(<UserList />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  // TEST 2: Does it display users after successful fetch?
  it("should display users after successful fetch", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    ];

    vi.mocked(userApi.fetchUsers).mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  // TEST 3: Does it show error when API fails?
  it("show error message when fetch fails", async () => {
    vi.mocked(userApi.fetchUsers).mockRejectedValue(
      new Error("Failed to fetch users")
    );

    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
  });

  // TEST 4: Does it show "No users found" when array is empty?
  it('should show "No users found" when API return empty array', async () => {
    vi.mocked(userApi.fetchUsers).mockResolvedValue([]);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  // TEST 5: Does loading disappear after data loads?
  it("should hide loading state after data loads", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
    ];

    vi.mocked(userApi.fetchUsers).mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    expect(screen.getByText(/loading users/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  // TEST 6: Does it call the API function?
  it("should call fetchUsers on mount", async () => {
    const mockUsers = [
      { id: 1, name: "Test User", email: "test@example.com", role: "User" },
    ];

    vi.mocked(userApi.fetchUsers).mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    expect(userApi.fetchUsers).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  // TEST 7: Does it render multiple users correctly?
  it("should render all users from the API", async () => {
    const mockUsers = [
      { id: 1, name: "User 1", email: "user1@example.com", role: "Admin" },
      { id: 2, name: "User 2", email: "user2@example.com", role: "User" },
      { id: 3, name: "User 3", email: "user3@example.com", role: "User" },
    ];

    vi.mocked(userApi.fetchUsers).mockResolvedValue(mockUsers);

    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("User 3")).toBeInTheDocument();
  });
});

// 🎓 NEW CONCEPTS YOU LEARNED:
//
// 1. vi.mock() - Mocks an entire module
//    - Replaces real API calls with fake ones
//    - Prevents actual network requests in tests
//
// 2. mockResolvedValue() - Mock successful promise
//    - Returns fake data immediately
//    - Simulates successful API response
//
// 3. mockRejectedValue() - Mock failed promise
//    - Throws an error
//    - Simulates API failure
//
// 4. waitFor() - Wait for async operations
//    - Waits for elements to appear/disappear
//    - Essential for testing async code
//
// 5. queryBy vs getBy:
//    - getBy - Throws error if not found (good for expecting existence)
//    - queryBy - Returns null if not found (good for expecting absence)
//
// 6. beforeEach() - Runs before each test
//    - Clean slate for every test
//    - Clear mocks to prevent interference
//
// 7. mockImplementation() - Custom mock behavior
//    - Create promises that never resolve (for loading tests)
//    - Full control over mock behavior

// 🎓 NEW CONCEPTS YOU LEARNED:
//
// 1. Router Context in Tests:
//    - Components using useNavigate/useParams/useLocation need Router
//    - Wrap with <BrowserRouter> or <MemoryRouter> in tests
//
// 2. renderWithRouter Helper:
//    - DRY principle - Don't Repeat Yourself
//    - One helper function instead of wrapping every test
//
// 3. BrowserRouter vs MemoryRouter:
//    - BrowserRouter: Uses real browser URL (can cause issues in tests)
//    - MemoryRouter: URL in memory (better for tests, no side effects)
//
// 4. Why this error happens:
//    - useNavigate is a Hook that reads from RouterContext
//    - Without <Router>, context is undefined
//    - React Router throws error
//
// 5. Common pattern for testing:
//    - Always create test utilities/helpers
//    - Keeps tests clean and maintainable
