import { useTheme } from "../contexts/ThemeContext";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Theme Switcher</h2>
      <p className="mb-4">
        Current theme: <strong>{theme}</strong>
      </p>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme
      </button>
    </div>
  );
}

export function ThemedContent() {
  const { theme } = useTheme();

  return (
    <div className="p-6">
      <p>This content adapts to the theme</p>
      <p>Theme is: {theme}</p>
    </div>
  );
}
