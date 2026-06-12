import { useState, useEffect } from "react";
import { userAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel({ user, showToast }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "ketua") {
      showToast("Akses ditolak! Hanya Ketua yang dapat mengakses Admin Panel.", "error");
      navigate("/dashboard");
    }
  }, [user, navigate, showToast]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); 
  const [filterRole, setFilterRole] = useState("");   

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", role: "anggota" });
  const [formErrors, setFormErrors] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const response = await userAPI.getAllUsers(0, 100);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (duration < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - duration));
      }

      setUsers(Array.isArray(response) ? response : response.users || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengambil data pengguna", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role?.toLowerCase() === "ketua") {
      fetchUsers();
    }
  }, [user]);

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilterRole("");
  };

  const filteredUsers = users.filter(u => {

    const matchesText = searchQuery.trim() === "" || 
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "" || u.role?.toLowerCase() === filterRole.toLowerCase();

    return matchesText && matchesRole;
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }
    if (!editingUser && !formData.password) {
      errors.password = "Kata sandi wajib diisi";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Kata sandi minimal harus 6 karakter";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingUser) {
        await userAPI.updateUser(editingUser.id, {
          full_name: formData.fullName,
          email: formData.email,
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {})
        });
        showToast(`Pengguna "${formData.fullName}" berhasil diperbarui!`, "success");
      } else {
        await userAPI.createUser(formData.email, formData.password, formData.fullName, formData.role);
        showToast(`Pengguna "${formData.fullName}" berhasil ditambahkan!`, "success");
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memproses data pengguna", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${targetUser.full_name}"?`)) {
      setLoading(true);
      try {
        await userAPI.deleteUser(targetUser.id);
        showToast(`Pengguna "${targetUser.full_name}" berhasil dihapus.`, "success");
        fetchUsers();
      } catch (err) {
        showToast(err.response?.data?.message || "Gagal menghapus pengguna", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (targetUser = null) => {
    if (targetUser) {
      setEditingUser(targetUser);
      setFormData({
        fullName: targetUser.full_name || "",
        email: targetUser.email || "",
        password: "", 
        role: targetUser.role?.toLowerCase() || "anggota"
      });
    } else {
      setEditingUser(null);
      setFormData({ fullName: "", email: "", password: "", role: "anggota" });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "30px 20px", paddingTop: "104px", transition: "background-color 0.3s ease" },
    wrapper: { maxWidth: "1140px", margin: "0 auto" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" },
    title: { fontSize: "28px", fontWeight: "900", color: "var(--text-title)", margin: 0 },
    addBtn: { padding: "12px 24px", borderRadius: "12px", backgroundColor: "#3b82f6", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" },
    
    filterWrapper: { display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center" },
    searchInput: { flex: "2", minWidth: "240px", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-title)", fontSize: "14px", outline: "none" },
    roleSelect: { flex: "1", minWidth: "160px", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-title)", fontSize: "14px", outline: "none", cursor: "pointer" },
    resetBtn: { padding: "12px 20px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "rgba(148, 163, 184, 0.1)", color: "var(--text-main)", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
    
    tableCard: { backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    th: { padding: "16px 20px", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-title)", fontWeight: "800", fontSize: "13px", borderBottom: "1px solid var(--border-color)", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid var(--border-color)" },
    td: { padding: "16px 20px", color: "var(--text-main)", fontSize: "14px" },
    badge: (role) => {
      let bg = "rgba(148, 163, 184, 0.1)", color = "#64748b";
      if (role === "ketua") { bg = "rgba(239, 68, 68, 0.1)"; color = "#ef4444"; }
      else if (role === "sekretaris") { bg = "rgba(59, 130, 246, 0.1)"; color = "#3b82f6"; }
      else if (role === "bendahara") { bg = "rgba(16, 185, 129, 0.1)"; color = "#10b981"; }
      return { padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", backgroundColor: bg, color, display: "inline-block" };
    },
    editActionBtn: { background: "none", border: "none", color: "#3b82f6", fontWeight: "700", cursor: "pointer", marginRight: "12px" },
    deleteActionBtn: { background: "none", border: "none", color: "#ef4444", fontWeight: "700", cursor: "pointer" },
    
    emptyStateInitial: { padding: "80px 20px", textAlign: "center", color: "var(--text-main)", fontSize: "16px", fontWeight: "600" },
    emptyStateSearch: { padding: "60px 20px", textAlign: "center", color: "#ef4444", fontSize: "15px", fontWeight: "600" },
    
    spinnerOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 11000, color: "#ffffff" },
    spinner: { width: "45px", height: "45px", border: "4px solid rgba(255,255,255,0.3)", borderTop: "4px solid #ffffff", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "15px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1050, padding: "20px" },
    modalContent: { backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-color)", width: "100%", maxWidth: "460px", padding: "30px" },
    modalTitle: { fontSize: "20px", fontWeight: "800", color: "var(--text-title)", margin: "0 0 20px 0" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" },
    label: { fontSize: "13px", fontWeight: "700", color: "var(--text-title)" },
    input: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none" },
    select: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none", cursor: "pointer" },
    errorText: { color: "#ef4444", fontSize: "12px", fontWeight: "600", marginTop: "2px" },
    modalFooter: { display: "flex", gap: "12px", marginTop: "25px" },
    cancelBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "transparent", color: "var(--text-main)", fontWeight: "700", cursor: "pointer" },
    submitBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "700", cursor: "pointer" }
  };

  if (!user || user.role?.toLowerCase() !== "ketua") return null;

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

      {/* OVERLAY LOADING SPINNER 3 DETIK */}
      {loading && (
        <div style={styles.spinnerOverlay}>
          <div style={styles.spinner}></div>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Memproses Data Organisasi...</span>
        </div>
      )}

      <div style={styles.wrapper}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Manajemen Pengguna</h1>
          <button style={styles.addBtn} onClick={() => openModal(null)}>
            ➕ Tambah Anggota Baru
          </button>
        </div>

        {}
        <div style={styles.filterWrapper}>
          <input
            type="text"
            placeholder="Ketik nama atau email..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            style={styles.roleSelect}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">Semua Jabatan</option>
            <option value="anggota">Anggota</option>
            <option value="sekretaris">Sekretaris</option>
            <option value="bendahara">Bendahara</option>
            <option value="ketua">Ketua</option>
          </select>

          {}
          {(searchQuery || filterRole) && (
            <button style={styles.resetBtn} onClick={handleResetSearch}>
              🔄 Reset Filter
            </button>
          )}
        </div>

        {}
        <div style={styles.tableCard}>
          {users.length === 0 ? (
            
            <div style={styles.emptyStateInitial}>
              📁 Tidak ada data anggota. Silakan klik tombol "Tambah Anggota Baru" untuk mengisi database organisasi.
            </div>
          ) : filteredUsers.length === 0 ? (
            
            <div style={styles.emptyStateSearch}>
              ❌ Data tidak ditemukan. Periksa kembali ketikan nama atau pilihan jabatan Anda.
            </div>
          ) : (
           
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nama Lengkap</th>
                    <th style={styles.th}>Alamat Email</th>
                    <th style={styles.th}>Jabatan / Peran</th>
                    <th style={{ ...styles.th, textAlign: "right", paddingRight: "20px" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((targetUser) => (
                    <tr key={targetUser.id} style={styles.tr}>
                      <td style={styles.td}>{targetUser.full_name}</td>
                      <td style={styles.td}>{targetUser.email}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(targetUser.role?.toLowerCase())}>
                          {targetUser.role}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: "right", paddingRight: "20px" }}>
                        <button style={styles.editActionBtn} onClick={() => openModal(targetUser)}>Edit</button>
                        <button style={styles.deleteActionBtn} onClick={() => handleDeleteUser(targetUser)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingUser ? "📝 Edit Data Pengguna" : "➕ Tambah Pengguna Baru"}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {formErrors.fullName && <div style={styles.errorText}>{formErrors.fullName}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Alamat Email</label>
                <input
                  type="email"
                  style={styles.input}
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && <div style={styles.errorText}>{formErrors.email}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Kata Sandi {editingUser && <span style={{ fontWeight: "normal", color: "#94a3b8" }}>(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder={editingUser ? "••••••••" : "Masukkan kata sandi"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {formErrors.password && <div style={styles.errorText}>{formErrors.password}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tentukan Jabatan (Role)</label>
                <select
                  style={styles.select}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="anggota">Anggota</option>
                  <option value="sekretaris">Sekretaris</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="ketua">Ketua</option>
                </select>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>Batal</button>
                <button type="submit" style={styles.submitBtn}>
                  {editingUser ? "Simpan" : "Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}