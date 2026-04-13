import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import ItemForm from './ItemForm'
import ItemCard from './ItemCard'
import { financeAPI, letterAPI } from '../services/api'

export default function ItemList({ user }) {
  const [activeTab, setActiveTab] = useState('finance')
  const [transactions, setTransactions] = useState([])
  const [letters, setLetters] = useState([])
  const [summary, setSummary] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'finance') {
      loadTransactions()
    } else {
      loadLetters()
    }
  }, [activeTab])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const response = await financeAPI.getTransactions()
      setTransactions(response.transactions)
      setSummary(response.summary)
    } catch (err) {
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadLetters = async () => {
    setLoading(true)
    try {
      const response = await letterAPI.getLetters()
      setLetters(response.letters)
    } catch (err) {
      console.error('Error loading letters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (formData) => {
    try {
      await financeAPI.createTransaction(
        formData.type,
        formData.category,
        parseFloat(formData.amount),
        formData.description
      )
      loadTransactions()
    } catch (err) {
      console.error('Error adding transaction:', err)
    }
  }

  const handleAddLetter = async (formData) => {
    try {
      await letterAPI.createLetter(
        formData.title,
        formData.letterType,
        formData.content
      )
      loadLetters()
    } catch (err) {
      console.error('Error adding letter:', err)
    }
  }

  const handleDeleteTransaction = async (id) => {
    try {
      await financeAPI.deleteTransaction(id)
      loadTransactions()
    } catch (err) {
      console.error('Error deleting transaction:', err)
    }
  }

  const handleDeleteLetter = async (id) => {
    try {
      await letterAPI.deleteLetter(id)
      loadLetters()
    } catch (err) {
      console.error('Error deleting letter:', err)
    }
  }

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  const filteredLetters = letters.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('finance')}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === 'finance' ? '#3498db' : '#ddd',
            color: activeTab === 'finance' ? 'white' : '#333',
          }}
        >
          Finance
        </button>
        <button
          onClick={() => setActiveTab('letters')}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === 'letters' ? '#3498db' : '#ddd',
            color: activeTab === 'letters' ? 'white' : '#333',
          }}
        >
          Letters
        </button>
      </div>

      {activeTab === 'finance' ? (
        <div style={styles.content}>
          <ItemForm onSubmit={handleAddTransaction} type="transaction" />
          
          {summary.balance !== undefined && (
            <div style={styles.summary}>
              <div style={styles.summaryItem}>
                <span>Income: ${summary.total_income.toFixed(2)}</span>
              </div>
              <div style={styles.summaryItem}>
                <span>Expense: ${summary.total_expense.toFixed(2)}</span>
              </div>
              <div style={styles.summaryItem}>
                <span>Balance: ${summary.balance.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          <SearchBar onSearch={setSearch} />
          
          {loading ? (
            <p>Loading...</p>
          ) : filteredTransactions.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            filteredTransactions.map(t => (
              <ItemCard
                key={t.id}
                item={t}
                type="transaction"
                onDelete={handleDeleteTransaction}
              />
            ))
          )}
        </div>
      ) : (
        <div style={styles.content}>
          <ItemForm onSubmit={handleAddLetter} type="letter" />
          
          <SearchBar onSearch={setSearch} />
          
          {loading ? (
            <p>Loading...</p>
          ) : filteredLetters.length === 0 ? (
            <p>No letters found</p>
          ) : (
            filteredLetters.map(l => (
              <ItemCard
                key={l.id}
                item={l}
                type="letter"
                onDelete={handleDeleteLetter}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tabBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  content: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  summaryItem: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
}
