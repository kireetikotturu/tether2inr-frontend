import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle dark/light theme"
      onClick={toggleTheme}
      className="rounded px-2 py-1 text-brand-gold bg-brand-dark hover:bg-brand-gold hover:text-brand-dark transition-colors"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}