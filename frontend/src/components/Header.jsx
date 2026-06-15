import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const styles = {
  header: {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    padding: "12px 0",
    transition: "all 0.3s ease",
  },

  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "0 clamp(15px, 5vw, 30px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
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
    padding: "6px",
    borderRadius: "14px",
  },

  navBtn: (isActive, darkMode) => ({
    backgroundColor: isActive
      ? "rgba(56, 189, 248, 0.15)"
      : "transparent",
    color: isActive
      ? "#38bdf8"
      : darkMode
      ? "#cbd5e1"
      : "#334155",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s ease",
  }),

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  userDetails: {
    textAlign: "right",
    paddingRight: "18px",
  },

  userName: {
    fontSize: "13px",
    fontWeight: "700",
    display: "block",
  },

  userRole: {
    fontSize: "10px",
    color: "#38bdf8",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    padding: "8px 16px",
    borderRadius: "10px",
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(4px)",
  },

  modalContent: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "16px",
    padding: "25px 20px",
    maxWidth: "320px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    border: "1px solid var(--border-color)"
  },

  modalTitle: {
    fontSize: "18px",
    fontWeight: "900",
    color: "var(--text-title)",
    marginBottom: "8px",
  },

  modalMessage: {
    fontSize: "13px",
    color: "var(--text-main)",
    opacity: 0.8,
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },

  cancelBtn: {
    backgroundColor: "var(--bg-page)",
    color: "var(--text-main)",
    border: "2px solid var(--border-color)",
    padding: "9px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
  },

  confirmBtn: {
    color: "white",
    border: "none",
    padding: "9px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
};

export default function Header({ user, setUser, darkMode, setDarkMode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const rolesAllowedAccess = [
    "ketua",
    "bendahara",
    "sekretaris",
    "anggota",
  ];

  const canAccessFinance = rolesAllowedAccess.includes(user?.role);
  const canAccessLetters = rolesAllowedAccess.includes(user?.role);
  const canAccessAdmin = user?.role === "ketua";

  return (
    <header
      style={{
        ...styles.header,
        background: darkMode
          ? "rgba(2, 6, 23, 0.85)"
          : "rgba(255, 255, 255, 0.9)",
        borderBottom: darkMode
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1
            style={{
              ...styles.logo,
              filter: darkMode ? "brightness(1.2)" : "none",
            }}
            onClick={() => navigate("/dashboard")}
          >
            SIKASIIII
          </h1>

          {user && (
            <nav
              style={{
                ...styles.nav,
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(15,23,42,0.05)",
              }}
            >
              <button
                style={styles.navBtn(isActive("/dashboard"), darkMode)}
                onClick={() => navigate("/dashboard")}
              >
                🏠 Dashboard
              </button>

              {canAccessFinance && (
                <button
                  style={styles.navBtn(isActive("/finance"), darkMode)}
                  onClick={() => navigate("/finance")}
                >
                  💰 Finance
                </button>
              )}

              {canAccessLetters && (
                <button
                  style={styles.navBtn(isActive("/letters"), darkMode)}
                  onClick={() => navigate("/letters")}
                >
                  📝 Letters
                </button>
              )}

              {canAccessAdmin && (
                <button
                  style={styles.navBtn(isActive("/admin"), darkMode)}
                  onClick={() => navigate("/admin")}
                >
                  🛡️ Admin
                </button>
              )}
            </nav>
          )}
        </div>

        {user && (
          <div style={styles.userInfo}>
            <DarkModeToggle />

            <div
              style={{
                ...styles.userDetails,
                borderRight: darkMode
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <span
                style={{
                  ...styles.userName,
                  color: darkMode ? "#f8fafc" : "#0f172a",
                }}
              >
                {user.full_name}
              </span>

              <span style={styles.userRole}>{user.role}</span>
            </div>

            <button
              onClick={handleLogoutClick}
              style={styles.logoutBtn}
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div style={styles.modalOverlay} onClick={handleCancelLogout}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalTitle}>
              Apakah Anda Yakin Ingin Logout?
            </h2>

            <p style={styles.modalMessage}>
              Anda akan diarahkan ke halaman Login dan sesi Anda akan berakhir.
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