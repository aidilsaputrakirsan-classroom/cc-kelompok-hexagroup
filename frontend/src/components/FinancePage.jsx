import { useState, useEffect } from "react";
import { financeAPI } from "../services/api";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

function FinancePage({ user, showToast }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
  });

  const canCreate = user.role === "bendahara" || user.role === "ketua";

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const transData = await financeAPI.getTransactions();
      const summaryData = await financeAPI.getSummary();
      setTransactions(transData);
      setSummary(summaryData);
    } catch (err) {
      showToast(err.message, "error"); // ❌ ERROR TOAST
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.category || !formData.amount || !formData.description) {
        showToast("Semua field harus diisi", "error");
        return;
      }

      if (editingId) {
        await financeAPI.updateTransaction(editingId, {
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
        });

        showToast("Berhasil update transaksi", "success"); // ✅
      } else {
        await financeAPI.createTransaction(
          formData.type,
          formData.category,
          parseFloat(formData.amount),
          formData.description
        );

        showToast("Berhasil tambah transaksi", "success"); // ✅
      }

      setFormData({
        type: "income",
        category: "",
        amount: "",
        description: "",
      });

      setShowForm(false);
      setEditingId(null);
      loadTransactions();
    } catch (err) {
      showToast(err.message, "error"); // ❌
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus data?")) {
      try {
        await financeAPI.deleteTransaction(id);
        showToast("Berhasil hapus transaksi", "success"); // ✅
        loadTransactions();
      } catch (err) {
        showToast(err.message, "error"); // ❌
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Finance Management</h2>
        {canCreate && (
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Transaction"}
          </button>
        )}
      </div>

      {canCreate && showForm && (
        <form onSubmit={handleSubmit}>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              {t.category} - ${t.amount}
              {canCreate && (
                <>
                  <button onClick={() => handleEditTransaction(t)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FinancePage;