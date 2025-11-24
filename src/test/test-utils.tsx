import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

export function renderWithProvider(ui: ReactElement, options?: RenderOptions) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        {/* Add more providers here as needed:
            <ThemeProvider>
            <AuthProvider>
            <QueryClientProvider>
        */}
        {children}
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { renderWithProvider as render };

export { renderWithProvider as render };

// 🎓 HOW TO USE:
//
// Instead of:
//   import { render } from "@testing-library/react";
//
// Use:
//   import { render } from "../test/test-utils";
//
// Now ALL your tests automatically have Router context!
// Add more providers (Theme, Auth, etc.) in Wrapper as needed!

// usage
// import { render, screen, waitFor } from "../test/test-utils";
// render(<UserList />); // ✅ Auto-wrapped with Router!
