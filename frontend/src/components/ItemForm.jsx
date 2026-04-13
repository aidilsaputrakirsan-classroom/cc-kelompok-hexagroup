import { useState } from 'react';

export default function ItemForm({ onSubmit, type = 'transaction' }) {
  const [formData, setFormData] = useState({
    type: type === 'transaction' ? 'income' : '',
    category: '',
    amount: '',
    description: '',
    title: '',
    letterType: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        type: type === 'transaction' ? 'income' : '',
        category: '',
        amount: '',
        description: '',
        title: '',
        letterType: '',
        content: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.iconCircle}>
              {type === 'transaction' ? '💰' : '📝'}
            </div>
            <h3 style={styles.title}>
              {type === 'transaction' ? 'Tambah Transaksi' : 'Buat Surat Baru'}
            </h3>
            <p style={styles.subtitle}>
              {type === 'transaction' 
                ? 'Catat arus kas masuk atau keluar dengan detail.' 
                : 'Isi formulir untuk pengajuan administrasi.'}
            </p>
          </div>

          {/* FORM */}
          <div style={styles.inputGrid}>
            {type === 'transaction' ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipe Arus</label>
                  <select name="type" value={formData.type} onChange={handleChange} required style={styles.input}>
                    <option value="income">📈 Pemasukan</option>
                    <option value="expense">📉 Pengeluaran</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Kategori</label>
                  <select name="category" value={formData.category} onChange={handleChange} required style={styles.input}>
                    <option value="">Pilih Kategori</option>
                    <option value="Salary">Salary / Iuran</option>
                    <option value="Food">Food / Konsumsi</option>
                    <option value="Transport">Transportasi</option>
                    <option value="Utilities">Utilities / Listrik</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>

                <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
                  <label style={styles.label}>Nominal</label>
                  <div style={styles.amountWrapper}>
                    <span style={styles.currencyPrefix}>Rp</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      placeholder="0"
                      style={styles.amountInput}
                    />
                  </div>
                </div>

                <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
                  <label style={styles.label}>Keterangan</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Bayar hosting website"
                    style={styles.input}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
                  <label style={styles.label}>Judul Surat</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan perihal surat..."
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
                  <label style={styles.label}>Jenis Surat</label>
                  <select name="letterType" value={formData.letterType} onChange={handleChange} required style={styles.input}>
                    <option value="">Pilih Tipe</option>
                    <option value="leave">Izin / Cuti</option>
                    <option value="promotion">Pengajuan Promosi</option>
                    <option value="complaint">Keluhan / Kritik</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
                  <label style={styles.label}>Isi Konten</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="Tuliskan isi surat Anda secara lengkap..."
                    rows="5"
                    style={{ ...styles.input, ...styles.textarea }}
                  />
                </div>
              </>
            )}
          </div>

          {/* BUTTON */}
          <button 
            type="submit" 
            style={loading ? {...styles.submitBtn, ...styles.btnDisabled} : styles.submitBtn} 
            disabled={loading}
          >
            {loading ? (
              <div style={styles.loaderContainer}>
                <div style={styles.spinner}></div>
                <span>Memproses...</span>
              </div>
            ) : (
              `Simpan ${type === 'transaction' ? 'Transaksi' : 'Surat'}`
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
    padding: '40px 0'
  },

  cardContainer: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '0 20px',
  },

  form: {
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(20px)',
    padding: '45px',
    borderRadius: '28px',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '34px',
    margin: '0 auto 20px',
    color: '#fff',
    boxShadow: '0 15px 30px rgba(99,102,241,0.4)',
  },

  title: {
    fontSize: '30px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '8px',
  },

  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '35px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },

  input: {
    padding: '14px 18px',
    borderRadius: '14px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    outline: 'none',
  },

  textarea: {
    resize: 'none',
  },

  amountWrapper: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '14px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    padding: '0 16px',
  },

  currencyPrefix: {
    fontWeight: '700',
    color: '#6366f1',
    marginRight: '10px',
  },

  amountInput: {
    flex: 1,
    padding: '14px 0',
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    fontWeight: '700',
    outline: 'none',
  },

  submitBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#fff',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    boxShadow: '0 15px 25px rgba(99,102,241,0.35)',
  },

  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  spinner: {
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

// animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin { to { transform: rotate(360deg); } }
    input:focus, select:focus, textarea:focus {
      border-color: #6366f1 !important;
      background-color: #fff !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
    }
  `;
  document.head.appendChild(styleSheet);
}