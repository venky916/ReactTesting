import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { UserDetails } from "./UserDetails";
import * as userApi from "../services/userApi";

vi.mock("../services/userApi");

describe("UserDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Does it show loading initially?
  it("should show loading state initially", () => {
    vi.mocked(userApi.fetchUserById).mockImplementation(
      () => new Promise(() => {})
    );

    render(<UserDetails userId={1} />);
    expect(screen.getByText(/loading user details/i)).toBeInTheDocument();
  });

  // TEST 2: Does it display user details after successful fetch?
  it("should display user details after successful fetch", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
    };

    vi.mocked(userApi.fetchUserById).mockResolvedValue(mockUser);

    render(<UserDetails userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  // TEST 3: Does it show error when fetch fails?
  it("should show error when fetch fails", async () => {
    vi.mocked(userApi.fetchUserById).mockRejectedValue(
      new Error("User with id 999 not found")
    );

    render(<UserDetails userId={999} />);

    await waitFor(() => {
      expect(
        screen.getByText(/user with id 999 not found/i)
      ).toBeInTheDocument();
    });
  });

  // TEST 4: Does it call API with correct userId?
  it("should call fetchUserById with correct userId", async () => {
    const mockUser = {
      id: 5,
      name: "Test User",
      email: "test@example.com",
      role: "User",
    };

    vi.mocked(userApi.fetchUserById).mockResolvedValue(mockUser);
    render(<UserDetails userId={5} />);

    expect(userApi.fetchUserById).toHaveBeenCalledWith(5);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  // TEST 5: 🔥 ADVANCED - Does it re-fetch when userId prop changes?
  it("should re-fetch user when userId prop changes", async () => {
    const mockUser1 = {
      id: 1,
      name: "User One",
      email: "user1@example.com",
      role: "User",
    };

    const mockUser2 = {
      id: 2,
      name: "User Two",
      email: "user2@example.com",
      role: "Admin",
    };

    vi.mocked(userApi.fetchUserById).mockResolvedValueOnce(mockUser1);

    vi.mocked(userApi.fetchUserById).mockResolvedValueOnce(mockUser2);

    const { rerender } = render(<UserDetails userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("User One")).toBeInTheDocument();
    });

    rerender(<UserDetails userId={2} />);

    await waitFor(() => {
      expect(screen.getByText("User Two")).toBeInTheDocument();
    });

    expect(userApi.fetchUserById).toHaveBeenCalledTimes(2);

    expect(userApi.fetchUserById).toHaveBeenNthCalledWith(1, 1);
    expect(userApi.fetchUserById).toHaveBeenNthCalledWith(2, 2);
  });

  // TEST 6: Does it handle null user gracefully?
  it("should show 'User not found' when user is null", async () => {
    vi.mocked(userApi.fetchUserById).mockResolvedValue(null as any);

    render(<UserDetails userId={1} />);
    await waitFor(() => {
      expect(screen.getByText(/user not found/i)).toBeInTheDocument();
    });
  });

  // TEST 7: Does loading state clear after data loads?
  it("should hide loading after data loads", async () => {
    const mockUser = {
      id: 1,
      name: "Test",
      email: "test@example.com",
      role: "User",
    };

    vi.mocked(userApi.fetchUserById).mockResolvedValue(mockUser);
    render(<UserDetails userId={1} />);

    expect(screen.getByText(/loading user details/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText(/loading user details/i)
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

// 🎓 ADVANCED CONCEPTS LEARNED:
//
// 1. rerender() - Re-render component with new props
//    - Tests prop changes
//    - Simulates real-world prop updates
//
// 2. mockResolvedValueOnce() - Mock sequence of responses
//    - First call returns one value
//    - Second call returns different value
//    - Perfect for testing prop changes
//
// 3. toHaveBeenNthCalledWith() - Check specific call arguments
//    - Verify 1st call had certain arguments
//    - Verify 2nd call had different arguments
//
// 4. Testing useEffect dependencies:
//    - Change props to trigger useEffect
//    - Verify API is called again with new values
//
// 5. queryBy for absence testing:
//    - queryByText returns null if not found
//    - Use with .not.toBeInTheDocument()
//    - Perfect for "loading disappeared" tests
//
// ⚠️ IMPORTANT LESSON:
// ❌ DON'T USE: getByRole('status') or getByRole('alert') with text matching
// ✅ ALWAYS USE: getByText() for text content
// 
// Why? Because role="status" and role="alert" don't automatically 
// have accessible names from their text content!
