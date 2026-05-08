import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--bg-page)", // Berubah otomatis
    padding: "clamp(20px, 3vw, 40px)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "all 0.3s ease",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px"
  },
  title: {
    fontSize: "clamp(22px, 5vw, 28px)",
    fontWeight: "800",
    color: "var(--text-title)", // Berubah otomatis
    margin: 0,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "clamp(15px, 2vw, 20px)",
    marginBottom: "30px",
  },
  card: {
    background: "var(--bg-card)", // Berubah otomatis
    padding: "clamp(15px, 2vw, 24px)",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid var(--border-color)", // Berubah otomatis
  },
  filterSection: {
    background: "var(--bg-card)", // Berubah otomatis
    padding: "clamp(12px, 2vw, 20px)",
    borderRadius: "20px",
    marginBottom: "20px",
    display: "flex",
    gap: "clamp(10px, 2vw, 15px)",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    border: "1px solid var(--border-color)",
    flexWrap: "wrap"
  },
  select: {
    padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-page)",
    fontSize: "14px",
    color: "var(--text-main)",
    outline: "none",
    cursor: "pointer",
    flex: "1 1 auto",
    minWidth: "100px"
  },
  btnPrimary: {
    padding: "clamp(10px, 1.5vw, 12px) clamp(16px, 2vw, 24px)",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    whiteSpace: "nowrap"
  },
  formCard: {
    backgroundColor: "var(--bg-card)",
    padding: "clamp(20px, 3vw, 30px)",
    borderRadius: "20px",
    border: "2px solid var(--border-color)",
    marginBottom: "30px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
  },
  formInput: {
    width: "100%",
    padding: "clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 15px)",
    borderRadius: "12px",
    border: "2px solid var(--border-color)",
    marginBottom: "15px",
    fontSize: "14px",
    outline: "none",
    display: "block",
    boxSizing: "border-box",
    backgroundColor: "var(--bg-page)",
    color: "var(--text-main)"
  },
  tableCard: {
    background: "var(--bg-card)",
    borderRadius: "24px",
    overflow: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    border: "1px solid var(--border-color)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "500px"
  },
  th: {
    padding: "clamp(12px, 1.5vw, 18px)",
    background: "var(--bg-page)",
    color: "var(--text-main)",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    borderBottom: "1px solid var(--border-color)",
  },
  td: {
    padding: "clamp(12px, 1.5vw, 20px) clamp(12px, 1.5vw, 18px)",
    borderBottom: "1px solid var(--border-color)",
    fontSize: "15px",
    color: "var(--text-main)",
  },
  statusBadge: (type) => ({
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
    backgroundColor: type === "income" ? "#dcfce7" : "#fee2e2",
    color: type === "income" ? "#15803d" : "#b91c1c",
    display: "inline-block",
    textTransform: "uppercase",
  }),
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
    backgroundColor: "var(--bg-card)",
    color: "var(--text-main)",
    borderRadius: "24px",
    padding: "clamp(30px, 4vw, 50px)",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    pointerEvents: "auto",
    border: "1px solid var(--border-color)",
    animation: "fadeInScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
  },
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
    backgroundColor: "var(--bg-card)",
    color: "var(--text-main)",
    borderRadius: "24px",
    padding: "clamp(20px, 3vw, 40px)",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    border: "1px solid var(--border-color)",
  },
};

