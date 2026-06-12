import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";

export default function LettersPage({ user, showToast }) {
  
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState(null); 

  const isSekretaris = user?.role?.toLowerCase() === "sekretaris";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState(""); 

  const [formData, setFormData] = useState({
    title: "",
    letterType: "undangan", 
    content: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      
      const response = await letterAPI.getLetters();
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (duration < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - duration));
      }

      setLetters(Array.isArray(response) ? response : response.letters || []);
    } catch (err) {
      showToast(err.message || "Gagal mengambil data surat", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilterType("");
  };

  const filteredLetters = letters.filter((l) => {
    const matchesText = searchQuery.trim() === "" || 
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "" || l.letter_type?.toLowerCase() === filterType.toLowerCase();

    return matchesText && matchesType;
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Judul surat wajib diisi";
    if (!formData.content.trim()) errors.content = "Isi atau konten surat tidak boleh kosong";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isSekretaris) {
      showToast("Akses ditolak! Hanya Sekretaris yang dapat mengelola surat.", "error");
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingLetter) {
        await letterAPI.updateLetter(editingLetter.id, {
          title: formData.title,
          letter_type: formData.letterType,
          content: formData.content
        });
        showToast(`Surat "${formData.title}" berhasil diperbarui!`, "success");
      } else {
        await letterAPI.createLetter(formData.title, formData.letterType, formData.content);
        showToast(`Surat "${formData.title}" berhasil dibuat!`, "success");
      }
      closeModal();
      fetchLetters();
    } catch (err) {
      showToast(err.message || "Gagal memproses data surat", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLetter = async (targetLetter) => {
    if (!isSekretaris) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus surat "${targetLetter.title}"?`)) {
      setLoading(true);
      try {
        await letterAPI.deleteLetter(targetLetter.id);
        showToast(`Surat "${targetLetter.title}" berhasil dihapus.`, "success");
        fetchLetters();
      } catch (err) {
        showToast(err.message || "Gagal menghapus surat", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (targetLetter = null) => {
    if (!isSekretaris) return;
    if (targetLetter) {
      setEditingLetter(targetLetter);
      setFormData({
        title: targetLetter.title || "",
        letterType: targetLetter.letter_type?.toLowerCase() || "undangan",
        content: targetLetter.content || ""
      });
    } else {
      setEditingLetter(null);
      setFormData({ title: "", letterType: "undangan", content: "" });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLetter(null);
    setFormErrors({});
  };

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "30px 20px", paddingTop: "104px", transition: "background-color 0.3s ease" },
    wrapper: { maxWidth: "1140px", margin: "0 auto" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" },
    title: { fontSize: "28px", fontWeight: "900", color: "var(--text-title)", margin: 0 },
    
    addBtn: { 
      padding: "12px 24px", borderRadius: "12px", 
      backgroundColor: "#2563eb", 
      color: "#ffffff", border: "2px solid #1d4ed8", fontWeight: "700", fontSize: "14px", 
      cursor: "pointer", 
      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.45)",
      transition: "all 0.2s ease"
    },
    
    filterWrapper: { display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center" },
    searchInput: { flex: "2", minWidth: "240px", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-title)", fontSize: "14px", outline: "none" },
    typeSelect: { flex: "1", minWidth: "180px", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-title)", fontSize: "14px", outline: "none", cursor: "pointer" },
    resetBtn: { padding: "12px 20px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "rgba(148, 163, 184, 0.1)", color: "var(--text-main)", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
    
    tableCard: { backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    th: { padding: "16px 20px", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-title)", fontWeight: "800", fontSize: "13px", borderBottom: "1px solid var(--border-color)", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid var(--border-color)" },
    td: { padding: "16px 20px", color: "var(--text-main)", fontSize: "14px" },
    
    typeBadge: (type) => {
      let bg = "rgba(148, 163, 184, 0.15)", color = "#94a3b8";
      if (type === "undangan") { bg = "rgba(79, 70, 229, 0.15)"; color = "#818cf8"; }
      else if (type === "permohonan") { bg = "rgba(234, 179, 8, 0.15)"; color = "#facc15"; }
      else if (type === "izin") { bg = "rgba(16, 185, 129, 0.15)"; color = "#4ade80"; }
      else if (type === "pemberitahuan") { bg = "rgba(249, 115, 22, 0.15)"; color = "#fb923c"; }
      return { padding: "5px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", backgroundColor: bg, color, display: "inline-block" };
    },

    actionBtn: { padding: "6px 14px", borderRadius: "8px", border: "2px solid #3b82f6", backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", fontWeight: "700", cursor: "pointer", marginRight: "10px", fontSize: "13px", transition: "all 0.2s ease" },
    deleteActionBtn: { padding: "6px 14px", borderRadius: "8px", border: "2px solid #ef4444", backgroundColor: "rgba(239, 68, 68, 0.10)", color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px", transition: "all 0.2s ease" },
    
    emptyStateInitial: { padding: "80px 20px", textAlign: "center", color: "var(--text-main)", fontSize: "16px", fontWeight: "600" },
    emptyStateSearch: { padding: "60px 20px", textAlign: "center", color: "#ef4444", fontSize: "15px", fontWeight: "600" },
    
    spinnerOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 11000, color: "#ffffff" },
    spinner: { width: "45px", height: "45px", border: "4px solid rgba(255,255,255,0.3)", borderTop: "4px solid #ffffff", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "15px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "16px", overflowY: "auto" },
    modalContent: { backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-color)", width: "100%", maxWidth: "500px", padding: "clamp(20px, 5vw, 30px)", maxHeight: "90vh", overflowY: "auto" },
    modalTitle: { fontSize: "20px", fontWeight: "800", color: "var(--text-title)", margin: "0 0 20px 0" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" },
    label: { fontSize: "13px", fontWeight: "700", color: "var(--text-title)" },
    input: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none" },
    textarea: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none", minHeight: "120px", resize: "vertical", fontFamily: "inherit" },
    select: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none", cursor: "pointer" },
    errorText: { color: "#ef4444", fontSize: "12px", fontWeight: "600", marginTop: "2px" },
    modalFooter: { display: "flex", gap: "12px", marginTop: "25px" },
    cancelBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "transparent", color: "var(--text-main)", fontWeight: "700", cursor: "pointer" },
    submitBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "700", cursor: "pointer" }
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

      {/* OVERLAY LOADING SPINNER 3 DETIK */}
      {loading && (
        <div style={styles.spinnerOverlay}>
          <div style={styles.spinner}></div>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Memproses Dokumen Surat...</span>
        </div>
      )}

      <div style={styles.wrapper}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Arsip & Pengajuan Surat</h1>
          {isSekretaris && (
            <button 
              style={styles.addBtn} 
              onClick={() => openModal(null)}
            >
              ➕ Buat Surat Baru
            </button>
          )}
        </div>

        <div style={styles.filterWrapper}>
          <input
            type="text"
            placeholder="Ketik judul atau kata kunci surat..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            style={styles.typeSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Semua Jenis Surat</option>
            <option value="undangan">✉️ Undangan</option>
            <option value="permohonan">📝 Permohonan</option>
            <option value="izin">🙋 Izin</option>
            <option value="pemberitahuan">📢 Pemberitahuan</option>
          </select>

          {(searchQuery || filterType) && (
            <button style={styles.resetBtn} onClick={handleResetSearch}>
              🔄 Reset Filter
            </button>
          )}
        </div>

        <div style={styles.tableCard}>
          {letters.length === 0 ? (
            <div style={styles.emptyStateInitial}>
              🗄️ Belum ada arsip surat organisasi yang terdaftar di sistem.
            </div>
          ) : filteredLetters.length === 0 ? (
            <div style={styles.emptyStateSearch}>
              ❌ Surat tidak ditemukan. Periksa kembali ketikan kata kunci atau filter kategori jenis surat Anda.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Informasi Surat</th>
                    <th style={styles.th}>Kategori Jenis</th>
                    {isSekretaris && (
                      <th style={{ ...styles.th, textAlign: "right", paddingRight: "20px" }}>Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredLetters.map((letter) => (
                    <tr key={letter.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "800", color: "var(--text-title)", fontSize: "15px" }}>{letter.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-main)", opacity: 0.7, marginTop: "4px", maxWidth: "450px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {letter.content}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.typeBadge(letter.letter_type?.toLowerCase())}>
                          {letter.letter_type}
                        </span>
                      </td>
                      {isSekretaris && (
                        <td style={{ ...styles.td, textAlign: "right", paddingRight: "20px", whiteSpace: "nowrap" }}>
                          <button style={styles.actionBtn} onClick={() => openModal(letter)}>Edit</button>
                          <button style={styles.deleteActionBtn} onClick={() => handleDeleteLetter(letter)}>Hapus</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && isSekretaris && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {}
              {editingLetter ? "📝 Edit Dokumen Surat" : "➕ Tambah Dokumen Surat"}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Judul Dokumen Surat</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Contoh: Surat Undangan Rapat Pleno I"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {formErrors.title && <div style={styles.errorText}>{formErrors.title}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Kategori Jenis Surat</label>
                <select
                  style={styles.select}
                  value={formData.letterType}
                  onChange={(e) => setFormData({ ...formData, letterType: e.target.value })}
                >
                  <option value="undangan">Undangan</option>
                  <option value="permohonan">Permohonan</option>
                  <option value="izin">Izin</option>
                  <option value="pemberitahuan">Pemberitahuan</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Isi / Ringkasan Konten Surat</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Tuliskan isi ringkasan atau detail isi dari surat di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                {formErrors.content && <div style={styles.errorText}>{formErrors.content}</div>}
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>Batal</button>
                <button type="submit" style={styles.submitBtn}>
                  {editingLetter ? "Perbarui" : "Simpan Surat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}