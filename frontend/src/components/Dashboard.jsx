import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "clamp(20px, 5vw, 60px) 20px",
    boxSizing: "border-box",
    background: "var(--bg-page)",
    transition: "background 0.3s ease",
  },

  header: {
    textAlign: "center",
    marginBottom: "clamp(30px, 8vh, 60px)",
    width: "100%",
  },

  roleBadge: {
    display: "inline-block",
    padding: "0.5rem 1.5rem",
    borderRadius: "12px",
    color: "#0284c7",
    fontSize: "0.9rem",
    fontWeight: "800",
    textTransform: "uppercase",
    border: "2px solid transparent",
    marginBottom: "1.5rem",
    backgroundColor: "var(--bg-card)",
    backgroundImage: `linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, #0284c7, #0ea5e9)`,
    backgroundOrigin: "border-box, border-box",
    backgroundClip: "padding-box, border-box",
  },

  title: {
    fontSize: "clamp(1.5rem, 4vw, 3rem)",
    fontWeight: "900",
    background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 0.5rem 0",
  },

  subtitle: {
  fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
  color: "var(--text-secondary)",
  margin: "0",
},

  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
    width: "100%",
    maxWidth: "1400px",
  },

  menuCard: {
    borderRadius: "32px",
    padding: "40px 30px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    minHeight: "450px",
    border: "2px solid transparent",
    backgroundColor: "var(--bg-card)",
    backgroundImage: `linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, #0284c7, #0ea5e9)`,
    backgroundOrigin: "border-box, border-box",
    backgroundClip: "padding-box, border-box",
  },

  iconBox: {
  width: "80px",
  height: "80px",
  borderRadius: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "36px",
  marginBottom: "2rem",
  backgroundColor: "var(--bg-page)",
},

btnAction: {
  marginTop: "auto",
  padding: "0.9rem 1.5rem",
  borderRadius: "14px",
  backgroundColor: "var(--bg-page)",
  color: "var(--text-color)",
  fontWeight: "700",
  width: "100%",
  border: "1px solid var(--border-color)",
  cursor: "pointer",
  transition: "all 0.3s ease",
},

cardTitle: {
  color: "var(--text-color)",
  fontWeight: "700",
  marginBottom: "12px",
},

cardDescription: {
  color: "var(--text-secondary)",
  marginBottom: "24px",
},

disabled: {
  opacity: 0.4,
  filter: "grayscale(100%)",
  cursor: "not-allowed",
},
};

function Dashboard({ user }) {
  const navigate = useNavigate();

  // STATE
const [serviceUnavailable, setServiceUnavailable] = useState(false);
const [authDown, setAuthDown] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [loading, setLoading] = useState(true);
const [isRetrying, setIsRetrying] = useState(false);
const [apiConnected, setApiConnected] = useState(false);

const onButtonHover = (e) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  e.currentTarget.style.backgroundColor = "var(--bg-card)";
};

