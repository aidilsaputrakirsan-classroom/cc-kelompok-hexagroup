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
};

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
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
              onClick={handleLogout} 
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
    </header>
  );
}