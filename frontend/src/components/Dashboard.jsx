import { useNavigate } from "react-router-dom";
<<<<<<< feature/error-handling-ui
import { useState, useEffect } from "react";
import axios from "axios";
=======
import { useState } from "react";
>>>>>>> main

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
    color: "#0284c7",
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
    color: "#4f46e5",
    fontWeight: "700",
    width: "100%",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
  },

  disabled: {
    opacity: 0.4,
    filter: "grayscale(100%)",
    cursor: "not-allowed",
  },
};

function Dashboard({ user }) {
  const navigate = useNavigate();

<<<<<<< feature/error-handling-ui
  // =======================
  // STATE (FIX TASK)
  // =======================
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [authDown, setAuthDown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  // =======================
  // API CALL (IMPORTANT FIX)
  // =======================
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setServiceUnavailable(false);
      setAuthDown(false);
      setErrorMessage("");

      // Via gateway (port 80) atau langsung backend (port 8000)
      const apiUrl = window.location.origin.includes('3000') 
        ? "http://localhost:8000/health"
        : "http://localhost/health";
      
      await axios.get(apiUrl); 
      // Docker backend (ubah kalau port kamu beda)

    } catch (error) {
      const status = error.response?.status;

      if (status === 503 || status === 502) {
        // Cek apakah error dari auth service
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

  // auto fetch
  useEffect(() => {
    fetchDashboard();
  }, []);

  // retry FIX
  const retryConnection = () => {
    setIsRetrying(true);
    fetchDashboard();
  };

  // role access
=======
  // SERVICE UNAVAILABLE HANDLER
  const [serviceUnavailable, setServiceUnavailable] = useState(false);

  const retryConnection = () => {
    setServiceUnavailable(false);

    // simulasi retry API
    setTimeout(() => {
      alert("Retrying connection...");
    }, 500);
  };

  // UBAH KE TRUE UNTUK TESTING
  // const [serviceUnavailable, setServiceUnavailable] = useState(true);

>>>>>>> main
  const allowedRoles = ["ketua", "sekretaris", "bendahara", "anggota"];
  const canAccessFinance = allowedRoles.includes(user.role);
  const canAccessLetters = allowedRoles.includes(user.role);
  const canAccessAdmin = user.role === "ketua";

  const onHover = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(-15px) scale(1.02)";
<<<<<<< feature/error-handling-ui
=======
      e.currentTarget.style.boxShadow =
        "0 40px 60px rgba(56, 189, 248, 0.2)";
>>>>>>> main
    }
  };

  const onLeave = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(0)";
    }
  };

  // =======================
  // LOADING STATE
  // =======================
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
<<<<<<< feature/error-handling-ui

      {/* =======================
          AUTH DOWN BANNER
      ======================= */}
      {authDown && (
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "16px 20px",
            borderRadius: "16px",
            marginBottom: "24px",
            border: "1px solid #fca5a5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "600",
          }}
        >
          <div>🔒 Some features temporarily unavailable</div>

          <button
            onClick={retryConnection}
            disabled={isRetrying}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#dc2626",
              color: "white",
              fontWeight: "700",
              cursor: isRetrying ? "not-allowed" : "pointer",
              opacity: isRetrying ? 0.6 : 1,
            }}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {/* =========================================
          SERVICE UNAVAILABLE BANNER (502/503 ERROR)
      ============================================= */}
      {serviceUnavailable && !authDown && (
=======
      {serviceUnavailable && (
>>>>>>> main
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            backgroundColor: "#fef3c7",
            color: "#92400e",
            padding: "16px 20px",
            borderRadius: "16px",
            marginBottom: "24px",
            border: "1px solid #facc15",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
<<<<<<< feature/error-handling-ui
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontWeight: "600" }}>⚠️ {errorMessage}</div>
=======
            gap: "20px",
            flexWrap: "wrap",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            ⚠️ Some features temporarily unavailable
>>>>>>> main
          </div>

          <button
            onClick={retryConnection}
<<<<<<< feature/error-handling-ui
            disabled={isRetrying}
=======
>>>>>>> main
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#0284c7",
              color: "white",
              fontWeight: "700",
<<<<<<< feature/error-handling-ui
              cursor: isRetrying ? "not-allowed" : "pointer",
              opacity: isRetrying ? 0.6 : 1,
            }}
          >
            {isRetrying ? "Retrying..." : "Retry"}
