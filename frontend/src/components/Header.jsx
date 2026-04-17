import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = {
  header: {
    background: "rgba(15, 23, 42, 0.8)", // Dark slate premium
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
    "@media (maxWidth: 768px)": {
      flexDirection: "column",
      gap: "10px",
    }
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
    color: "#fff",
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "6px",
    borderRadius: "14px",
  },
  navBtn: (isActive) => ({
    backgroundColor: isActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
    color: isActive ? "#38bdf8" : "#94a3b8",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  userDetails: {
    textAlign: "right",
    paddingRight: "18px",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  },
  userName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#f8fafc",
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
    border: "1px solid rgba(239, 68, 68, 0.1)",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    transition: "all 0.3s ease",
  },
  // Modal Styles
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
    animation: "fadeIn 0.3s ease",
    minHeight: "100vh",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px 20px",
    maxWidth: "320px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    animation: "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "center",
  },
  modalIcon: {
    fontSize: "45px",
    marginBottom: "0px",
    display: "none",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "900",
    color: "#1f2937",
    marginBottom: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  modalMessage: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "20px",
    lineHeight: "1.5",
    fontFamily: "'Inter', sans-serif",
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "2px solid #e5e7eb",
    padding: "9px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
  },
  confirmBtn: {
    backgroundColor: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    padding: "9px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
};

// Add CSS animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(30px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `;
  document.head.appendChild(style);
}

export default function Header({ user, setUser }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    setUser(null);
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActive = (path) => location.pathname === path;

  // Logika akses yang konsisten dengan Dashboard & FinancePage
  const rolesAllowedAccess = ["ketua", "bendahara", "sekretaris", "anggota"];
  
  const canAccessFinance = rolesAllowedAccess.includes(user?.role);
  const canAccessLetters = rolesAllowedAccess.includes(user?.role);
  const canAccessAdmin = user?.role === "ketua";

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1 style={styles.logo} onClick={() => navigate("/dashboard")}>
            SIKASI
          </h1>
          
          {user && (
            <nav style={styles.nav}>
              <button
                style={styles.navBtn(isActive("/dashboard"))}
                onClick={() => navigate("/dashboard")}
              >
                🏠 Dashboard
              </button>
              
              {canAccessFinance && (
                <button
                  style={styles.navBtn(isActive("/finance"))}
                  onClick={() => navigate("/finance")}
                >
                  💰 Finance
                </button>
              )}
              
              {canAccessLetters && (
                <button
                  style={styles.navBtn(isActive("/letters"))}
                  onClick={() => navigate("/letters")}
                >
                  📝 Letters
                </button>
              )}
              
              {canAccessAdmin && (
                <button
                  style={styles.navBtn(isActive("/admin"))}
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
            <div style={styles.userDetails}>
              <span style={styles.userName}>{user.full_name}</span>
              <span style={styles.userRole}>{user.role}</span>
            </div>
            <button 
              onClick={handleLogoutClick} 
              style={styles.logoutBtn}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#ef4444";
                e.target.style.color = "white";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                e.target.style.color = "#ef4444";
                e.target.style.transform = "scale(1)";
              }}
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div style={styles.modalOverlay} onClick={handleCancelLogout}>
          <div 
            style={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalTitle}>Apakah Anda Yakin Ingin Logout?</h2>
            <p style={styles.modalMessage}>
              Anda akan diarahkan ke halaman Login dan sesi Anda akan berakhir.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={handleCancelLogout}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#e5e7eb";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                ❌ Batal
              </button>
              <button
                style={styles.confirmBtn}
                onClick={handleConfirmLogout}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(239, 68, 68, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                ✓ Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}