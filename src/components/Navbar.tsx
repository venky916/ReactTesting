// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCounterStore } from "../store/counterStore";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { count, increment } = useCounterStore();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              Testing App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/users"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Users
                </Link>
                <Link
                  to="/all-users"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  All Users
                </Link>
                <Link
                  to="/form-validation"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Form Validation
                </Link>
                <Link
                  to="/todos"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Todos
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Right side: Counter, Theme, User */}
          <div className="flex items-center space-x-4">
            {/* Zustand Counter */}
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-sm font-semibold">
                Global Counter: {count}
              </span>
              <button
                onClick={increment}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                +
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* User Info / Logout */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
