import { useNavigate } from "react-router-dom";
import { Login } from "../components/Login";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">LoginPage</h2>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
          <p className="text-sm text-blue-600 mt-4">
            Test credentials: test@example.com / password123
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
}
