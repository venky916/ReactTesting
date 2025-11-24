import { Button } from "../components/Button";
import { ThemedContent, ThemeSwitcher } from "../components/ThemeSwitcher";
import { useAuth } from "../contexts/AuthContext";
import { useCounterStore } from "../store/counterStore";

export function DashboardPage() {
  const { user } = useAuth();
  const { count } = useCounterStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Welcome Back!
          </h3>
          <p className="text-2xl font-bold text-blue-600">{user?.name}</p>
          <p className="text-gray-600 mt-2">{user?.email}</p>
          <p className="text-sm text-gray-500 mt-1">Role: {user?.role}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Global Counter
          </h3>
          <p className="text-4xl font-bold text-green-600">{count}</p>
          <p className="text-gray-600 mt-2">Zustand State</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Quick Stats
          </h3>
          <p className="text-gray-600">✅ Tests Passing</p>
          <p className="text-gray-600">🔐 Auth Working</p>
          <p className="text-gray-600">🎨 Theme Active</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">🎉 You're logged in!</h3>
        <p className="text-gray-700">
          This is a protected page. Try navigating to other protected routes or
          logout to test the flow.
        </p>
      </div>
      <ThemeSwitcher />
      <ThemedContent />
      <Button label="Click Me" onClick={() => {}} />
    </div>
  );
}
