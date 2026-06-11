import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, checkAPIConnection } from "../services/api";

// ===== SVG EYE ICONS =====
const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ===== VALIDASI HELPER =====
const validateEmail = (email) => {
  if (!email) return "";
  if (!email.includes("@")) return "Email harus mengandung karakter '@'";
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[1]) return "Email tidak valid setelah '@'";
  if (!parts[1].includes(".")) return "Email harus mengandung domain (contoh: .com, .id)";
  const domainParts = parts[1].split(".");
  if (domainParts[domainParts.length - 1].length < 2) return "Ekstensi domain tidak valid (contoh: .com, .id, .net)";
  return "";
};

const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  return checks;
};

const getPasswordErrorMessage = (checks) => {
  if (!checks.length) return "Password minimal 8 karakter";
  if (!checks.uppercase) return "Password harus mengandung minimal 1 huruf kapital";
  if (!checks.lowercase) return "Password harus mengandung minimal 1 huruf kecil";
  if (!checks.number) return "Password harus mengandung minimal 1 angka";
  return "";
};

const validateFullName = (name) => {
  if (!name) return "";
  if (name.trim().length < 3) return "Nama lengkap minimal 3 karakter";
  if (/^\d+$/.test(name.trim())) return "Nama lengkap tidak boleh hanya berisi angka";
  return "";
};

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

  // Validasi inline per-field
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "", fullName: "" });
  const [touchedFields, setTouchedFields] = useState({ email: false, password: false, fullName: false });
  const [passwordChecks, setPasswordChecks] = useState({ length: false, uppercase: false, lowercase: false, number: false });
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const [apiConnected, setApiConnected] = useState(null);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [authDown, setAuthDown] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const navigate = useNavigate();

  // Update password checks secara real-time
  useEffect(() => {
    if (password) {
      setPasswordChecks(validatePassword(password));
    }
  }, [password]);

  // Fungsi mengecek status API Gateway di halaman Login
  const checkConnection = async () => {
    setIsRetrying(true);
    setError("");
    setServiceUnavailable(false);
    setAuthDown(false);
    
    try {
      const status = await checkAPIConnection();
      setApiConnected(status);
      
      if (!status) {
        setServiceUnavailable(true);
        setError("Service temporarily unavailable. Please try again later.");
      }
    } catch (err) {
      setApiConnected(false);
      
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

  // ===== HANDLER BLUR (saat user keluar dari field) =====
  const handleEmailBlur = () => {
    setTouchedFields((prev) => ({ ...prev, email: true }));
    setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouchedFields((prev) => ({ ...prev, password: true }));
    const checks = validatePassword(password);
    setFieldErrors((prev) => ({ ...prev, password: getPasswordErrorMessage(checks) }));
  };

  const handleFullNameBlur = () => {
    setTouchedFields((prev) => ({ ...prev, fullName: true }));
    setFieldErrors((prev) => ({ ...prev, fullName: validateFullName(fullName) }));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Jalankan semua validasi dulu sebelum kirim ke backend
    const emailErr = validateEmail(email);
    const pwdChecks = validatePassword(password);
    const pwdErr = getPasswordErrorMessage(pwdChecks);
    const nameErr = isRegister ? validateFullName(fullName) : "";

    // Tandai semua field sebagai "touched" agar error langsung muncul
    setTouchedFields({ email: true, password: true, fullName: true });
    setFieldErrors({ email: emailErr, password: pwdErr, fullName: nameErr });

    if (emailErr || pwdErr || nameErr) {
      return; // Jangan kirim ke backend jika ada error validasi
    }

    setLoading(true);
    setError("");
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
      const httpStatus = err.response?.status || (err.message?.includes("404") ? 404 : null);
      const errorData = err.response?.data;
      const rawMessage = err.message || "";

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
      } else if (httpStatus === 404 || rawMessage.includes("Email tidak terdaftar")) {
        // Email tidak ada di sistem
        setError("Email tidak terdaftar di sistem. Periksa kembali atau daftar akun baru.");
        showToast("Email tidak terdaftar", "error");
      } else if (httpStatus === 400 && isRegister) {
        // Email sudah ada saat registrasi
        const detail = errorData?.detail || rawMessage;
        if (detail.toLowerCase().includes("already")) {
          setError("Email ini sudah terdaftar. Silakan gunakan email lain atau masuk dengan akun yang ada.");
        } else {
          setError(detail || "Data pendaftaran tidak valid.");
        }
        showToast("Email sudah terdaftar", "error");
      } else if (httpStatus === 401) {
        // Password salah
        const detail = errorData?.detail || rawMessage;
        setError(detail || "Password yang Anda masukkan salah. Periksa kembali.");
        showToast("Password salah", "error");
      } else if (httpStatus === 422) {
        // Validasi Pydantic backend (format data salah)
        const detail = errorData?.detail;
        if (Array.isArray(detail)) {
          const messages = detail.map((d) => d.msg || "").join(", ");
          setError(messages || "Format data tidak valid.");
        } else {
          setError(typeof detail === "string" ? detail : "Format data tidak valid.");
        }
        showToast("Data tidak valid", "error");
      } else {
        setError(errorData?.message || rawMessage || "Terjadi kesalahan. Periksa data Anda.");
        showToast(errorData?.message || "Gagal memproses permintaan", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset saat toggle login/register
  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setServiceUnavailable(false);
    setAuthDown(false);
    setFieldErrors({ email: "", password: "", fullName: "" });
    setTouchedFields({ email: false, password: false, fullName: false });
    setShowPasswordHints(false);
  };

  const allPasswordChecksPassed =
    passwordChecks.length && passwordChecks.uppercase && passwordChecks.lowercase && passwordChecks.number;

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
      gap: "16px",
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
    labelHint: {
      fontSize: "11px",
      fontWeight: "400",
      color: "var(--text-main)",
      opacity: 0.7,
      marginLeft: "6px",
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    input: (hasError) => ({
      width: "100%",
      padding: "12px 16px",
      paddingRight: "44px",
      borderRadius: "12px",
      border: hasError ? "1.5px solid #ef4444" : "1px solid var(--border-color)",
      backgroundColor: "var(--input-bg, var(--bg-page))",
      color: "var(--text-title)",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease",
    }),
   
    eyeBtn: {
      position: "absolute",
      right: "14px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--text-main)",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      opacity: 0.6,
      transition: "opacity 0.2s",
    },

    fieldError: {
      fontSize: "11.5px",
      color: "#ef4444",
      fontWeight: "600",
      marginTop: "2px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },

    // Password strength checklist
    passwordHints: {
      backgroundColor: "var(--bg-page)",
      border: "1px solid var(--border-color)",
      borderRadius: "10px",
      padding: "10px 14px",
      marginTop: "4px",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    passwordHintRow: (passed) => ({
      fontSize: "11.5px",
      fontWeight: "600",
      color: passed ? "#22c55e" : "var(--text-main)",
      opacity: passed ? 1 : 0.65,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "color 0.2s, opacity 0.2s",
    }),
    
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
    
    // Error banner — gunakan CSS variables agar tema tetap konsisten
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
      backgroundColor: authDown ? "rgba(239, 68, 68, 0.12)" : "rgba(245, 158, 11, 0.12)",
      color: authDown ? "#ef4444" : "#f59e0b",
      border: authDown ? "1px solid rgba(239, 68, 68, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
    },
    retryBtn: {
      padding: "4px 12px",
      borderRadius: "6px",
      border: "none",
      fontSize: "11px",
      fontWeight: "700",
      cursor: "pointer",
      backgroundColor: "rgba(128, 128, 128, 0.15)",
      color: "inherit",
      transition: "background-color 0.2s",
    },

    // Error kredensial biasa — gunakan CSS variables
    credentialError: {
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      padding: "10px 14px",
      borderRadius: "10px",
      fontSize: "13px",
      fontWeight: "600",
      marginBottom: "15px",
      textAlign: "center",
    },
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

        {/* ERROR KREDENSIAL / REGISTRASI */}
        {error && !serviceUnavailable && !authDown && (
          <div style={styles.credentialError}>
            ❌ {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          {/* FIELD NAMA LENGKAP — hanya di registrasi */}
          {isRegister && (
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Nama Lengkap
                <span style={styles.labelHint}>— min. 3 karakter</span>
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  style={styles.input(touchedFields.fullName && !!fieldErrors.fullName)}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (touchedFields.fullName) {
                      setFieldErrors((prev) => ({ ...prev, fullName: validateFullName(e.target.value) }));
                    }
                  }}
                  onBlur={handleFullNameBlur}
                  required
                />
              </div>
              {touchedFields.fullName && fieldErrors.fullName && (
                <span style={styles.fieldError}>⚠ {fieldErrors.fullName}</span>
              )}
            </div>
          )}

          {/* FIELD EMAIL */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Alamat Email
              <span style={styles.labelHint}>— format: nama@domain.com</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="nama@domain.com"
                style={styles.input(touchedFields.email && !!fieldErrors.email)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touchedFields.email) {
                    setFieldErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                  }
                }}
                onBlur={handleEmailBlur}
                required
              />
            </div>
            {touchedFields.email && fieldErrors.email && (
              <span style={styles.fieldError}>⚠ {fieldErrors.email}</span>
            )}
          </div>

          {/* FIELD PASSWORD */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Kata Sandi
              {isRegister && <span style={styles.labelHint}>— min. 8 karakter, huruf & angka</span>}
            </label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={styles.input(touchedFields.password && !!fieldErrors.password)}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touchedFields.password) {
                    const checks = validatePassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: getPasswordErrorMessage(checks) }));
                  }
                }}
                onFocus={() => isRegister && setShowPasswordHints(true)}
                onBlur={() => {
                  handlePasswordBlur();
                  if (allPasswordChecksPassed) setShowPasswordHints(false);
                }}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>

            {/* Error password (login mode atau saat register sudah ter-touch) */}
            {touchedFields.password && fieldErrors.password && !showPasswordHints && (
              <span style={styles.fieldError}>⚠ {fieldErrors.password}</span>
            )}

            {/* Password strength checklist — muncul saat registrasi & field aktif */}
            {isRegister && showPasswordHints && (
              <div style={styles.passwordHints}>
                <div style={styles.passwordHintRow(passwordChecks.length)}>
                  {passwordChecks.length ? "✓" : "○"} Minimal 8 karakter
                </div>
                <div style={styles.passwordHintRow(passwordChecks.uppercase)}>
                  {passwordChecks.uppercase ? "✓" : "○"} Minimal 1 huruf kapital (A-Z)
                </div>
                <div style={styles.passwordHintRow(passwordChecks.lowercase)}>
                  {passwordChecks.lowercase ? "✓" : "○"} Minimal 1 huruf kecil (a-z)
                </div>
                <div style={styles.passwordHintRow(passwordChecks.number)}>
                  {passwordChecks.number ? "✓" : "○"} Minimal 1 angka (0-9)
                </div>
              </div>
            )}
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
            onClick={handleToggleMode}
          >
            {isRegister ? "Masuk di sini" : "Daftar di sini"}
          </span>
        </div>
      </div>
    </div>
  );
}