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
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: darkMode ? "#fbbf24" : "#64748b",
        }}
      />
      <span>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
    </div>
  </button>
);
    </button>
  );
}

export default DarkModeToggle;