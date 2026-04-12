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
  form: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    display: "none",
  },
  formActive: {
    display: "block",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#f5f5f5",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  actionButton: {
    padding: "6px 12px",
    margin: "0 5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
};

function FinancePage({ user }) {
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

  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const canCreate =
    user && (user.role === "bendahara" || user.role === "ketua");

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
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.category || !formData.amount || !formData.description) {
        showToast("All fields are required", "error");
        return;
      }

      if (editingId) {
        await financeAPI.updateTransaction(editingId, {
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
        });

        showToast("Transaction updated successfully", "success");
      } else {
        await financeAPI.createTransaction(
          formData.type,
          formData.category,
          parseFloat(formData.amount),
          formData.description
        );

        showToast("Transaction added successfully", "success");
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
      showToast(err.message, "error");
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
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await financeAPI.deleteTransaction(id);
        showToast("Transaction deleted successfully", "success");
        loadTransactions();
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  return (
    <div style={styles.container}>
      {toast && (
        <div
          style={{
            ...styles.toast,
            backgroundColor:
              toast.type === "success" ? "#4CAF50" : "#f44336",
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>Finance Management</h2>
        {canCreate && (
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Transaction"}
          </button>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        Balance: ${(summary.balance || 0).toFixed(2)}
      </div>

      {canCreate && showForm && (
        <form
          style={{ ...styles.form, ...styles.formActive }}
          onSubmit={handleSubmit}
        >
          <input name="category" onChange={handleChange} placeholder="Category" />
          <input name="amount" onChange={handleChange} placeholder="Amount" />
          <input name="description" onChange={handleChange} placeholder="Description" />
          <button type="submit">Submit</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td style={styles.td}>{t.category}</td>
                <td style={styles.td}>${t.amount}</td>
                <td>
                  <button onClick={() => handleEditTransaction(t)}>Edit</button>
                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FinancePage;