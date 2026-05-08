import { useTheme } from "../context/ThemeContext";

function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        padding: "10px 16px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
        background: darkMode ? "#f8fafc" : "#1e293b",
        color: darkMode ? "#1e293b" : "#f8fafc",
        transition: "0.3s",
      }}
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}

export default DarkModeToggle;