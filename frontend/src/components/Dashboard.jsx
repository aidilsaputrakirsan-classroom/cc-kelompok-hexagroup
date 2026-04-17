import { useNavigate } from "react-router-dom";

const styles = {
  // --- CONTAINER UTAMA ---
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center",
    padding: "clamp(3vh, 5vh, 10vh) clamp(3vw, 5vw, 10vw)",
    boxSizing: "border-box",
  },
  
  header: {
    textAlign: "center",
    marginBottom: "clamp(3vh, 5vh, 8vh)",
    width: "100%",
  },

  roleBadge: {
    display: "inline-block",
    padding: "0.5rem 1.5rem",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#38bdf8",
    fontSize: "0.9rem",
    fontWeight: "800",
    textTransform: "uppercase",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    marginBottom: "1.5rem",
  },

  title: {
    fontSize: "clamp(1.5rem, 4vw, 3rem)", 
    fontWeight: "900",
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
    letterSpacing: "-0.05em",
    lineHeight: "1.4",
    maxWidth: "100%",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },

  subtitle: {
    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
    color: "#94a3b8",
    margin: "0",
  },

  // --- GRID FLEXIBLE: OTOMATIS RATA TENGAH ---
  menuGrid: {
    display: "flex",           
    flexWrap: "wrap",          
    justifyContent: "center",  
    gap: "clamp(1.5rem, 3vw, 2.5rem)",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // --- CARD PREMIUM ---
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: "32px",
    padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    width: "clamp(280px, 90vw, 350px)",
    minHeight: "450px",
    boxSizing: "border-box",
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
  },

  cardTitle: {
    fontSize: "1.7rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "1rem",
  },

  cardDescription: {
    fontSize: "1.05rem",
    lineHeight: "1.6",
    color: "#64748b",
    marginBottom: "2rem",
  },

  btnAction: {
    marginTop: "auto",
    padding: "0.9rem 1.5rem",
    borderRadius: "14px",
    backgroundColor: "#f1f5f9",
    color: "#4f46e5",
    fontWeight: "700",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    border: "none",
    width: "100%",
    cursor: "pointer",
  },

  disabled: {
    opacity: 0.4,
    filter: "grayscale(100%)",
    cursor: "not-allowed",
  }
};

function Dashboard({ user }) {
  const navigate = useNavigate();

  // Logika Akses Baru: Anggota, Sekre, Bendahara, Ketua semua bisa masuk ke Finance & Letters
  const allowedRoles = ["ketua", "sekretaris", "bendahara", "anggota"];
  
  const canAccessFinance = allowedRoles.includes(user.role);
  const canAccessLetters = allowedRoles.includes(user.role);
  const canAccessAdmin = user.role === "ketua";

  const onHover = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(-15px) scale(1.02)";
      e.currentTarget.style.boxShadow = "0 40px 60px rgba(56, 189, 248, 0.2)";
      const btn = e.currentTarget.querySelector(".action-btn");
      if (btn) {
        btn.style.backgroundColor = "#4f46e5";
        btn.style.color = "#ffffff";
      }
    }
  };

  const onLeave = (e, accessible) => {
    if (accessible) {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = styles.menuCard.boxShadow;
      const btn = e.currentTarget.querySelector(".action-btn");
      if (btn) {
        btn.style.backgroundColor = "#f1f5f9";
        btn.style.color = "#4f46e5";
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.roleBadge}>👑 {user.role.toUpperCase()} Access</div>
        <h1 style={styles.title}>SISTEM INFORMASI KEUANGAN DAN ADMINISTRASI HMSI ITK</h1>
        <p style={styles.subtitle}>Selamat Datang, <b>{user.full_name}</b></p>
      </header>

      <div style={styles.menuGrid}>
        {/* Modul Finance */}
        <div
          style={{ ...styles.menuCard, ...(!canAccessFinance && styles.disabled) }}
          onMouseEnter={(e) => onHover(e, canAccessFinance)}
          onMouseLeave={(e) => onLeave(e, canAccessFinance)}
          onClick={() => canAccessFinance && navigate("/finance")}
        >
          <div style={{ ...styles.iconBox, backgroundColor: "#dcfce7" }}>💰</div>
          <div style={styles.cardTitle}>Finance</div>
          <div style={styles.cardDescription}>Manajemen anggaran, pemasukan, dan laporan keuangan organisasi.</div>
          {canAccessFinance && <button className="action-btn" style={styles.btnAction}>Masuk Modul →</button>}
        </div>

        {/* Modul Letters */}
        <div
          style={{ ...styles.menuCard, ...(!canAccessLetters && styles.disabled) }}
          onMouseEnter={(e) => onHover(e, canAccessLetters)}
          onMouseLeave={(e) => onLeave(e, canAccessLetters)}
          onClick={() => canAccessLetters && navigate("/letters")}
        >
          <div style={{ ...styles.iconBox, backgroundColor: "#e0e7ff" }}>📝</div>
          <div style={styles.cardTitle}>Letters</div>
          <div style={styles.cardDescription}>Pengelolaan surat menyurat, nomor surat, dan arsip digital.</div>
          {canAccessLetters && <button className="action-btn" style={styles.btnAction}>Masuk Modul →</button>}
        </div>

        {/* Modul Admin (Hanya muncul untuk Ketua) */}
        {canAccessAdmin && (
          <div
            className="admin-card"
            style={styles.menuCard}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onLeave(e, true)}
            onClick={() => navigate("/admin")}
          >
            <div style={{ ...styles.iconBox, backgroundColor: "#fffbeb" }}>👥</div>
            <div style={styles.cardTitle}>Admin Panel</div>
            <div style={styles.cardDescription}>Kontrol hak akses anggota, tambah user, dan konfigurasi sistem.</div>
            <button className="action-btn" style={styles.btnAction}>Masuk Modul →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;