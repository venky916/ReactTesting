// src/App.tsx - NEW VERSION with React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TodosPage } from "./pages/TodosPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UsersPage } from "./pages/UserPage";
import { AllUserPage } from "./pages/AllUserPage";
import { ValidationFormPage } from "./pages/ValidationFormPage";
import { UserDetailPage } from "./pages/UserDetailPage";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen transition-colors duration-200">
              <Navbar />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-users"
                  element={
                    <ProtectedRoute>
                      <AllUserPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/form-validation"
                  element={
                    <ProtectedRoute>
                      <ValidationFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/:userId"
                  element={
                    <ProtectedRoute>
                      <UserDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/todos"
                  element={
                    <ProtectedRoute>
                      <TodosPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

// 🎓 WHAT THIS ENABLES FOR E2E TESTING:
//
// ✅ Complete User Journeys:
//    - Visit home → Click login → Login → See dashboard
//    - Try to access /dashboard without auth → Redirect to /login
//    - Login → Navigate to todos → Add todo → See in list
//    - Toggle theme → Persists across pages
//    - Increment counter → Persists across pages
//
// ✅ Protected Route Testing:
//    - Authenticated users can access all pages
//    - Unauthenticated users redirected to /login
//
// ✅ Navigation Testing:
//    - Click navbar links
//    - Browser back/forward buttons
//    - Direct URL navigation
//
// ✅ 404 Testing:
//    - Invalid URLs show 404 page
//    - 404 page has "Go Home" link
//
// ✅ Logout Testing:
//    - Logout → Can't access protected routes
//    - Logout → Navbar updates
//    - Logout → Redirected appropriately
