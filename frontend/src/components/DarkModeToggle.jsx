<<<<<<< feature/dark-mode
import { useTheme } from "../context/ThemeContext";

function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
=======
import { useState, useEffect } from "react";

const buttonStyle = {
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "#f8fafc",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "8px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
  transition: "all 0.3s ease",
};

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
>>>>>>> main

  return (
    <button
      onClick={toggleDarkMode}
<<<<<<< feature/dark-mode
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
=======
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.boxShadow = "0 4px 12px rgba(56, 189, 248, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "none";
      }}
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
>>>>>>> main
