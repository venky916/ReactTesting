import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export function HomePage() {
  const { isAuthenticated } = useAuth();
    const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Welcome to Testing App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A complete React testing demonstration with E2E tests
          </p>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Get Started - Login
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">🧪 Unit Testing</h3>
            <p className="text-gray-600">
              Components, hooks, and utilities tested
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">🔗 Integration Testing</h3>
            <p className="text-gray-600">Multi-component workflows tested</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">🎬 E2E Testing</h3>
            <p className="text-gray-600">Complete user journeys automated</p>
          </div>
        </div>

        <div className="mt-4 border-2 p-2">
          <h2>Simple Counter</h2>
          <p className="p-2 ">Count: {count}</p>
          <button
            onClick={() => setCount(count + 1)}
            className="rounded-md border p-2 cursor-pointer bg-green-400 m-2"
          >
            Increment
          </button>
          <button
            onClick={() => setCount(count - 1)}
            className="rounded-md border p-2 cursor-pointer bg-red-400 m-2"
          >
            Decrement
          </button>
          <button
            onClick={() => setCount(0)}
            className="rounded-md border p-2 cursor-pointer bg-yellow-400 m-2"
          >
            Reset
          </button>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
