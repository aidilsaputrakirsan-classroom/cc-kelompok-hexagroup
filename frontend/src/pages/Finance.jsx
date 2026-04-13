import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { financeAPI } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export const Finance = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [transRes, summaryRes] = await Promise.all([
        financeAPI.getTransactions(),
        financeAPI.getSummary(),
      ])
      setTransactions(transRes.data)
      setSummary(summaryRes.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || '' : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await financeAPI.createTransaction(formData)
      setFormData({ type: 'income', amount: '', description: '', category: '' })
      setShowForm(false)
      loadData()
    } catch (err) {
      setError('Failed to create transaction')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await financeAPI.deleteTransaction(id)
      loadData()
    } catch (err) {
      setError('Failed to delete transaction')
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>

      <h1>Finance Management</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginBottom: '30px',
          }}
        >
          <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
            <h3>Income</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              ${summary.income.toFixed(2)}
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '5px' }}>
            <h3>Expenses</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              ${summary.expenses.toFixed(2)}
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
            <h3>Balance</h3>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: summary.balance >= 0 ? 'green' : 'red',
              }}
            >
              ${summary.balance.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {showForm ? 'Cancel' : 'Add Transaction'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <label>Type: </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              style={{ marginLeft: '10px', padding: '8px' }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Amount: </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              required
              style={{ marginLeft: '10px', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Description: </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Category: </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}>
            Create Transaction
          </button>
        </form>
      )}

      <h2>Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Amount</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '5px 10px',
                      backgroundColor: t.type === 'income' ? '#e8f5e9' : '#ffebee',
                      borderRadius: '3px',
                    }}
                  >
                    {t.type}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>${t.amount.toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{t.description || '-'}</td>
                <td style={{ padding: '10px' }}>{t.category || '-'}</td>
                <td style={{ padding: '10px' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
