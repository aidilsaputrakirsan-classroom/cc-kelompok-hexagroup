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
  formCard: {
    backgroundColor: "#ffffff",
    padding: "clamp(20px, 3vw, 30px)",
    borderRadius: "20px",
    border: "2px solid #e2e8f0",
    marginBottom: "30px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
  },
  formInput: {
    width: "100%",
    padding: "clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 15px)",
    borderRadius: "12px",
    border: "2px solid #f1f5f9",
    marginBottom: "15px",
    fontSize: "14px",
    outline: "none",
    display: "block",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#1e293b"
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
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ type: "", category: "", amount: "", description: "" });

  const categories = ["Iuran", "Konsumsi", "Transport", "Donasi", "Operasional", "Lainnya"];
  
  // Logika: Hanya Ketua dan Bendahara yang bisa manipulasi data
  const canManage = user.role === "bendahara" || user.role === "ketua";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = transactions;
    
    if (typeFilter !== "All") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (categoryFilter !== "All") {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    setFilteredData(filtered);
  }, [categoryFilter, typeFilter, transactions]);

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
      setFormData({ type: "", category: "", amount: "", description: "" });
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
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h2 style={{ 
    ...styles.title, 
    margin: 0, 
    padding: 0,
    lineHeight: '1.2',
    transform: 'translateX(-1.5px)', 
  }}>
    Finance Reports
  </h2>
  <p style={{ 
    color: "#64748b", 
    fontSize: "14px", 
    margin: 0,
    padding: 0,
    paddingTop: "5px" 
  }}>
    Laporan transparansi keuangan HMSI ITK.
  </p>
</div>
          {canManage && (
            <button 
              style={{
                ...styles.btnPrimary,
                backgroundColor: showForm ? "#64748b" : "#4f46e5"
              }} 
              onClick={() => {
                if (!showForm) {
                  setFormData({ type: "", category: "", amount: "", description: "" });
                  setEditingId(null);
                }
                setShowForm(!showForm);
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
          <div style={styles.card}>
            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontWeight: "600", fontSize: "12px" }}>SALDO AKHIR</p>
            <h3 style={{ color: "#4ade80", fontSize: "24px", margin: 0, fontWeight: "800" }}>Rp {summary.balance.toLocaleString()}</h3>
          </div>
        </div>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          <span style={{ fontWeight: "700", color: "#475569", fontSize: "14px" }}>Filter Jenis:</span>
          <select style={styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">Semua Jenis</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
          <span style={{ fontWeight: "700", color: "#475569", fontSize: "14px" }}>Filter Kategori:</span>
          <select style={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">Semua Kategori</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button 
            style={{ 
              padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f1f5f9",
              color: "#dc2626",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
              whiteSpace: "nowrap"
            }}
            onClick={() => {
              setTypeFilter("All");
              setCategoryFilter("All");
            }}
          >
            ↻ Reset Filter
          </button>
        </div>

        {/* Form Transaksi (Hanya untuk Ketua/Bendahara) */}
        {canManage && showForm && (
          <div style={styles.formCard}>
            <h3 style={{ textAlign: "center", marginBottom: "25px", color: "#1e293b" }}>
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
              <div style={{ textAlign: "center" }}>
                <button type="submit" style={{ ...styles.btnPrimary, width: "100%" }}>
                  {editingId ? "Simpan Perubahan" : "Konfirmasi & Simpan"}
                </button>
              </div>
            </form>
          </div>
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
      
      {/* CSS internal untuk hover effect row tabel dan select styling */}
      <style>
        {`
          .table-row:hover {
            background-color: #f8fafc;
            transition: background-color 0.2s ease;
          }
          select option {
            color: #1e293b;
            background-color: #ffffff;
          }
          select option:hover {
            background-color: #eef2ff;
          }
        `}
      </style>
    </div>
  );
}

export default FinancePage;
