import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function LoginPage({ setUser, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isRegister) {
        response = await authAPI.register(email, password, fullName);
      } else {
        response = await authAPI.login(email, password);
      }

      // Save tokens and user data
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);

      // ✅ TOAST SUCCESS
      showToast(
        isRegister ? "Register berhasil!" : "Login berhasil!",
        "success"
      );

      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.message || "Terjadi kesalahan";

      setError(errorMsg);

      // ❌ TOAST ERROR
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div style={{ ...styles.info }}>
                Register as member. Bendahara & Sekretaris can only be created
                by Ketua in Admin Panel.
              </div>
              <div style={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your Full Name"
                />
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            {isRegister && (
              <div style={styles.passwordHint}>
                Min 8 chars, 1 uppercase, 1 lowercase, 1 digit
              </div>
            )}
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={styles.toggleBtn}
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 100px)",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  info: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "13px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  passwordHint: {
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
    fontStyle: "italic",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  toggleText: {
    textAlign: "center",
    marginTop: "20px",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#3498db",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
};