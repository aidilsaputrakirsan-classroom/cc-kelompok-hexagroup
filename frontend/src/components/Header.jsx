import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    padding: "20px 0",
    background: "transparent", 
    border: "none",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  leftCard: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    padding: "10px 24px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },

  rightCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    padding: "10px 24px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },

  logo: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "1px",
    background: "linear-gradient(to right, #38bdf8, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  nav: {
    display: "flex",
    gap: "8px",
  },

  navBtn: (isActive) => ({
    backgroundColor: isActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
    color: isActive ? "#38bdf8" : "var(--text-main)",
    border: "none",
    padding: "8px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s ease",
  }),

  themeToggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "50px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-page)",
    color: "var(--text-main)",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "12px",
    transition: "all 0.3s ease",
  },

  userDetails: {
    textAlign: "right",
   lineHeight: "1.3",
  },

  userName: {
    fontSize: "13px",
    fontWeight: "700",
    display: "block",
    color: "var(--text-title)",
  },

  userRole: {
    fontSize: "10px",
    color: "#38bdf8",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "block",
  },

  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    padding: "8px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    transition: "all 0.3s ease",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(8px)",
  },

  modalContent: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "24px",
    padding: "35px 30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    border: "1px solid var(--border-color)"
  },

  modalTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "var(--text-title)",
    marginBottom: "12px",
  },

  modalMessage: {
    fontSize: "14px",
    color: "var(--text-main)",
    opacity: 0.8,
    marginBottom: "28px",
    lineHeight: "1.6",
  },

  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },

  cancelBtn: {
    backgroundColor: "var(--bg-page)",
    color: "var(--text-main)",
    border: "1px solid var(--border-color)",
    padding: "10px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    transition: "all 0.2s",
  },

  confirmBtn: {
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    transition: "all 0.2s",
  },
};

export default function Header({ user, setUser, apiConnected }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoHover, setLogoHover] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleConfirmLogout = () => {
    localStorage.clear();
    setUser(null);
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleCancelLogout = () => setShowLogoutModal(false);

  const isActive = (path) => location.pathname === path;

  // ===== SINKRONISASI ROLE SESUAI PERMINTAAN =====
  const currentRole = user?.role?.toLowerCase();
  
  // Semua role (ketua, sekretaris, bendahara, anggota) bisa VIEW modul ini
  const canAccessFinance = ["ketua", "sekretaris", "bendahara", "anggota"].includes(currentRole);
  const canAccessLetters = ["ketua", "sekretaris", "bendahara", "anggota"].includes(currentRole);
  
  // Hanya Ketua yang bisa melihat tombol navigasi Admin Panel
  const canAccessAdmin = currentRole === "ketua";

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        
        {/* KOTAK KIRI: LOGO & NAV */}
        <div style={styles.leftCard}>
          <h1
            style={{
              ...styles.logo,
              transform: logoHover ? "scale(1.03)" : "scale(1)",
            }}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            onClick={() => navigate("/dashboard")}
          >
            SIKASI
          </h1>

          {user && (
            <nav style={styles.nav}>
              <button
                style={styles.navBtn(isActive("/dashboard"))}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>

              {canAccessFinance && (
                <button
                  style={styles.navBtn(isActive("/finance"))}
                  onClick={() => navigate("/finance")}
                >
                  Finance
                </button>
              )}

              {canAccessLetters && (
                <button
                  style={styles.navBtn(isActive("/letters"))}
                  onClick={() => navigate("/letters")}
                >
                  Letters
                </button>
              )}

              <button
  style={styles.navBtn(isActive("/status"))}
  onClick={() => navigate("/status")}
>
  📊 Status
</button>

              {canAccessAdmin && (
                <button
                  style={styles.navBtn(isActive("/admin"))}
                  onClick={() => navigate("/admin")}
                >
                  Admin Panel
                </button>
              )}
            </nav>
          )}
        </div>

        {/* KOTAK KANAN: STATUS, LIGHT MODE, USER, LOGOUT */}
        {user && (
          <div style={styles.rightCard}>
            
            {/* 1. INDIKATOR ONLINE BULAT HIJAU BESAR */}
            <div
              title={apiConnected ? "Backend Online" : "Backend Offline"}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: apiConnected ? "#22c55e" : "#ef4444",
                boxShadow: apiConnected ? "0 0 14px #22c55e" : "0 0 14px #ef4444",
                transition: "all 0.3s ease",
              }}
            />

            {/* 2. BUTTON PIL LIGHT/DARK MODE */}
            <button onClick={toggleDarkMode} style={styles.themeToggleBtn}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: darkMode ? "#fbbf24" : "#64748b",
                }}
              />
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* 3. USER PROFILE INFO */}
            <div style={styles.userDetails}>
              <span style={styles.userName}>{user.full_name}</span>
              <span style={styles.userRole}>{user.role}</span>
            </div>

            {/* 4. BUTTON LOGOUT */}
            <button onClick={handleLogoutClick} style={styles.logoutBtn}>
              LOGOUT
            </button>
          </div>
        )}
      </div>

      {/* NOTIFIKASI LOGOUT DI TENGAH LAYAR (TIDAK MEMBELAH LAYOUT) */}
      {showLogoutModal && (
        <div style={styles.modalOverlay} onClick={handleCancelLogout}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Konfirmasi Logout</h2>
            <p style={styles.modalMessage}>
              Apakah Anda Yakin Ingin Logout? Anda akan diarahkan ke halaman Login dan sesi Anda akan berakhir.
            </p>

            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={handleCancelLogout}>
                ❌ Batal
              </button>
              <button style={styles.confirmBtn} onClick={handleConfirmLogout}>
                ✓ Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}