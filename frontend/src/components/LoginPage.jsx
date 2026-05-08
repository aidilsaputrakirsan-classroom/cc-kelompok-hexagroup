import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function LoginPage({ setUser, showToast, theme, toggleTheme }) {
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
    setError(""); // Reset error agar bersih setiap submit
    
    try {
      let response;
      if (isRegister) {
        response = await authAPI.register(email, password, fullName);
      } else {
        response = await authAPI.login(email, password);
      }
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      showToast(isRegister ? "Akun berhasil dibuat" : "Berhasil masuk", "success");
      navigate("/dashboard");
    } catch (err) {
      // Error ditangkap di sini, tampil di placeholder tanpa merusak layout
      setError(err.message || "Terjadi kesalahan");
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgBlob1}></div>
      <div style={styles.bgBlob2}></div>

      <div style={styles.wrapper}>
        {/* SISI KIRI: BRANDING */}
        <div style={styles.brandingSection}>
          <div style={styles.brandContent}>
            <div style={styles.brandLogo}>📋</div>
            <h1 style={styles.brandTitle}>Sistem Keuangan</h1>
            <p style={styles.brandSubtitle}>Kelola keuangan organisasi dengan mudah</p>
            <div style={styles.featureList}>
              <p>✓ Kelola Keuangan</p>
              <p>✓ Buat Surat</p>
              <p>✓ Admin Panel</p>
            </div>
          </div>
        </div>

        {/* SISI KANAN: FORM */}
        <div style={styles.formSection}>
          <div style={styles.formContent}>
            <div style={styles.headerFlex}>
              <h2 style={styles.cardTitle}>{isRegister ? "Daftar" : "Masuk"}</h2>
              <button onClick={toggleTheme} style={styles.inlineToggle}>
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
            <p style={styles.cardSubtitle}>{isRegister ? "Lengkapi data Anda" : "Silakan masuk ke akun Anda"}</p>

            {/* ERROR AREA: Tetap dipesan tempatnya agar tidak kedip/geser */}
            <div style={styles.errorPlaceholder}>
              {error && (
                <div style={styles.errorBox}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {isRegister && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Lengkap</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}>👤</span>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Nama lengkap" style={styles.input} />
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@gmail.com" style={styles.input} />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔐</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Password" 
                    style={styles.input} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? "Memproses..." : (isRegister ? "Daftar" : "Masuk")}
              </button>
            </form>

            <div style={styles.toggleSection}>
              <button type="button" onClick={() => { setIsRegister(!isRegister); setError(""); }} style={styles.toggleBtn}>
                {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100vh", width: "100vw", background: "var(--bg-page)",
    position: "relative", overflow: "hidden"
  },
  wrapper: {
    display: "flex", width: "100%", maxWidth: "1000px", minHeight: "600px",
    backgroundColor: "var(--bg-card)", borderRadius: "24px", overflow: "hidden",
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", zIndex: 1
  },
  brandingSection: {
    width: "50%", background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "40px"
  },
  brandContent: { textAlign: "center" },
  brandLogo: { fontSize: "60px", marginBottom: "15px" },
  brandTitle: { fontSize: "30px", fontWeight: "800", margin: "0" },
  brandSubtitle: { fontSize: "14px", opacity: 0.8, margin: "10px 0 30px" },
  featureList: { textAlign: "left", display: "inline-block", fontSize: "14px" },

  formSection: {
    width: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px"
  },
  formContent: { width: "100%", maxWidth: "340px" },
  headerFlex: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: "28px", fontWeight: "800", color: "var(--text-title)", margin: 0 },
  inlineToggle: { 
    background: "var(--bg-page)", border: "1px solid var(--border-color)", 
    borderRadius: "10px", padding: "8px", cursor: "pointer", fontSize: "18px" 
  },
  cardSubtitle: { fontSize: "14px", color: "var(--text-main)", opacity: 0.5, marginBottom: "10px" },
  
  // AREA ERROR (Placeholder biar tidak geser)
  errorPlaceholder: {
    minHeight: "50px", 
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
  },
  errorBox: { 
    width: "100%",
    padding: "10px", 
    backgroundColor: "rgba(239, 68, 68, 0.1)", 
    borderRadius: "10px", 
    color: "#ef4444", 
    fontSize: "13px",
    border: "1px solid rgba(239, 68, 68, 0.2)"
  },

  form: { display: "flex", flexDirection: "column", gap: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "600", color: "var(--text-title)" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "15px", color: "#94a3b8" },
  input: { 
    width: "100%", padding: "12px 15px 12px 42px", borderRadius: "10px", 
    border: "1px solid var(--border-color)", backgroundColor: "var(--bg-page)", 
    color: "var(--text-main)", outline: "none", boxSizing: "border-box"
  },
  eyeBtn: { position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" },
  submitBtn: { 
    width: "100%", padding: "14px", backgroundColor: "#4f46e5", color: "white", 
    border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", marginTop: "10px" 
  },
  toggleSection: { textAlign: "center", marginTop: "20px" },
  toggleBtn: { background: "none", border: "none", color: "#4f46e5", fontWeight: "600", cursor: "pointer", fontSize: "13px" },

  bgBlob1: { position: "absolute", width: "500px", height: "500px", backgroundColor: "rgba(79, 70, 229, 0.1)", borderRadius: "50%", top: "-100px", right: "-100px", filter: "blur(80px)" },
  bgBlob2: { position: "absolute", width: "400px", height: "400px", backgroundColor: "rgba(59, 130, 246, 0.08)", borderRadius: "50%", bottom: "-100px", left: "-100px", filter: "blur(80px)" },
};