function FinancePage({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ type: "", category: "", amount: "", description: "" });
  const [alert, setAlert] = useState({ show: false, message: "", type: "success", title: "", icon: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, title: "", message: "", action: null, actionId: null });

  const categories = ["Iuran", "Konsumsi", "Transport", "Donasi", "Operasional", "Lainnya"];
  const canManage = user.role === "bendahara" || user.role === "ketua";

  const triggerAlert = (message, type = "success", title = "", icon = "") => {
    setAlert({ show: true, message, type, title, icon });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const openConfirmModal = (title, message, action, actionId = null) => {
    setConfirmModal({ show: true, title, message, action, actionId });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ show: false, title: "", message: "", action: null, actionId: null });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === "delete") {
      try {
        await financeAPI.deleteTransaction(confirmModal.actionId);
        triggerAlert("Transaksi berhasil dihapus dari sistem", "success", "Terhapus!", "🗑️");
        loadData();
      } catch (e) { 
        triggerAlert(e.response?.data?.detail || "Gagal menghapus transaksi", "error", "Oops!", "⚠️"); 
      }
    }
    closeConfirmModal();
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let filtered = transactions;
    if (typeFilter !== "All") filtered = filtered.filter(t => t.type === typeFilter);
    if (categoryFilter !== "All") filtered = filtered.filter(t => t.category === categoryFilter);
    setFilteredData(filtered);
  }, [categoryFilter, typeFilter, transactions]);

  const loadData = async () => {
    try {
      const [tData, sData] = await Promise.all([financeAPI.getTransactions(), financeAPI.getSummary()]);
      setTransactions(tData);
      setSummary(sData);
    } catch (e) { triggerAlert("Gagal memuat data", "error", "Error!", "⚠️"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await financeAPI.updateTransaction(editingId, { ...formData, amount: parseFloat(formData.amount) });
        triggerAlert("Transaksi berhasil diperbarui", "success", "Berhasil!", "✨");
      } else {
        await financeAPI.createTransaction(formData.type, formData.category, parseFloat(formData.amount), formData.description);
        triggerAlert("Transaksi baru telah ditambahkan", "success", "Berhasil!", "✅");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ type: "", category: "", amount: "", description: "" });
      loadData();
    } catch (e) { triggerAlert(e.response?.data?.detail || "Gagal menyimpan transaksi", "error", "Oops!", "⚠️"); }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.toastContainer, pointerEvents: alert.show ? "auto" : "none" }}>
        {alert.show && (
          <div style={styles.toast}>
            <div style={{fontSize: "48px", marginBottom: "16px"}}>{alert.icon}</div>
            <h3 style={{fontWeight: "900", margin: "0 0 8px 0"}}>{alert.title}</h3>
            <p style={{fontSize: "14px", opacity: 0.8, margin: 0}}>{alert.message}</p>
          </div>
        )}
      </div>

      {confirmModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{fontWeight: "900", margin: "0 0 12px 0"}}>{confirmModal.title}</h2>
            <p style={{fontSize: "14px", opacity: 0.8, marginBottom: "24px"}}>{confirmModal.message}</p>
            <div style={{display: "flex", gap: "12px", justifyContent: "center"}}>
              <button style={{background: "#f1f5f9", border: "none", padding: "10px 24px", borderRadius: "12px", cursor: "pointer"}} onClick={closeConfirmModal}>Batal</button>
              <button 
                style={{background: confirmModal.action === "delete" ? "#ef4444" : "#10b981", color: "white", border: "none", padding: "10px 24px", borderRadius: "12px", cursor: "pointer"}} 
                onClick={handleConfirmAction}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Finance Reports</h2>
            <p style={{ color: "var(--text-main)", opacity: 0.6, fontSize: "14px", margin: 0 }}>Laporan transparansi keuangan HMSI ITK.</p>
          </div>
          {canManage && (
            <button 
              style={{ ...styles.btnPrimary, backgroundColor: showForm ? "#64748b" : "#4f46e5" }} 
              onClick={() => { setShowForm(!showForm); if(!showForm) setEditingId(null); }}
            >
              {showForm ? "✕ Batal" : "+ Transaksi Baru"}
            </button>
          )}
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.card}>
            <p style={{ color: "var(--text-main)", opacity: 0.6, fontWeight: "600", fontSize: "12px", margin: "0 0 8px 0" }}>TOTAL PEMASUKAN</p>
            <h3 style={{ color: "#16a34a", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.total_income.toLocaleString()}</h3>
          </div>
          <div style={styles.card}>
            <p style={{ color: "var(--text-main)", opacity: 0.6, fontWeight: "600", fontSize: "12px", margin: "0 0 8px 0" }}>TOTAL PENGELUARAN</p>
            <h3 style={{ color: "#dc2626", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.total_expense.toLocaleString()}</h3>
          </div>
          <div style={styles.card}>
            <p style={{ color: "var(--text-main)", opacity: 0.6, fontWeight: "600", fontSize: "12px", margin: "0 0 8px 0" }}>SALDO AKHIR</p>
            <h3 style={{ color: "#4f46e5", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.balance.toLocaleString()}</h3>
          </div>
        </div>

        <div style={styles.filterSection}>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Filter:</span>
          <select style={styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">Semua Jenis</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
          <select style={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">Semua Kategori</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {canManage && showForm && (
          <div style={styles.formCard}>
            <h3 style={{ textAlign: "center", marginBottom: "25px", color: "var(--text-title)" }}>
              {editingId ? "✏️ Edit Transaksi" : "✨ Transaksi Baru"}
            </h3>
            <form onSubmit={handleSubmit}>
              <select style={styles.formInput} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                <option value="">-- Pilih Jenis --</option>
                <option value="income">Income (+)</option>
                <option value="expense">Expense (-)</option>
              </select>
              <select style={styles.formInput} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                <option value="">-- Pilih Kategori --</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input style={styles.formInput} type="number" placeholder="Nominal (Rp)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
              <input style={styles.formInput} type="text" placeholder="Keterangan" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              <button type="submit" style={{ ...styles.btnPrimary, width: "100%" }}>Simpan</button>
            </form>
          </div>
        )}

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Detail Transaksi</th>
                <th style={styles.th}>Kategori</th>
                <th style={styles.th}>Nominal</th>
                {canManage && <th style={styles.th}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "700", marginBottom: "4px" }}>{t.description}</div>
                    <div style={styles.statusBadge(t.type)}>{t.type}</div>
                  </td>
                  <td style={styles.td}>{t.category}</td>
                  <td style={{ ...styles.td, fontWeight: "800", color: t.type === 'income' ? '#16a34a' : 'var(--text-title)' }}>
                    {t.type === 'income' ? '+ ' : '- '}Rp {t.amount.toLocaleString()}
                  </td>
                  {canManage && (
                    <td style={styles.td}>
                      <button style={{ marginRight: "12px", color: "#4f46e5", border: "1px solid var(--border-color)", padding: "6px 12px", borderRadius: "8px", background: "var(--bg-page)", cursor: "pointer" }} 
                        onClick={() => { setEditingId(t.id); setFormData(t); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Edit</button>
                      <button style={{ color: "#ef4444", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "8px", background: "#fef2f2", cursor: "pointer" }} 
                        onClick={() => handleDelete(t.id)}>Hapus</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div style={{padding: "60px", textAlign: "center", opacity: 0.5}}>Tidak ada catatan transaksi.</div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeInScale { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}

export default FinancePage;