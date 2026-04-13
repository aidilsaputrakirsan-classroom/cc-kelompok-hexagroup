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

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
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
              top: "20px",
              right: "20px",
              padding: "12px 20px",
              borderRadius: "8px",
              color: "white",
              backgroundColor: toast.type === "success" ? "#4CAF50" : "#f44336",
              zIndex: 9999,
            }}
          >
            {toast.message}
          </div>
        )}

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
