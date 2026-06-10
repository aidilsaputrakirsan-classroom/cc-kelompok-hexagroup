import { checkAPIConnection } from "./services/api";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useTheme } from "../context/ThemeContext";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import FinancePage from "./components/FinancePage";
import LettersPage from "./components/LettersPage";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  const { darkMode } = useTheme();
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

    if (token && userData) {
      setUser(JSON.parse(userData));
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

  const showToast = (message, type = "success", title = "", icon = "") => {
    setToast({ message, type, title, icon });
    setTimeout(() => {
      setToast({ message: "", type: "", title: "", icon: "" });
    }, 3000);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className={`App ${darkMode ? "dark" : ""}`}>
        
        {/* API STATUS ALERTS */}
        {apiStatus === false && (
          <div className="api-alert offline">
            ⚠️ Backend API is offline — {import.meta.env.VITE_API_URL || "http://localhost:8000"}
          </div>
        )}
        {apiStatus === true && (
          <div className="api-alert online">
            ✅ Backend API connected
          </div>
        )}

        {user && (
          <Header
            user={user}
            setUser={setUser}
          />
        )}

        {/* TOAST NOTIFICATION */}
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
                />
              ) : (
                <Navigate to="/dashboard" />
              )}
            />
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
              element={user && user.role === "ketua" ? <AdminPanel user={user} showToast={showToast} /> : <Navigate to="/dashboard" />}
            />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;