import { useState, useEffect } from "react";
import { userAPI, authAPI } from "../services/api";

const formatDate = (dateString) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) { return "N/A"; }
};

const styles = {
  container: { 
    minHeight: "100vh",
    background: "var(--bg-page)", // Berubah otomatis
    padding: "clamp(20px, 3vw, 40px)",
    fontFamily: "'Inter', sans-serif",
    transition: "background 0.3s ease"
  },
  content: { maxWidth: "1200px", margin: "0 auto" },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-end", 
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "15px"
  },
  title: { fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "900", margin: 0, color: "var(--text-title)", letterSpacing: "-1px" },
  statsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "clamp(15px, 2vw, 20px)", 
    marginBottom: "30px" 
  },
  statCard: {
    background: "var(--bg-card)", // Berubah otomatis
    padding: "clamp(15px, 2vw, 25px)",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    border: "1px solid var(--border-color)"
  },
  filterBar: { 
    display: "flex", 
    gap: "clamp(10px, 2vw, 15px)", 
    marginBottom: "30px", 
    padding: "clamp(12px, 2vw, 15px)", 
    background: "var(--bg-card)", 
    borderRadius: "18px", 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid var(--border-color)",
    flexWrap: "wrap"
  },
  input: { 
    background: "var(--bg-page)", 
    border: "1px solid var(--border-color)", 
    padding: "clamp(10px, 1.5vw, 12px) clamp(12px, 2vw, 20px)", 
    borderRadius: "12px", 
    color: "var(--text-title)", 
    flex: "1 1 auto",
    minWidth: "150px",
    outline: "none",
    fontSize: "14px"
  },
  select: { 
    background: "var(--bg-page)", 
    border: "1px solid var(--border-color)", 
    padding: "clamp(10px, 1.5vw, 12px)", 
    borderRadius: "12px", 
    color: "var(--text-title)", 
    flex: "1 1 auto",
    minWidth: "100px",
    cursor: "pointer",
    outline: "none"
  },
  tableWrapper: { 
    background: "var(--bg-card)", 
    borderRadius: "24px", 
    overflow: "auto", 
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid var(--border-color)"
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  th: { 
    padding: "clamp(12px, 2vw, 20px)", 
    background: "var(--bg-page)", 
    color: "var(--text-main)", 
    textAlign: "left", 
    fontSize: "12px", 
    fontWeight: "800", 
    textTransform: "uppercase", 
    whiteSpace: "nowrap",
    opacity: 0.8
  },
  td: { 
    padding: "clamp(12px, 2vw, 20px)", 
    borderBottom: "1px solid var(--border-color)", 
    fontSize: "14px", 
    color: "var(--text-title)" 
  },
  badge: (role) => {
    // Badge tetap menggunakan warna cerah agar mudah dibedakan di dark mode
    const configs = {
      ketua: { bg: "rgba(79, 70, 229, 0.15)", color: "#818cf8" },
      bendahara: { bg: "rgba(22, 163, 74, 0.15)", color: "#4ade80" },
      sekretaris: { bg: "rgba(234, 179, 8, 0.15)", color: "#facc15" },
      anggota: { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" }
    };
    const config = configs[role.toLowerCase()] || configs.anggota;
    return { padding: "6px 14px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", backgroundColor: config.bg, color: config.color, textTransform: "uppercase" };
  },
  createBtn: { background: "#4f46e5", color: "#fff", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: "800", cursor: "pointer" },
  
  deleteBtn: { 
    background: "none", 
    border: "none", 
    color: "#ef4444", 
    fontWeight: "700", 
    cursor: "pointer", 
    fontSize: "13px",
    padding: "5px 10px",
    borderRadius: "8px",
    transition: "background 0.2s"
  },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, backdropFilter: "blur(8px)" },
  modalContent: { 
    background: "var(--bg-card)", 
    padding: "40px", 
    borderRadius: "24px", 
    width: "100%", 
    maxWidth: "450px",
    border: "1px solid var(--border-color)",
    color: "var(--text-title)"
  }
};

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [formData, setFormData] = useState({ email: "", full_name: "", password: "", role: "anggota" });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (userId, name) => {
    if (window.confirm(`Hapus akses untuk ${name}? Tindakan ini tidak bisa dibatalkan.`)) {
      try {
        await userAPI.deleteUser(userId);
        alert("User berhasil dihapus.");
        loadUsers();
      } catch (err) {
        alert("Gagal menghapus user: " + err.message);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData.email, formData.password, formData.full_name, formData.role);
      alert("Member Berhasil Didaftarkan!");
      setShowModal(false);
      setFormData({ email: "", full_name: "", password: "", role: "anggota" });
      loadUsers();
    } catch (err) { alert("Gagal: " + err.message); }
  };

  const filteredUsers = users.filter((u) => {
    const nameMatch = u.full_name.toLowerCase().includes(searchName.toLowerCase());
    const roleMatch = filterRole === "all" || u.role.toLowerCase() === filterRole.toLowerCase();
    return nameMatch && roleMatch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h2 style={{ 
              ...styles.title, 
              margin: 0, 
              padding: 0,
              lineHeight: '1.2',
              transform: 'translateX(-2px)',
            }}>
              User Management
            </h2>
            <p style={{ 
              color: "var(--text-main)", 
              fontSize: "14px", 
              margin: 0,
              padding: 0,
              marginTop: '4px',
              lineHeight: '1',
              opacity: 0.7
            }}>
              Kelola hak akses anggota SIKASI.
            </p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowModal(true)}>+ Add New User</button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ color: "var(--text-main)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", opacity: 0.6 }}>Registered Users</div>
            <div style={{ fontSize: "32px", fontWeight: "900", marginTop: "5px", color: "var(--text-title)" }}>{users.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ color: "var(--text-main)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", opacity: 0.6 }}>Master Admin</div>
            <div style={{ fontSize: "32px", fontWeight: "900", marginTop: "5px", color: "#f97316" }}>{users.filter(u => u.role === 'ketua').length}</div>
          </div>
        </div>

        <div style={styles.filterBar}>
          <input style={styles.input} placeholder="🔍 Cari nama..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          <select style={styles.select} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Semua Jabatan</option>
            <option value="ketua">Ketua</option>
            <option value="bendahara">Bendahara</option>
            <option value="sekretaris">Sekretaris</option>
            <option value="anggota">Anggota</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Member Identity</th>
                <th style={styles.th}>Position</th>
                <th style={styles.th}>Created Date</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "800", color: "var(--text-title)", fontSize: "15px" }}>{u.full_name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-main)", opacity: 0.7 }}>{u.email}</div>
                  </td>
                  <td style={styles.td}><span style={styles.badge(u.role)}>{u.role}</span></td>
                  <td style={styles.td}><span style={{color: "var(--text-main)", opacity: 0.8}}>{formatDate(u.created_at)}</span></td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    {u.role !== 'ketua' ? (
                      <button 
                        style={styles.deleteBtn} 
                        onClick={() => handleDelete(u.id, u.full_name)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span style={{ fontSize: "10px", color: "var(--text-main)", fontWeight: "800", opacity: 0.5 }}>PROTECTED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: "24px", fontWeight: "900", color: "var(--text-title)", marginBottom: "20px" }}>Add New User</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-main)", display: "block", marginBottom: "8px", fontWeight: "700" }}>Full Name</label>
                <input style={{...styles.input, width: "100%", boxSizing: "border-box"}} type="text" required onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-main)", display: "block", marginBottom: "8px", fontWeight: "700" }}>Email Address</label>
                <input style={{...styles.input, width: "100%", boxSizing: "border-box"}} type="email" required onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-main)", display: "block", marginBottom: "8px", fontWeight: "700" }}>Password</label>
                <input style={{...styles.input, width: "100%", boxSizing: "border-box"}} type="password" required onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div style={{ marginBottom: "30px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-main)", display: "block", marginBottom: "8px", fontWeight: "700" }}>Assign Role</label>
                <select style={{...styles.select, width: "100%"}} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="anggota">Anggota</option>
                  <option value="sekretaris">Sekretaris</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="ketua">Ketua</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" style={{ ...styles.createBtn, flex: 1 }}>Confirm</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: "var(--bg-page)", color: "var(--text-main)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "12px", flex: 1, fontWeight: "700", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;