import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f0f4f8",
    padding: "clamp(20px, 3vw, 40px)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    color: "#1e293b",
    margin: 0,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "clamp(15px, 2vw, 20px)",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    padding: "clamp(15px, 2vw, 24px)",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  filterSection: {
    background: "white",
    padding: "clamp(12px, 2vw, 20px)",
    borderRadius: "20px",
    marginBottom: "20px",
    display: "flex",
    gap: "clamp(10px, 2vw, 15px)",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    flexWrap: "wrap"
  },
  select: {
    padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px)",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontSize: "14px",
    color: "#475569",
    outline: "none",
    cursor: "pointer",
    flex: "1 1 auto",
    minWidth: "100px"
  },
  input: {
    padding: "clamp(10px, 1.5vw, 12px)",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "10px",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
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
  tableCard: {
    background: "white",
    borderRadius: "24px",
    overflow: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "500px"
  },
  th: {
    padding: "clamp(12px, 1.5vw, 18px)",
    background: "#f8fafc",
    color: "#64748b",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
  },
  td: {
    padding: "clamp(12px, 1.5vw, 20px) clamp(12px, 1.5vw, 18px)",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "15px",
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
  })
};

function FinancePage({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ type: "income", category: "Iuran", amount: "", description: "" });

  const categories = ["Iuran", "Konsumsi", "Transport", "Donasi", "Operasional", "Lainnya"];
  
  // Logika: Hanya Ketua dan Bendahara yang bisa manipulasi data
  const canManage = user.role === "bendahara" || user.role === "ketua";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categoryFilter === "All") {
      setFilteredData(transactions);
    } else {
      setFilteredData(transactions.filter(t => t.category === categoryFilter));
    }
  }, [categoryFilter, transactions]);

  const loadData = async () => {
    try {
      const [tData, sData] = await Promise.all([
        financeAPI.getTransactions(),
        financeAPI.getSummary()
      ]);
      setTransactions(tData);
      setSummary(sData);
    } catch (e) { console.error("Error loading finance data:", e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await financeAPI.updateTransaction(editingId, { ...formData, amount: parseFloat(formData.amount) });
      } else {
        await financeAPI.createTransaction(formData.type, formData.category, parseFloat(formData.amount), formData.description);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ type: "income", category: "Iuran", amount: "", description: "" });
      loadData();
    } catch (e) { alert("Gagal menyimpan transaksi"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus transaksi ini?")) {
      try {
        await financeAPI.deleteTransaction(id);
        loadData();
      } catch (e) { alert("Gagal menghapus"); }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Finance Reports</h2>
            <p style={{ color: "#64748b", marginTop: "5px", fontSize: "14px" }}>
              {canManage ? "🚀 Mode Pengelola: Tambah atau edit laporan." : "🔍 Mode Lihat: Laporan keuangan transparan."}
            </p>
          </div>
          {canManage && (
            <button 
              style={{
                ...styles.btnPrimary,
                backgroundColor: showForm ? "#64748b" : "#4f46e5"
              }} 
              onClick={() => {
                setShowForm(!showForm);
                if(showForm) setEditingId(null);
              }}
            >
              {showForm ? "✕ Batal" : "+ Transaksi Baru"}
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.card}>
            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontWeight: "600", fontSize: "12px" }}>TOTAL PEMASUKAN</p>
            <h3 style={{ color: "#16a34a", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.total_income.toLocaleString()}</h3>
          </div>
          <div style={styles.card}>
            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontWeight: "600", fontSize: "12px" }}>TOTAL PENGELUARAN</p>
            <h3 style={{ color: "#dc2626", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.total_expense.toLocaleString()}</h3>
          </div>
          <div style={{ ...styles.card, background: "#0f172a", color: "white" }}>
            <p style={{ color: "#94a3b8", margin: "0 0 8px 0", fontWeight: "600", fontSize: "12px" }}>SALDO AKHIR</p>
            <h3 style={{ color: "#4ade80", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.balance.toLocaleString()}</h3>
          </div>
        </div>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          <span style={{ fontWeight: "700", color: "#475569", fontSize: "14px" }}>Filter Kategori:</span>
          <select style={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">Semua Kategori</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Form Transaksi (Hanya untuk Ketua/Bendahara) */}
        {canManage && showForm && (
          <form style={{ ...styles.card, marginBottom: "30px", border: "2px solid #4f46e5" }} onSubmit={handleSubmit}>
            <h4 style={{marginTop: 0, marginBottom: "20px", color: "#1e293b"}}>
                {editingId ? "📝 Edit Detail Transaksi" : "✨ Tambah Transaksi Baru"}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase"}}>Jenis</label>
                <select style={styles.input} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="income">Income (+)</option>
                  <option value="expense">Expense (-)</option>
                </select>
              </div>
              <div>
                <label style={{fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase"}}>Kategori</label>
                <select style={styles.input} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom: "15px"}}>
                <label style={{fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase"}}>Nominal (Rp)</label>
                <input style={styles.input} type="number" placeholder="Contoh: 50000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div style={{marginBottom: "20px"}}>
                <label style={{fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase"}}>Keterangan</label>
                <input style={styles.input} type="text" placeholder="Masukkan deskripsi singkat..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <button type="submit" style={{ ...styles.btnPrimary, width: "100%" }}>
              {editingId ? "Simpan Perubahan" : "Konfirmasi & Simpan"}
            </button>
          </form>
        )}

        {/* Table Data */}
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
                <tr key={t.id} className="table-row">
                  <td style={styles.td}>
                    <div style={{ fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>{t.description}</div>
                    <div style={styles.statusBadge(t.type)}>{t.type}</div>
                  </td>
                  <td style={styles.td}>{t.category}</td>
                  <td style={{ ...styles.td, fontWeight: "800", color: t.type === 'income' ? '#16a34a' : '#1e293b' }}>
                    {t.type === 'income' ? '+ ' : '- '}Rp {t.amount.toLocaleString()}
                  </td>
                  {canManage && (
                    <td style={styles.td}>
                      <button style={{ marginRight: "12px", color: "#4f46e5", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "8px", background: "white", cursor: "pointer", fontWeight: "600", fontSize: "12px" }} 
                        onClick={() => { setEditingId(t.id); setFormData(t); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Edit</button>
                      <button style={{ color: "#ef4444", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "8px", background: "#fef2f2", cursor: "pointer", fontWeight: "600", fontSize: "12px" }} 
                        onClick={() => handleDelete(t.id)}>Hapus</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div style={{padding: "60px", textAlign: "center", color: "#94a3b8"}}>
                <div style={{fontSize: "40px", marginBottom: "10px"}}>Empty</div>
                <p>Tidak ada catatan transaksi untuk kategori ini.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS internal untuk hover effect row tabel */}
      <style>
        {`
          .table-row:hover {
            background-color: #f8fafc;
            transition: background-color 0.2s ease;
          }
        `}
      </style>
    </div>
  );
}

export default FinancePage;
