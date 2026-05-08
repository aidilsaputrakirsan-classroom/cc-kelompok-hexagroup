import { useNavigate } from "react-router-dom";

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
    letterSpacing: "-0.05em",
    lineHeight: "1.2",
    width: "100%",
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
    margin: "0 auto",
    boxSizing: "border-box",
  },

  menuCard: {
    borderRadius: "32px",
    padding: "40px 30px",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    minHeight: "450px",
    boxSizing: "border-box",
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

  cardTitle: {
    fontSize: "1.7rem",
    fontWeight: "800",
    marginBottom: "1rem",
    color: "var(--text-title)",
  },

  cardDescription: {
    fontSize: "1.05rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
    color: "var(--text-main)",
  },

  btnAction: {
    marginTop: "auto",
    padding: "0.9rem 1.5rem",
    borderRadius: "14px",
    backgroundColor: "var(--bg-page)",
    color: "#4f46e5",
    fontWeight: "700",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    border: "1px solid var(--border-color)",
    width: "100%",
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

  const allowedRoles = ["ketua", "sekretaris", "bendahara", "anggota"];
  const canAccessFinance = allowedRoles.includes(user.role);
  const canAccessLetters = allowedRoles.includes(user.role);
  const canAccessAdmin = user.role === "ketua";

  const onHover = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(-15px) scale(1.02)";
      e.currentTarget.style.boxShadow = "0 40px 60px rgba(56, 189, 248, 0.2)";
    }
  };

  const onLeave = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.roleBadge}>👑 {user.role.toUpperCase()} Access</div>
        <h1 style={styles.title}>SISTEM INFORMASI HMSI ITK</h1>
        <p style={styles.subtitle}>Selamat Datang, <b>{user.full_name}</b></p>
      </header>

      <div style={styles.menuGrid}>
        <div
          style={{ ...styles.menuCard, ...(!canAccessFinance && styles.disabled) }}
          onMouseEnter={(e) => onHover(e, canAccessFinance)}
          onMouseLeave={(e) => onLeave(e, canAccessFinance)}
          onClick={() => canAccessFinance && navigate("/finance")}
        >
          <div style={styles.iconBox}>💰</div>
          <div style={styles.cardTitle}>Finance</div>
          <div style={styles.cardDescription}>
            Manajemen anggaran, pemasukan, dan laporan keuangan organisasi.
          </div>
          {canAccessFinance && <button className="action-btn" style={styles.btnAction}>Masuk Modul →</button>}
        </div>

        <div
          style={{ ...styles.menuCard, ...(!canAccessLetters && styles.disabled) }}
          onMouseEnter={(e) => onHover(e, canAccessLetters)}
          onMouseLeave={(e) => onLeave(e, canAccessLetters)}
          onClick={() => canAccessLetters && navigate("/letters")}
        >
          <div style={styles.iconBox}>📝</div>
          <div style={styles.cardTitle}>Letters</div>
          <div style={styles.cardDescription}>
            Pengelolaan surat menyurat, nomor surat, dan arsip digital.
          </div>
          {canAccessLetters && <button className="action-btn" style={styles.btnAction}>Masuk Modul →</button>}
        </div>

        {canAccessAdmin && (
          <div
            style={styles.menuCard}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onLeave(e, true)}
            onClick={() => navigate("/admin")}
          >
            <div style={styles.iconBox}>👥</div>
            <div style={styles.cardTitle}>Admin Panel</div>
            <div style={styles.cardDescription}>
              Kontrol hak akses anggota, tambah user, dan konfigurasi sistem.
            </div>
            <button className="action-btn" style={styles.btnAction}>Masuk Modul →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;