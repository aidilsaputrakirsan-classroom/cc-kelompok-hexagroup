export default function ItemCard({ item, type = 'transaction', onDelete, onUpdate, user }) {
  // Cek hak akses (Hanya Ketua, Bendahara, atau Sekretaris yang bisa aksi, Anggota View Only)
  const canAction = user?.role !== "anggota";

  const isTransaction = type === 'transaction';

  return (
    <div 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
      }}
    >
      <div style={styles.cardBody}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <h4 style={styles.title}>
              {isTransaction ? item.description : item.title}
            </h4>
            <span style={styles.date}>
              📅 {new Date(item.created_at || item.date).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'short', year: 'numeric' 
              })}
            </span>
          </div>
          
          <div style={{
            ...styles.badge,
            ...(isTransaction 
                ? (item.type === 'income' ? styles.incomeBadge : styles.expenseBadge)
                : styles.statusBadge(item.status))
          }}>
            {isTransaction 
              ? `${item.type === 'income' ? '▲' : '▼'} Rp ${item.amount.toLocaleString()}`
              : item.status.toUpperCase()}
          </div>
        </div>

        <div style={styles.infoRow}>
          {isTransaction ? (
            item.category && <span style={styles.tag}>🏷️ {item.category}</span>
          ) : (
            <>
              {item.letter_type && <span style={styles.tag}>📂 {item.letter_type}</span>}
              <p style={styles.contentPreview}>
                {item.content.substring(0, 80)}...
              </p>
            </>
          )}
        </div>

        {/* Action Buttons - Hanya muncul jika punya akses dan status memungkinkan */}
        {canAction && (
          <div style={styles.actions}>
            {(!isTransaction && item.status === 'draft') || isTransaction ? (
              <>
                {!isTransaction && (
                   <button onClick={() => onUpdate(item.id)} style={styles.editBtn}>
                     ✏️ Edit
                   </button>
                )}
                <button 
                  onClick={() => onDelete(item.id)} 
                  style={styles.deleteBtn}
                >
                  🗑️ Delete
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardBody: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: '-0.025em',
  },
  date: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  incomeBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  expenseBadge: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  statusBadge: (status) => {
    const colors = {
      draft: { bg: '#e0e7ff', text: '#4338ca' },
      submitted: { bg: '#fef3c7', text: '#b45309' },
      approved: { bg: '#dcfce7', text: '#15803d' },
      rejected: { bg: '#fee2e2', text: '#b91c1c' },
    };
    const color = colors[status] || { bg: '#f1f5f9', text: '#475569' };
    return { backgroundColor: color.bg, color: color.text };
  },
  infoRow: {
    marginBottom: '15px',
  },
  tag: {
    fontSize: '11px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: '600',
    border: '1px solid #f1f5f9',
  },
  contentPreview: {
    margin: '10px 0 0 0',
    fontSize: '13px',
    lineHeight: '1.5',
    color: '#475569',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    paddingTop: '15px',
    borderTop: '1px solid #f1f5f9',
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    color: '#4f46e5',
    padding: '8px',
    border: '1px solid #e0e7ff',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    padding: '8px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.2s',
  },
};