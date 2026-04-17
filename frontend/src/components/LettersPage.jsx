import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";

const styles = {
  wrapper: { backgroundColor: "#f8fafc", minHeight: "100vh", position: "relative" },
  container: { padding: "clamp(20px, 3vw, 40px)", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" },
  title: { fontSize: "clamp(22px, 5vw, 28px)", fontWeight: "900", color: "#1e293b", margin: 0 },
  
  // TOAST NOTIFIKASI DI TENGAH ATAS
  toastContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10001,
    pointerEvents: "none"
  },
  toast: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "clamp(30px, 4vw, 50px)",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    pointerEvents: "auto",
    animation: "fadeInScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
  },
  toastIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  toastTitle: {
    fontSize: "clamp(20px, 3vw, 24px)",
    fontWeight: "900",
    color: "#1e293b",
    margin: "0 0 8px 0"
  },
  toastMessage: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    lineHeight: "1.5"
  },

  formCard: {
    backgroundColor: "#ffffff", padding: "clamp(20px, 3vw, 30px)", borderRadius: "20px",
    border: "2px solid #e2e8f0", marginBottom: "30px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
  },
  formInput: {
    width: "100%", padding: "clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 15px)", borderRadius: "12px", border: "2px solid #f1f5f9",
    marginBottom: "15px", fontSize: "14px", outline: "none", display: "block",
    boxSizing: "border-box", backgroundColor: "#ffffff", color: "#1e293b"
  },

  controlsRow: { 
    display: "flex", gap: "clamp(10px, 2vw, 15px)", marginBottom: "25px", backgroundColor: "#ffffff", 
    padding: "clamp(12px, 2vw, 15px)", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0",
    flexWrap: "wrap"
  },
  searchBar: { flex: "2 1 auto", minWidth: "150px", padding: "clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 20px)", borderRadius: "12px", border: "2px solid #f1f5f9", backgroundColor: "#f8fafc", color: "#1e293b", outline: "none" },
  filterDropdown: { flex: "1 1 auto", minWidth: "100px", padding: "clamp(10px, 1.5vw, 14px)", borderRadius: "12px", border: "2px solid #f1f5f9", backgroundColor: "#ffffff", color: "#475569", fontWeight: "600", outline: "none", cursor: "pointer" },
  
  btnPrimary: { backgroundColor: "#4f46e5", color: "#fff", padding: "clamp(10px, 1.5vw, 12px) clamp(16px, 2vw, 24px)", borderRadius: "12px", border: "none", fontWeight: "800", cursor: "pointer", fontSize: "clamp(12px, 1.5vw, 14px)", whiteSpace: "nowrap" },
  btnCancel: { backgroundColor: "#f1f5f9", color: "#64748b", padding: "clamp(10px, 1.5vw, 12px) clamp(16px, 2vw, 24px)", borderRadius: "12px", border: "none", fontWeight: "800", cursor: "pointer", fontSize: "clamp(12px, 1.5vw, 14px)", whiteSpace: "nowrap" },
  btnEdit: { backgroundColor: "#fef9c3", color: "#a16207", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginRight: "5px" },
  btnDelete: { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" },
  
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "clamp(20px, 3vw, 40px)",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center"
  },
  modalTitle: {
    fontSize: "clamp(18px, 3vw, 22px)",
    fontWeight: "900",
    color: "#1e293b",
    margin: "0 0 12px 0"
  },
  modalText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 24px 0",
    lineHeight: "1.5"
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center"
  },
  modalBtnCancel: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    padding: "10px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },
  modalBtnDelete: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease"
  }
};

