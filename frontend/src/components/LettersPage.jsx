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
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "auto",
    maxWidth: "90vw",
    pointerEvents: "none"
  },
  toast: {
    padding: "clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)",
    borderRadius: "50px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "clamp(12px, 1.5vw, 14px)",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    animation: "popDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
    pointerEvents: "auto",
    minWidth: "auto",
    justifyContent: "center"
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
  btnDelete: { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }
};

function LettersPage({ user }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formData, setFormData] = useState({ title: "", letter_type: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const canCRUD = user?.role?.toLowerCase() === "sekretaris" || user?.role?.toLowerCase() === "ketua";

  // Fungsi Alert yang otomatis hilang dalam 3 detik
  const triggerAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => { loadLetters(); }, []);

  const loadLetters = async () => {
    try {
      setLoading(true);
      const data = await letterAPI.getLetters();
      setLetters(data || []);
    } catch (err) { triggerAlert("Gagal memuat data", "error"); } finally { setLoading(false); }
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
        triggerAlert("Berhasil diperbarui ✨", "success");
      } else {
        await letterAPI.createLetter(formData.title, formData.letter_type, formData.content);
        triggerAlert("Surat berhasil dibuat ✅", "success");
      }
      resetForm();
      loadLetters();
    } catch (err) {
      triggerAlert(err.response?.data?.detail || "Terjadi kesalahan sistem", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!canCRUD) return;
    if (window.confirm("Hapus surat ini secara permanen?")) {
      try {
        await letterAPI.deleteLetter(id);
        triggerAlert("Surat berhasil dihapus 🗑️", "success");
        loadLetters();
      } catch (err) { triggerAlert("Gagal menghapus", "error"); }
    }
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
      <div style={styles.toastContainer}>
        {alert.show && (
          <div style={{ ...styles.toast, backgroundColor: alert.type === "success" ? "#10b981" : "#ef4444" }}>
            {alert.message}
          </div>
        )}
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Manajemen Surat 📩</h2>
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
      `}</style>
    </div>
  );
}

export default LettersPage;