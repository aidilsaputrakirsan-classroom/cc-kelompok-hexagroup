import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, checkAPIConnection } from "../services/api";

export default function LoginPage({ setUser, showToast, theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hoverCard, setHoverCard] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const [apiConnected, setApiConnected] = useState(null);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [authDown, setAuthDown] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const navigate = useNavigate();

  // Fungsi mengecek status API Gateway di halaman Login
const checkConnection = async () => {
  setIsRetrying(true);
  setError("");
  setServiceUnavailable(false);
  setAuthDown(false);
  
  try {
    const status = await checkAPIConnection();
    setApiConnected(status);
    
    // Jika checkAPIConnection mengembalikan false (berarti fetch gagal/offline)
    if (!status) {
      setServiceUnavailable(true);
      setError("Service temporarily unavailable. Please try again later.");
    }
  } catch (err) {
    setApiConnected(false);
    
    // Gunakan optional chaining (?.) yang aman untuk membaca status HTTP
    const httpStatus = err?.response?.status;
    if (httpStatus === 502 || httpStatus === 503) {
      setServiceUnavailable(true);
      setError("Service temporarily unavailable. Please try again later.");
    } else {
      setError(err?.message || "An unexpected error occurred.");
    }
  } finally {
    setIsRetrying(false);
  }
};

useEffect(() => {
  checkConnection();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error agar bersih setiap submit
    setServiceUnavailable(false);
    setAuthDown(false);

    try {
      let response;
      if (isRegister) {
        response = await authAPI.register(email, password, fullName, "anggota");
      } else {
        response = await authAPI.login(email, password);
      }
      
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      showToast(isRegister ? "Akun berhasil dibuat!" : "Berhasil masuk ke sistem", "success");
      navigate("/dashboard");
    } catch (err) {
      const httpStatus = err.response?.status;
      const errorData = err.response?.data;

      // Menangani Error 503 / 502 dari Gateway
      if (httpStatus === 503 || httpStatus === 502) {
        if (errorData?.detail?.includes("auth") || errorData?.message?.includes("Authentication")) {
          setAuthDown(true);
          setError("Some features temporarily unavailable");
        } else {
          setServiceUnavailable(true);
          setError("Service temporarily unavailable. Please try again later.");
        }
        showToast(errorData?.message || "Layanan tidak tersedia", "error");
      } else {
        // Penanganan error kredensial biasa (401 / 400)
        setError(errorData?.message || "Terjadi kesalahan. Periksa data Anda.");
        showToast(errorData?.message || "Gagal memproses permintaan", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageWrapper: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "var(--bg-page)",
      padding: "20px",
      boxSizing: "border-box",
      position: "relative",
    },
    
    topBar: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      padding: "8px 16px",
      borderRadius: "50px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    onlineIndicator: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: apiConnected ? "#22c55e" : "#ef4444",
      boxShadow: apiConnected ? "0 0 10px #22c55e" : "0 0 10px #ef4444",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    },
    themeText: {
      fontSize: "12px",
      fontWeight: "700",
      color: "var(--text-main)",
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      backgroundColor: "var(--bg-card)",
      borderRadius: "24px",
      padding: "40px 35px",
      border: "1px solid var(--border-color)",
      boxShadow: hoverCard ? "0 20px 40px rgba(0,0,0,0.12)" : "0 10px 25px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    },
    headerSection: {
      textAlign: "center",
      marginBottom: "24px", 
    },
    logo: {
      fontSize: "28px",
      fontWeight: "900",
      letterSpacing: "1.5px",
      background: "linear-gradient(to right, #38bdf8, #818cf8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: "0 0 8px 0",
    },
    
    subtitle: {
      fontSize: "14px",
      color: "var(--text-main)",
      opacity: 0.8,
      margin: 0,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "700",
      color: "var(--text-title)",
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid var(--border-color)",
      backgroundColor: "var(--input-bg, var(--bg-page))",
      color: "var(--text-title)",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease",
    },
   
    eyeBtn: {
      position: "absolute",
      right: "14px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#94a3b8",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
    },
    
    submitBtn: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      background: btnHover 
        ? "linear-gradient(135deg, #0284c7, #4f46e5)" 
        : "linear-gradient(135deg, #38bdf8, #818cf8)",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "800",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      boxShadow: btnHover ? "0 8px 20px rgba(56, 189, 248, 0.3)" : "none",
      marginTop: "6px",
    },
    toggleText: {
      textAlign: "center",
      fontSize: "13px",
      color: "var(--text-main)",
      marginTop: "15px",
    },
    toggleLink: {
      color: "#38bdf8",
      fontWeight: "700",
      cursor: "pointer",
      marginLeft: "5px",
    },
    
    bannerError: {
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "15px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      alignItems: "center",
      backgroundColor: authDown ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
      color: authDown ? "#ef4444" : "#f59e0b",
      border: authDown ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
    },
    retryBtn: {
      padding: "4px 12px",
      borderRadius: "6px",
      border: "none",
      fontSize: "11px",
      fontWeight: "700",
      cursor: "pointer",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "inherit",
      transition: "background-color 0.2s",
    }
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* HEADER KANAN ATAS: INDIKATOR ONLINE & TEMA */}
      <div style={styles.topBar}>
        <div style={styles.onlineIndicator} title={apiConnected ? "Gateway Connected" : "Gateway Disconnected"} />
        <span style={styles.themeText}>
          {theme === "dark" ? "🌙 Dark Mode Active" : "☀️ Light Mode Active"}
        </span>
      </div>

      <div 
        style={styles.card}
        onMouseEnter={() => setHoverCard(true)}
        onMouseLeave={() => setHoverCard(false)}
      >
        <div style={styles.headerSection}>
          <h1 style={styles.logo}>SIKASI</h1>
          <p style={styles.subtitle}>
            {isRegister 
              ? "Daftarkan akun baru Anda di bawah ini" 
              : "Silakan masuk untuk mengelola sistem informasi organisasi"}
          </p>
        </div>

        {/* NOTIFIKASI ERROR / 503 SERVICE UNAVAILABLE BANNER */}
        {error && (serviceUnavailable || authDown) && (
          <div style={styles.bannerError}>
            <span>{authDown ? "🔒 Some features temporarily unavailable" : `⚠️ ${error}`}</span>
            <button style={styles.retryBtn} onClick={checkConnection}>
              {isRetrying ? "Memuat..." : "Coba Lagi ↻"}
            </button>
          </div>
        )}

        {/* ERROR VALIDASI BIASA */}
        {error && !serviceUnavailable && !authDown && (
          <div style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", marginBottom: "15px", textAlign: "center", border: "1px solid rgba(239,68,68,0.2)" }}>
            ❌ {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          {isRegister && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  style={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Alamat Email</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                placeholder="nama@domain.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Kata Sandi</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {}
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {loading ? "Memproses..." : isRegister ? "DAFTAR SEBAGAI ANGGOTA" : "MASUK KE SISTEM"}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isRegister ? "Sudah punya akun?" : "Belum memiliki akun?"}
          <span
            style={styles.toggleLink}
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setServiceUnavailable(false);
              setAuthDown(false);
            }}
          >
            {isRegister ? "Masuk di sini" : "Daftar di sini"}
          </span>
        </div>
      </div>
    </div>
  );
}