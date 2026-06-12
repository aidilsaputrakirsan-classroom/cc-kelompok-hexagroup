import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";

export default function FinancePage({ user, showToast }) {
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const isBendahara = user?.role?.toLowerCase() === "bendahara";

  const [filterType, setFilterType] = useState("");     
  const [filterCategory, setFilterCategory] = useState(""); 
  const [filterYear, setFilterYear] = useState("");     
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "income",
    category: "iuran",
    amount: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch data dari API gateway
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const response = await financeAPI.getTransactions();
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (duration < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - duration));
      }

      setTransactions(Array.isArray(response) ? response : response.transactions || []);
    } catch (err) {
      showToast(err.message || "Gagal mengambil data keuangan", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleResetFilters = () => {
    setFilterType("");
    setFilterCategory("");
    setFilterYear("");
    setSearchQuery("");
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = searchQuery.trim() === "" ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "" || t.type?.toLowerCase() === filterType.toLowerCase();
    const matchesCategory = filterCategory === "" || t.category?.toLowerCase() === filterCategory.toLowerCase();
    
    let matchesYear = true;
    if (filterYear !== "") {
      const txYear = t.date ? new Date(t.date).getFullYear().toString() : "";
      matchesYear = txYear === filterYear;
    }

    return matchesSearch && matchesType && matchesCategory && matchesYear;
  });

  const totalIncome = transactions
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const finalBalance = totalIncome - totalExpense;

  const totalOmset = totalIncome + totalExpense;
  const incomePercentage = totalOmset > 0 ? Math.round((totalIncome / totalOmset) * 100) : 50;
  const expensePercentage = totalOmset > 0 ? Math.round((totalExpense / totalOmset) * 100) : 50;

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Keterangan transaksi wajib diisi";
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = "Nominal harus lebih besar dari 0";
    if (!formData.date) errors.date = "Tanggal transaksi wajib dipilih";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isBendahara) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingTransaction) {
        await financeAPI.updateTransaction(editingTransaction.id, {
          title: formData.title,
          type: formData.type,
          category: formData.category,
          amount: Number(formData.amount),
          date: formData.date
        });
        showToast(`Transaksi "${formData.title}" berhasil diperbarui!`, "success");
      } else {
        await financeAPI.createTransaction(
          formData.title,
          formData.type,
          formData.category,
          Number(formData.amount),
          formData.date
        );
        showToast(`Transaksi "${formData.title}" berhasil dicatat!`, "success");
      }
      closeModal();
      fetchTransactions();
    } catch (err) {
      showToast(err.message || "Gagal memproses transaksi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id, title) => {
    if (!isBendahara) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus catatan keuangan"${title}"?`)) {
      setLoading(true);
      try {
        await financeAPI.deleteTransaction(id);
        showToast(`Catatan keuangan berhasil dihapus.`, "success");
        fetchTransactions();
      } catch (err) {
        showToast(err.message || "Gagal menghapus transaksi", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (target = null) => {
    if (!isBendahara) return;
    if (target) {
      setEditingTransaction(target);
      setFormData({
        title: target.title || "",
        type: target.type?.toLowerCase() || "income",
        category: target.category?.toLowerCase() || "iuran",
        amount: target.amount || "",
        date: target.date ? target.date.split("T")[0] : new Date().toISOString().split("T")[0]
      });
    } else {
      setEditingTransaction(null);
      setFormData({ title: "", type: "income", category: "iuran", amount: "", date: new Date().toISOString().split("T")[0] });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormErrors({});
  };

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "30px 20px", paddingTop: "104px", transition: "all 0.3s ease" },
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

    summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" },
    card: { backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "20px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "6px" },
    cardLabel: { fontSize: "13px", fontWeight: "700", color: "var(--text-title)", textTransform: "uppercase", letterSpacing: "0.05em" },
    cardValue: (color) => ({ fontSize: "24px", fontWeight: "900", color: color || "var(--text-title)" }),

    chartCard: { backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "20px", border: "1px solid var(--border-color)", marginBottom: "30px" },
    chartTrack: { height: "24px", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: "12px", overflow: "hidden", display: "flex", marginTop: "15px", marginBottom: "10px" },
    chartIncomeBar: { height: "100%", backgroundColor: "#10b981", transition: "width 0.5s ease" },
    chartExpenseBar: { height: "100%", backgroundColor: "#ef4444", transition: "width 0.5s ease" },

    filterWrapper: { display: "flex", gap: "12px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center" },
    searchInput: { flex: "2", minWidth: "200px", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-title)", fontSize: "14px", outline: "none" },
    selectFilter: { flex: "1", minWidth: "150px", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-title)", fontSize: "14px", outline: "none", cursor: "pointer" },
    resetBtn: { padding: "12px 18px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "rgba(148, 163, 184, 0.1)", color: "var(--text-main)", fontWeight: "700", fontSize: "14px", cursor: "pointer" },

    tableCard: { backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-color)", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    th: { padding: "16px 20px", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-title)", fontWeight: "800", fontSize: "13px", borderBottom: "1px solid var(--border-color)" },
    tr: { borderBottom: "1px solid var(--border-color)" },
    td: { padding: "16px 20px", color: "var(--text-main)", fontSize: "14px" },
    
    badge: (type) => ({ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", backgroundColor: type === "income" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: type === "income" ? "#10b981" : "#ef4444", display: "inline-block" }),
    
    emptyStateInitial: { padding: "80px 20px", textAlign: "center", color: "var(--text-main)", fontSize: "15px", fontWeight: "600" },
    emptyStateSearch: { padding: "60px 20px", textAlign: "center", color: "#ef4444", fontSize: "15px", fontWeight: "600" },

    spinnerOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 11000, color: "#ffffff" },
    spinner: { width: "45px", height: "45px", border: "4px solid rgba(255,255,255,0.3)", borderTop: "4px solid #ffffff", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "15px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "16px", overflowY: "auto" },
    modalContent: { backgroundColor: "var(--bg-card)", borderRadius: "20px", border: "1px solid var(--border-color)", width: "100%", maxWidth: "460px", padding: "clamp(20px, 5vw, 30px)", maxHeight: "90vh", overflowY: "auto" },
    modalTitle: { fontSize: "20px", fontWeight: "800", color: "var(--text-title)", margin: "0 0 20px 0" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" },
    label: { fontSize: "13px", fontWeight: "700", color: "var(--text-title)" },
    input: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none" },
    select: { padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg, var(--bg-page))", color: "var(--text-title)", fontSize: "14px", outline: "none", cursor: "pointer" },
    errorText: { color: "#ef4444", fontSize: "12px", fontWeight: "600", marginTop: "2px" },
    modalFooter: { display: "flex", gap: "12px", marginTop: "25px" }
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

      {/* OVERLAY LOADING SPINNER 3 DETIK */}
      {loading && (
        <div style={styles.spinnerOverlay}>
          <div style={styles.spinner}></div>
          <span style={{ fontWeight: "700" }}>Memproses Catatan Keuangan...</span>
        </div>
      )}

      <div style={styles.wrapper}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Arus Kas Organisasi</h1>
          {isBendahara && (
            <button style={styles.addBtn} onClick={() => openModal(null)}>
              ➕ Catat Transaksi Baru
            </button>
          )}
        </div>

        {}
        <div style={styles.summaryGrid}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>📈 Total Pemasukan</span>
            <div style={styles.cardValue("#10b981")}>Rp {totalIncome.toLocaleString("id-ID")}</div>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>📉 Total Pengeluaran</span>
            <div style={styles.cardValue("#ef4444")}>Rp {totalExpense.toLocaleString("id-ID")}</div>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>💰 Saldo Akhir Bersih</span>
            <div style={styles.cardValue(finalBalance >= 0 ? "#3b82f6" : "#f43f5e")}>
              Rp {finalBalance.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        {}
        <div style={styles.chartCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-title)" }}>📊 Diagram Arus Kas Organisasi</span>
            <span style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: "700" }}>
              {totalOmset === 0 ? "Belum ada rasio" : `Pemasukan ${incomePercentage}% vs Pengeluaran ${expensePercentage}%`}
            </span>
          </div>
          <div style={styles.chartTrack}>
            <div style={{ ...styles.chartIncomeBar, width: `${incomePercentage}%` }} title={`Pemasukan: ${incomePercentage}%`} />
            <div style={{ ...styles.chartExpenseBar, width: `${expensePercentage}%` }} title={`Pengeluaran: ${expensePercentage}%`} />
          </div>
          <div style={{ display: "flex", gap: "15px", fontSize: "12px", fontWeight: "700", marginTop: "5px" }}>
            <span style={{ color: "#10b981" }}>■ Masuk</span>
            <span style={{ color: "#ef4444" }}>■ Keluar</span>
            {totalExpense > totalIncome && (
              <span style={{ color: "#f43f5e", marginLeft: "auto", animation: "pulse 2s infinite" }}>
                ⚠️ Peringatan: Anggaran defisit (Pengeluaran membengkak melebihi pemasukan!)
              </span>
            )}
          </div>
        </div>

        {/* FILTER & SEARCHBAR */}
        <div style={styles.filterWrapper}>
          <input
            type="text"
            placeholder="🔍 Cari keterangan atau kategori..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select style={styles.selectFilter} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Semua Jenis Arus</option>
            <option value="income">📈 Pemasukan (Income)</option>
            <option value="expense">📉 Pengeluaran (Expense)</option>
          </select>

          <select style={styles.selectFilter} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Semua Kategori</option>
            <option value="iuran">Iuran Anggota</option>
            <option value="konsumsi">Konsumsi</option>
            <option value="transport">Transportasi</option>
            <option value="donasi">Donasi / Hibah</option>
            <option value="operasional">Operasional Kerja</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <select style={styles.selectFilter} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">Semua Tahun</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          {(searchQuery || filterType || filterCategory || filterYear) && (
            <button style={styles.resetBtn} onClick={handleResetFilters}>
              🔄 Reset Filter
            </button>
          )}
        </div>

        {}
        <div style={styles.tableCard}>
          {transactions.length === 0 ? (
            <div style={styles.emptyStateInitial}>
              📈 Rekam data keuangan belum tersedia. SIlakan isi kas organisasi terlebih dahulu.
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div style={styles.emptyStateSearch}>
              ❌ Catatan transaksi tidak ditemukan pada kombinasi filter jenis, kategori, atau tahun tersebut.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Tanggal</th>
                    <th style={styles.th}>Keterangan / Keperluan</th>
                    <th style={styles.th}>Kategori</th>
                    <th style={styles.th}>Jenis</th>
                    <th style={styles.th}>Nominal</th>
                    <th style={{ ...styles.th, textAlign: "right", paddingRight: "20px" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={styles.td}>{t.date ? new Date(t.date).toLocaleDateString("id-ID") : "-"}</td>
                      <td style={{ ...styles.td, fontWeight: "700", color: "var(--text-title)" }}>{t.title}</td>
                      <td style={{ ...styles.td, textTransform: "capitalize" }}>{t.category}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(t.type?.toLowerCase())}>{t.type}</span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: "800", color: t.type === "income" ? "#10b981" : "var(--text-title)" }}>
                        {t.type === "income" ? "+ " : "- "}Rp {t.amount?.toLocaleString("id-ID")}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right", paddingRight: "20px", whiteSpace: "nowrap" }}>
                        {isBendahara && (
                          <>
                            <button style={{ padding: "6px 14px", borderRadius: "8px", border: "2px solid #3b82f6", backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", fontWeight: "700", cursor: "pointer", marginRight: "10px", fontSize: "13px", transition: "all 0.2s ease" }} onClick={() => openModal(t)}>Edit</button>
                            <button style={{ padding: "6px 14px", borderRadius: "8px", border: "2px solid #ef4444", backgroundColor: "rgba(239, 68, 68, 0.10)", color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px", transition: "all 0.2s ease" }} onClick={() => handleDeleteTransaction(t.id, t.title)}>Hapus</button>
                          </>
                        )}
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
      {showModal && isBendahara && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingTransaction ? "📝 Edit Catatan Keuangan" : "➕ Tambah Catatan Keuangan"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Keterangan Transaksi</label>
                <input type="text" style={styles.input} placeholder="Contoh: Pembelian Printer Sekretariat" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                {formErrors.title && <div style={styles.errorText}>{formErrors.title}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Jenis Arus Kas</label>
                <select style={styles.select} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="income">📈 Pemasukan (Income)</option>
                  <option value="expense">📉 Pengeluaran (Expense)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Kategori Anggaran</label>
                <select style={styles.select} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="iuran">Iuran Anggota</option>
                  <option value="konsumsi">Konsumsi</option>
                  <option value="transport">Transportasi</option>
                  <option value="donasi">Donasi / Hibah</option>
                  <option value="operasional">Operasional Kerja</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nominal Transaksi (Rp)</label>
                <input type="number" style={styles.input} placeholder="Masukkan angka tanpa titik/koma" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                {formErrors.amount && <div style={styles.errorText}>{formErrors.amount}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tanggal Transaksi</label>
                <input type="date" style={styles.input} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                {formErrors.date && <div style={styles.errorText}>{formErrors.date}</div>}
              </div>

              <div style={{ ...styles.modalFooter, display: "flex", gap: "12px", marginTop: "25px" }}>
                <button type="button" style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", backgroundColor: "transparent", color: "var(--text-main)", fontWeight: "700", cursor: "pointer" }} onClick={closeModal}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "700", cursor: "pointer" }}>{editingTransaction ? "Simpan Perubahan" : "Simpan Transaksi"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}