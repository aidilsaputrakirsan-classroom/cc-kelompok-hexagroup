import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Baca dari localStorage saat inisialisasi agar konsisten setelah refresh
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Sinkronkan data-theme pada documentElement (html) agar CSS variables bekerja
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    // Simpan ke localStorage
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);