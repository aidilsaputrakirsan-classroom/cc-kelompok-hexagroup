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
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Decorative Elements */}
      <div style={styles.bgBlob1}></div>
      <div style={styles.bgBlob2}></div>

      <div style={styles.wrapper}>
        {/* Left Section - Branding */}
        <div style={styles.brandingSection}>
          <div style={styles.brandLogo}>
            <span style={styles.logoIcon}>📋</span>
          </div>
          <h1 style={styles.brandTitle}>Sistem Keuangan</h1>
          <p style={styles.brandSubtitle}>
            {isRegister 
              ? "Bergabunglah dengan organisasi kami" 
              : "Kelola keuangan organisasi dengan mudah"}
          </p>
          <div style={styles.featureList}>
            <div style={styles.featureItem}>✓ Kelola Keuangan</div>
            <div style={styles.featureItem}>✓ Buat Surat</div>
            <div style={styles.featureItem}>✓ Admin Panel</div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                {isRegister ? "Daftar Akun Baru" : "Masuk ke Akun"}
              </h2>
              <p style={styles.cardSubtitle}>
                {isRegister 
                  ? "Buat akun untuk memulai" 
                  : "Masukkan kredensial Anda"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Full Name Input (Register Only) */}
              {isRegister && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Lengkap</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}>👤</span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              {/* Info Box (Register Only) */}
              {isRegister && (
                <div style={styles.infoBox}>
                  <span style={styles.infoIcon}>ℹ️</span>
                  <span style={styles.infoText}>
                    Daftar sebagai anggota. Bendahara & Sekretaris hanya dapat dibuat oleh Ketua.
                  </span>
                </div>
              )}

              {/* Email Input */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔐</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan password Anda"
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePasswordBtn}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Password Hint (Register Only) */}
                {isRegister && (
                  <div style={styles.passwordHint}>
                    Minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                style={{
                  ...styles.submitBtn,
                  ...(loading && styles.submitBtnLoading)
                }}
                disabled={loading}
              >
                {loading ? (
                  <span style={styles.loadingSpinner}>
                    ⏳ {isRegister ? "Mendaftar..." : "Masuk..."}
                  </span>
                ) : (
                  <span>{isRegister ? "Daftar" : "Masuk"}</span>
                )}
              </button>
            </form>

            {/* Toggle Section */}
            <div style={styles.toggleSection}>
              <p style={styles.toggleText}>
                {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                style={styles.toggleBtn}
              >
                {isRegister ? "Masuk di sini" : "Daftar di sini"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // ===== CONTAINER & BACKGROUND =====
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 70px)",
    background: "linear-gradient(135deg, #0051cf 0%, #001a47 100%)",
    padding: "clamp(20px, 5vw, 40px)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },

  bgBlob1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    top: "-100px",
    right: "-80px",
    filter: "blur(40px)",
  },

  bgBlob2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "50%",
    bottom: "-50px",
    left: "-80px",
    filter: "blur(40px)",
  },

  wrapper: {
    display: "flex",
    width: "100%",
    maxWidth: "1100px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    gap: "0",
    backdropFilter: "blur(10px)",
    animation: "slideIn 0.6s ease-out",

    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },

  // ===== BRANDING SECTION =====
  brandingSection: {
    flex: 1,
    background: "linear-gradient(135deg, #0066ff 0%, #0040cc 100%)",
    padding: "clamp(30px, 5vw, 60px)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: "500px",

    "@media (max-width: 768px)": {
      minHeight: "auto",
      padding: "clamp(20px, 4vw, 40px)",
    },
  },

  brandLogo: {
    fontSize: "clamp(48px, 10vw, 80px)",
    marginBottom: "20px",
    display: "inline-block",
  },

  logoIcon: {
    display: "inline-block",
  },

  brandTitle: {
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: "800",
    margin: "30px 0 10px 0",
    letterSpacing: "-0.5px",
  },

  brandSubtitle: {
    fontSize: "clamp(14px, 2vw, 18px)",
    color: "rgba(255, 255, 255, 0.9)",
    margin: "0 0 30px 0",
    lineHeight: "1.6",
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  featureItem: {
    fontSize: "clamp(13px, 2vw, 15px)",
    color: "rgba(255, 255, 255, 0.85)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  // ===== FORM SECTION =====
  formSection: {
    flex: 1,
    padding: "clamp(30px, 5vw, 50px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    "@media (max-width: 768px)": {
      padding: "clamp(20px, 4vw, 40px)",
    },
  },

  card: {
    width: "100%",
  },

  cardHeader: {
    marginBottom: "30px",
  },

  cardTitle: {
    fontSize: "clamp(24px, 4vw, 32px)",
    fontWeight: "800",
    color: "#1a202c",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },

  cardSubtitle: {
    fontSize: "clamp(13px, 2vw, 15px)",
    color: "#718096",
    margin: "0",
  },

  // ===== ERROR & INFO BOXES =====
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "clamp(10px, 2vw, 14px) clamp(12px, 2vw, 16px)",
    backgroundColor: "#fed7d7",
    border: "1px solid #fc8181",
    borderRadius: "12px",
    color: "#742a2a",
    fontSize: "clamp(12px, 1.5vw, 14px)",
    marginBottom: "20px",
    animation: "shake 0.3s ease-in-out",
  },

  errorIcon: {
    fontSize: "18px",
    flexShrink: 0,
  },

  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "clamp(10px, 2vw, 14px) clamp(12px, 2vw, 16px)",
    backgroundColor: "#c3dafe",
    border: "1px solid #90cdf4",
    borderRadius: "12px",
    color: "#2c5282",
    fontSize: "clamp(12px, 1.5vw, 13px)",
    marginBottom: "20px",
  },

  infoIcon: {
    fontSize: "16px",
    flexShrink: 0,
    marginTop: "2px",
  },

  infoText: {
    lineHeight: "1.5",
  },

  // ===== FORM =====
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "clamp(13px, 1.5vw, 14px)",
    fontWeight: "600",
    color: "#2d3748",
    display: "block",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "18px",
    pointerEvents: "none",
    color: "#a0aec0",
  },

  input: {
    width: "100%",
    paddingLeft: "44px",
    paddingRight: "44px",
    paddingTop: "clamp(10px, 1.5vw, 12px)",
    paddingBottom: "clamp(10px, 1.5vw, 12px)",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "clamp(13px, 1.5vw, 14px)",
    color: "#1a202c",
    backgroundColor: "#f7fafc",
    boxSizing: "border-box",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",

    "&:focus": {
      borderColor: "#3b82f6",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },

    "&:hover": {
      borderColor: "#cbd5e0",
    },
  },

  togglePasswordBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#718096",
    padding: "8px",
    transition: "color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      color: "#2d3748",
    },
  },

  passwordHint: {
    fontSize: "clamp(11px, 1.5vw, 12px)",
    color: "#a0aec0",
    marginTop: "4px",
    fontStyle: "italic",
  },

  // ===== BUTTON =====
  submitBtn: {
    width: "100%",
    padding: "clamp(11px, 2vw, 14px)",
    backgroundColor: "linear-gradient(135deg, #0066ff 0%, #0040cc 100%)",
    backgroundImage: "linear-gradient(135deg, #0066ff 0%, #0040cc 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    marginTop: "8px",
    boxShadow: "0 10px 25px rgba(0, 102, 255, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",

    "&:hover:not(:disabled)": {
      transform: "translateY(-2px)",
      boxShadow: "0 15px 35px rgba(59, 130, 246, 0.4)",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
      boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)",
    },
  },

  submitBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  // ===== TOGGLE SECTION =====
  toggleSection: {
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
  },

  toggleText: {
    fontSize: "clamp(13px, 1.5vw, 14px)",
    color: "#718096",
    margin: "0 0 10px 0",
  },

  toggleBtn: {
    background: "none",
    border: "none",
    color: "#0066ff",
    fontSize: "clamp(13px, 1.5vw, 14px)",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "underline",
    transition: "all 0.3s",
    padding: "4px 8px",
    borderRadius: "6px",

    "&:hover": {
      color: "#0040cc",
      backgroundColor: "#e6f0ff",
      textDecoration: "none",
    },
  },
};