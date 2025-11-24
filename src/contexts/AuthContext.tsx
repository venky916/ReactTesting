import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("authUser", null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === "test@example.com" && password === "password123") {
      const newUser: User = {
        id: "1",
        name: "Test User",
        email: email,
        role: "admin",
      };

      setUser(newUser);
    } else {
      throw new Error("Invalid credentials");
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be within AuthProvider");
  }
  return context;
}

// 🎓 WHAT WE'LL TEST:
// 1. Provider wraps children correctly
// 2. Initial state (no user)
// 3. Login with valid credentials
// 4. Login with invalid credentials
// 5. Logout clears user
// 6. isAuthenticated flag updates
// 7. Loading states
