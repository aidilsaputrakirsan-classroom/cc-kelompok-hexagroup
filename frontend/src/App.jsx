import { checkAPIConnection } from "./services/api";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import FinancePage from "./components/FinancePage";
import LettersPage from "./components/LettersPage";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "", // success / error
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

    // Check API connection
    checkAPIConnection().then(setApiStatus);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = "success", title = "", icon = "") => {
    setToast({ message, type, title, icon });

    setTimeout(() => {
      setToast({ message: "", type: "", title: "", icon: "" });
    }, 3000);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <Router>
      <div className="App">
        {apiStatus === false && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            ⚠️ Backend API is offline — cannot connect to{" "}
            {import.meta.env.VITE_API_URL || "http://localhost:8000"}
          </div>
        )}
        {apiStatus === true && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "10px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            ✅ Backend API connected
          </div>
        )}
        {user && <Header user={user} setUser={setUser} />}

        {toast.message && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              padding: "clamp(30px, 4vw, 50px)",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              zIndex: 10001,
              animation: "fadeInScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {toast.icon || (toast.type === "success" ? "✅" : "⚠️")}
            </div>
            <h3 style={{ 
              fontSize: "clamp(20px, 3vw, 24px)", 
              fontWeight: "900", 
              color: "#1e293b", 
              margin: "0 0 8px 0" 
            }}>
              {toast.title || (toast.type === "success" ? "Berhasil!" : "Oops!")}
            </h3>
            <p style={{ 
              fontSize: "14px", 
              color: "#64748b", 
              margin: 0, 
              lineHeight: "1.5" 
            }}>
              {toast.message}
            </p>
          </div>
        )}
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>

        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <LoginPage setUser={setUser} showToast={showToast} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} showToast={showToast} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/finance"
            element={
              user ? (
                <FinancePage user={user} showToast={showToast} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/letters"
            element={
              user ? (
                <LettersPage user={user} showToast={showToast} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === "ketua" ? (
                <AdminPanel user={user} showToast={showToast} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