=======
              cursor: "pointer",
            }}
          >
            Retry
>>>>>>> main
          </button>
        </div>
      )}

<<<<<<< feature/error-handling-ui
      {/* HEADER */}
=======
>>>>>>> main
      <header style={styles.header}>
        <div style={styles.roleBadge}>
          👑 {user.role.toUpperCase()} Access
        </div>

        <h1 style={styles.title}>SISTEM INFORMASI HMSI ITK</h1>

        <p style={styles.subtitle}>
          Selamat Datang, <b>{user.full_name}</b>
        </p>
      </header>

      {/* MENU */}
      <div style={styles.menuGrid}>

        <div
          style={{
            ...styles.menuCard,
            ...(!canAccessFinance && styles.disabled),
          }}
<<<<<<< feature/error-handling-ui
          onClick={() => canAccessFinance && navigate("/finance")}
        >
          <div style={styles.iconBox}>💰</div>
          <h2>Finance</h2>
          <p>Manajemen keuangan organisasi</p>

          {canAccessFinance && (
            <button style={styles.btnAction}>Masuk Modul →</button>
=======
          onMouseEnter={(e) => onHover(e, canAccessFinance)}
          onMouseLeave={(e) => onLeave(e, canAccessFinance)}
          onClick={() => canAccessFinance && navigate("/finance")}
        >
          <div style={styles.iconBox}>💰</div>

          <div style={styles.cardTitle}>Finance</div>

          <div style={styles.cardDescription}>
            Manajemen anggaran, pemasukan, dan laporan keuangan organisasi.
          </div>

          {canAccessFinance && (
            <button className="action-btn" style={styles.btnAction}>
              Masuk Modul →
            </button>
>>>>>>> main
          )}
        </div>

        <div
          style={{
            ...styles.menuCard,
            ...(!canAccessLetters && styles.disabled),
          }}
<<<<<<< feature/error-handling-ui
          onClick={() => canAccessLetters && navigate("/letters")}
        >
          <div style={styles.iconBox}>📝</div>
          <h2>Letters</h2>
          <p>Manajemen surat menyurat</p>

          {canAccessLetters && (
            <button style={styles.btnAction}>Masuk Modul →</button>
=======
          onMouseEnter={(e) => onHover(e, canAccessLetters)}
          onMouseLeave={(e) => onLeave(e, canAccessLetters)}
          onClick={() => canAccessLetters && navigate("/letters")}
        >
          <div style={styles.iconBox}>📝</div>

          <div style={styles.cardTitle}>Letters</div>

          <div style={styles.cardDescription}>
            Pengelolaan surat menyurat, nomor surat, dan arsip digital.
          </div>

          {canAccessLetters && (
            <button className="action-btn" style={styles.btnAction}>
              Masuk Modul →
            </button>
>>>>>>> main
          )}
        </div>

        {canAccessAdmin && (
          <div
            style={styles.menuCard}
            onClick={() => navigate("/admin")}
          >
            <div style={styles.iconBox}>👥</div>
<<<<<<< feature/error-handling-ui
            <h2>Admin Panel</h2>
            <p>Manajemen user & akses</p>

            <button style={styles.btnAction}>Masuk Modul →</button>
=======

            <div style={styles.cardTitle}>Admin Panel</div>

            <div style={styles.cardDescription}>
              Kontrol hak akses anggota, tambah user, dan konfigurasi sistem.
            </div>

            <button className="action-btn" style={styles.btnAction}>
              Masuk Modul →
            </button>
>>>>>>> main
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;