const onButtonLeave = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
  e.currentTarget.style.backgroundColor = "var(--bg-page)";
};

  // API CALL
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setServiceUnavailable(false);
      setAuthDown(false);
      setErrorMessage("");

      const apiUrl = `${import.meta.env.VITE_API_URL}/health`;
      
      await axios.get(apiUrl);

      setApiConnected(true);

    } catch (error) {

    setApiConnected(false);

    const status = error.response?.status;

      if (status === 503 || status === 502) {
        const errorData = error.response?.data;
        if (
          errorData?.detail?.includes("auth") ||
          error.config?.url?.includes("auth") ||
          errorData?.message?.includes("Authentication")
        ) {
          setAuthDown(true);
          setErrorMessage("Authentication service is temporarily unavailable");
        } else {
          setServiceUnavailable(true);
          setErrorMessage("Service temporarily unavailable. Please try again later.");
        }
      } else if (status === 500) {
        setServiceUnavailable(true);
        setErrorMessage("Server error occurred. Please try again.");
      } else if (!error.response) {
        setServiceUnavailable(true);
        setErrorMessage("Unable to connect to server. Check your connection.");
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
  fetchDashboard();
}, []);

  const retryConnection = () => {
    setIsRetrying(true);
    fetchDashboard();
  };

 // 1. Hak Akses Melihat Modul (View Access)
  const canAccessFinance = ["ketua", "sekretaris", "bendahara", "anggota"].includes(currentRole);
  const canAccessLetters = ["ketua", "sekretaris", "bendahara", "anggota"].includes(currentRole);
  const canAccessAdmin = currentRole === "ketua";

  // 2. Hak Akses Mengelola Data (CRUD Access)
  const canCrudFinance = currentRole === "bendahara";
  const canCrudLetters = currentRole === "sekretaris";
  const canCrudAdmin = currentRole === "ketua";

  const onHover = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
      e.currentTarget.style.boxShadow = "0 20px 40px rgba(2,132,199,0.25)";
    }
  };

  const onLeave = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-color)", fontSize: "18px", fontWeight: "600" }}>
        ⏳ Loading Dashboard...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* AUTH DOWN BANNER */}
      {authDown && (
        <div style={{ width: "100%", maxWidth: "1400px", backgroundColor: "#fee2e2", color: "#991b1b", padding: "16px 20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #fca5a5", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600" }}>
          <div>🔒 Some features temporarily unavailable</div>
          <button onClick={retryConnection} disabled={isRetrying} style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "#dc2626", color: "white", fontWeight: "700", cursor: isRetrying ? "not-allowed" : "pointer", opacity: isRetrying ? 0.6 : 1 }}>
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {/* SERVICE UNAVAILABLE BANNER (503) */}
      {serviceUnavailable && !authDown && (
        <div style={{ width: "100%", maxWidth: "1400px", backgroundColor: "#fef3c7", color: "#92400e", padding: "16px 20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #facc15", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontWeight: "600" }}>⚠️ {errorMessage}</div>
          </div>
          <button onClick={retryConnection} disabled={isRetrying} style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "#0284c7", color: "white", fontWeight: "700", cursor: isRetrying ? "not-allowed" : "pointer", opacity: isRetrying ? 0.6 : 1 }}>
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <header style={styles.header}>
        {/* INDIKATOR ONLINE SANGAT ATAS & TENGAH */}
        <div style={styles.roleBadge}>
          👑 {user.role.toUpperCase()} Access
        </div>
        <h1 style={styles.title}>SISTEM INFORMASI HMSI ITK</h1>
        <p style={styles.subtitle}>Selamat Datang, <b>{user.full_name}</b></p>
      </header>

      <div style={styles.menuGrid}>
        
        {/* MODUL FINANCE */}
        <div
          style={{ ...styles.menuCard, ...(!canAccessFinance && styles.disabled) }}
          onClick={() => canAccessFinance && navigate("/finance", { state: { canCrud: canCrudFinance } })}
          onMouseEnter={(e) => onHover(e, canAccessFinance)}
          onMouseLeave={(e) => onLeave(e, canAccessFinance)}
        >
          <div style={styles.iconBox}>💰</div>
          <h2 style={styles.cardTitle}>Finance</h2>
          <p style={styles.cardDescription}>
            {canCrudFinance ? "Manajemen & pengelolaan data keuangan" : "Melihat laporan data keuangan"}
          </p>
          {canAccessFinance && (
            <button style={styles.btnAction} onMouseEnter={onButtonHover} onMouseLeave={onButtonLeave}>
              Masuk Modul →
            </button>
          )}
        </div>

        {/* MODUL LETTERS */}
        <div
          style={{ ...styles.menuCard, ...(!canAccessLetters && styles.disabled) }}
          onClick={() => canAccessLetters && navigate("/letters", { state: { canCrud: canCrudLetters } })}
          onMouseEnter={(e) => onHover(e, canAccessLetters)}
          onMouseLeave={(e) => onLeave(e, canAccessLetters)}
        >
          <div style={styles.iconBox}>📝</div>
          <h2 style={styles.cardTitle}>Letters</h2>
          <p style={styles.cardDescription}>
            {canCrudLetters ? "Manajemen & pengelolaan surat menyurat" : "Melihat arsip surat menyurat"}
          </p>
          {canAccessLetters && (
            <button style={styles.btnAction} onMouseEnter={onButtonHover} onMouseLeave={onButtonLeave}>
              Masuk Modul →
            </button>
          )}
        </div>

        {/* MODUL ADMIN PANEL */}
        {canAccessAdmin && (
          <div
            style={styles.menuCard}
            onClick={() => navigate("/admin", { state: { canCrud: canCrudAdmin } })}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onLeave(e, true)}
          >
            <div style={styles.iconBox}>👥</div>
            <h2 style={styles.cardTitle}>Admin Panel</h2>
            <p style={styles.cardDescription}>Manajemen user & kontrol penuh hak akses</p>
            <button style={styles.btnAction} onMouseEnter={onButtonHover} onMouseLeave={onButtonLeave}>
              Masuk Modul →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;




  

      