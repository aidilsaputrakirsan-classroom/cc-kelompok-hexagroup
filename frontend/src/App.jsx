import { checkAPIConnection } from "./services/api";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useTheme } from "./context/ThemeContext";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import FinancePage from "./components/FinancePage";
import LettersPage from "./components/LettersPage";
import AdminPanel from "./components/AdminPanel";
import StatusPage from "./pages/StatusPage";
import "./App.css";

function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "",
    title: "",
    icon: ""
  });

  useEffect(() => {
  const token = localStorage.getItem("access_token");
  const userData = localStorage.getItem("user");

  try {
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  }

  setLoading(false);
  checkAPIConnection().then(setApiStatus);
}, []);

  // GLOBAL DARK MODE SYNC
  useEffect(() => {
    document.documentElement.setAttribute(
  "data-theme",
  darkMode ? "dark" : "light"
);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const showToast = (
  message,
  type = "success",
  title = "",
  icon = "",
  duration = 5000
) => {
  setToast({ message, type, title, icon });

  // clear timeout lama biar tidak numpuk
  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    setToast({ message: "", type: "", title: "", icon: "" });
  }, duration);
};

  if (loading) {
    return <div className="loading-screen">
  <div className="api-indicator" style={{ color: "#3b82f6" }} />
  Loading...
</div>
  }

  return (
    <Router>
      <div className={`App ${darkMode ? "dark" : ""}`}>
        
      {user && (
          <Header
            user={user}
            setUser={setUser}
            apiConnected={apiStatus} 
          />
        )}

        {/* CUSTOM TOAST NOTIFICATION */}
        {toast.message && (
          <div className="custom-toast">
            <div className="toast-icon">{toast.icon || (toast.type === "success" ? "✅" : "⚠️")}</div>
            <h3>{toast.title || (toast.type === "success" ? "Berhasil!" : "Oops!")}</h3>
            <p>{toast.message}</p>
          </div>
        )}

        {/* AREA KONTEN UTAMA */}
        <main className="theme-transition-wrapper">
          <Routes>
            <Route
              path="/login"
              element={!user ? (
                <LoginPage 
                  setUser={setUser} 
                  showToast={showToast} 
                  theme={darkMode ? "dark" : "light"}
                  toggleTheme={toggleDarkMode}
                />
              ) : (
                <Navigate to="/dashboard" />
              )}
            />
            
            {/* Keamanan rute tetap terjaga berdasarkan state user */}
            <Route
              path="/dashboard"
              element={user ? <Dashboard user={user} showToast={showToast} /> : <Navigate to="/login" />}
            />
            <Route
              path="/finance"
              element={user ? <FinancePage user={user} showToast={showToast} /> : <Navigate to="/login" />}
            />
            <Route
              path="/letters"
              element={user ? <LettersPage user={user} showToast={showToast} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={user && user.role?.toLowerCase() === "ketua" ? <AdminPanel user={user} showToast={showToast} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/status"
              element={<StatusPage />}
            />
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;