function LettersPage({ user }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formData, setFormData] = useState({ title: "", letter_type: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success", title: "", icon: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, title: "", message: "", action: null, actionId: null });

  const canCRUD = user?.role?.toLowerCase() === "sekretaris" || user?.role?.toLowerCase() === "ketua";

  // Fungsi Alert yang otomatis hilang dalam 3 detik
  const triggerAlert = (message, type = "success", title = "", icon = "") => {
    setAlert({ show: true, message, type, title, icon });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Fungsi untuk membuka modal konfirmasi
  const openConfirmModal = (title, message, action, actionId = null) => {
    setConfirmModal({ show: true, title, message, action, actionId });
  };

  // Fungsi untuk menutup modal konfirmasi
  const closeConfirmModal = () => {
    setConfirmModal({ show: false, title: "", message: "", action: null, actionId: null });
  };

  // Fungsi untuk handle aksi konfirmasi
  const handleConfirmAction = async () => {
    if (confirmModal.action === "delete") {
      try {
        await letterAPI.deleteLetter(confirmModal.actionId);
        triggerAlert("Surat berhasil dihapus dari sistem", "success", "Terhapus!", "🗑️");
        loadLetters();
      } catch (e) { 
        triggerAlert(e.response?.data?.detail || "Gagal menghapus surat", "error", "Oops!", "⚠️"); 
      }
    }
    closeConfirmModal();
  };

  useEffect(() => { loadLetters(); }, []);

  const loadLetters = async () => {
    try {
      setLoading(true);
      const data = await letterAPI.getLetters();
      setLetters(data || []);
    } catch (err) { triggerAlert("Gagal memuat data surat", "error", "Gagal", "⚠️"); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCRUD) return;

    try {
      if (editingId) {
        // Mengirim objek dictionary sesuai fungsi update_letter di crud.py
        const updatePayload = {
          title: formData.title,
          letter_type: formData.letter_type,
          content: formData.content
        };
        await letterAPI.updateLetter(editingId, updatePayload);
        triggerAlert("Surat berhasil diperbarui", "success", "Berhasil!", "✨");
      } else {
        await letterAPI.createLetter(formData.title, formData.letter_type, formData.content);
        triggerAlert("Surat baru telah dibuat", "success", "Berhasil!", "✅");
      }
      resetForm();
      loadLetters();
    } catch (err) {
      triggerAlert(err.response?.data?.detail || "Terjadi kesalahan sistem", "error", "Oops!", "⚠️");
    }
  };

  const handleDelete = async (id) => {
    if (!canCRUD) return;
    openConfirmModal(
      "Hapus Surat?",
      "Surat akan dihapus secara permanen dan tidak dapat dikembalikan.",
      "delete",
      id
    );
  };

  const startEdit = (letter) => {
    setFormData({ 
      title: letter.title || "", 
      letter_type: letter.letter_type || "", 
      content: letter.content || "" 
    });
    setEditingId(letter.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ title: "", letter_type: "", content: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredLetters = letters.filter(l => 
    (l.title || "").toLowerCase().includes(searchQuery.toLowerCase()) && 
    (typeFilter === "all" || l.letter_type === typeFilter)
  );

  return (
    <div style={styles.wrapper}>
      {/* AREA NOTIFIKASI TENGAH */}
      <div style={{ ...styles.toastContainer, pointerEvents: alert.show ? "auto" : "none" }}>
        {alert.show && (
          <div style={styles.toast}>
            <div style={styles.toastIcon}>{alert.icon}</div>
            <h3 style={styles.toastTitle}>{alert.title}</h3>
            <p style={styles.toastMessage}>{alert.message}</p>
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI */}
      {confirmModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{confirmModal.title}</h2>
            <p style={styles.modalText}>{confirmModal.message}</p>
            <div style={styles.modalButtons}>
              <button style={styles.modalBtnCancel} onClick={closeConfirmModal}>
                ✕ Batal
              </button>
              <button 
                style={styles.modalBtnDelete}
                onClick={handleConfirmAction}
              >
                ✓ Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h2 style={{ 
              ...styles.title, 
              margin: 0, 
              padding: 0,
              lineHeight: '1.2',
              transform: 'translateX(-1.5px)', 
            }}>
              Manajemen Surat 📩
            </h2>
            <p style={{ 
              color: "#64748b", 
              fontSize: "14px", 
              margin: 0,
              padding: 0,
              paddingTop: "5px" 
            }}>
              Kelola surat dan dokumen resmi HMSI ITK.
            </p>
          </div>
          {canCRUD && (
            <button style={showForm ? styles.btnCancel : styles.btnPrimary} onClick={showForm ? resetForm : () => setShowForm(true)}>
              {showForm ? "✕ Batal" : "+ Buat Surat"}
            </button>
          )}
        </div>

        {showForm && canCRUD && (
          <div style={styles.formCard}>
            <h3 style={{ textAlign: "center", marginBottom: "25px", color: "#1e293b" }}>
               {editingId ? "✏️ Edit Surat" : "✨ Surat Baru"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input style={styles.formInput} placeholder="Judul Surat" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <select style={styles.formInput} value={formData.letter_type} onChange={(e) => setFormData({ ...formData, letter_type: e.target.value })} required>
                <option value="">-- Pilih Jenis --</option>
                <option value="Undangan">Undangan</option>
                <option value="Permohonan">Permohonan</option>
                <option value="Izin">Izin</option>
                <option value="Pemberitahuan">Pemberitahuan</option>
              </select>
              <textarea style={{ ...styles.formInput, minHeight: "120px", resize: "none" }} placeholder="Isi surat..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
              <div style={{ textAlign: "center" }}>
                <button type="submit" style={{ ...styles.btnPrimary, width: "100%" }}>
                  {editingId ? "Simpan Perubahan" : "Buat Surat"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.controlsRow}>
          <input style={styles.searchBar} placeholder="🔍 Cari judul surat..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <select style={styles.filterDropdown} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">📂 Semua Jenis</option>
            <option value="Undangan">Undangan</option>
            <option value="Permohonan">Permohonan</option>
            <option value="Izin">Izin</option>
            <option value="Pemberitahuan">Pemberitahuan</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Memuat...</div>
        ) : filteredLetters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>Data tidak ditemukan</div>
        ) : (
          filteredLetters.map((l) => (
            <div key={l.id} style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#4f46e5", backgroundColor: "#eef2ff", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" }}>{l.letter_type}</span>
                {canCRUD && (
                  <div>
                    <button style={styles.btnEdit} onClick={() => startEdit(l)}>Edit</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(l.id)}>Hapus</button>
                  </div>
                )}
              </div>
              <h4 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "18px" }}>{l.title}</h4>
              <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>{l.content}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes popDown {
          from { opacity: 0; transform: translate(-50%, -50px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default LettersPage;