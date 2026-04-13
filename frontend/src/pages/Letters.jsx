import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { letterAPI } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export const Letters = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState(null)
  const [formData, setFormData] = useState({
    letter_type: 'request',
    title: '',
    content: '',
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadLetters()
  }, [filterStatus])

  const loadLetters = async () => {
    try {
      setLoading(true)
      const res = await letterAPI.getLetters(filterStatus)
      setLetters(res.data)
    } catch (err) {
      setError('Failed to load letters')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await letterAPI.updateLetter(editingId, formData)
      } else {
        await letterAPI.createLetter(formData)
      }
      setFormData({ letter_type: 'request', title: '', content: '' })
      setEditingId(null)
      setShowForm(false)
      loadLetters()
    } catch (err) {
      setError('Failed to save letter')
    }
  }

  const handleEdit = (letter) => {
    setFormData({
      letter_type: letter.letter_type,
      title: letter.title,
      content: letter.content,
    })
    setEditingId(letter.id)
    setShowForm(true)
  }

  const handleSubmitLetter = async (id) => {
    if (!window.confirm('Submit this letter?')) return
    try {
      await letterAPI.submitLetter(id)
      loadLetters()
    } catch (err) {
      setError('Failed to submit letter')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this letter?')) return
    try {
      await letterAPI.deleteLetter(id)
      loadLetters()
    } catch (err) {
      setError('Failed to delete letter')
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>

      <h1>Letter Management</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <label>Filter by Status: </label>
        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          style={{ marginLeft: '10px', padding: '8px' }}
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <button
        onClick={() => {
          setShowForm(!showForm)
          if (showForm) {
            setFormData({ letter_type: 'request', title: '', content: '' })
            setEditingId(null)
          }
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {showForm ? 'Cancel' : 'New Letter'}
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
              name="letter_type"
              value={formData.letter_type}
              onChange={handleInputChange}
              style={{ marginLeft: '10px', padding: '8px' }}
            >
              <option value="request">Request</option>
              <option value="report">Report</option>
              <option value="notification">Notification</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ marginLeft: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Content: </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows="8"
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                maxWidth: '600px',
                fontFamily: 'monospace',
              }}
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}>
            {editingId ? 'Update' : 'Create'} Letter
          </button>
        </form>
      )}

      <h2>Letters</h2>
      {letters.length === 0 ? (
        <p>No letters</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {letters.map((letter) => (
              <tr key={letter.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  <span style={{ textTransform: 'capitalize' }}>{letter.letter_type}</span>
                </td>
                <td style={{ padding: '10px' }}>{letter.title}</td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '5px 10px',
                      backgroundColor:
                        letter.status === 'draft'
                          ? '#fff3cd'
                          : letter.status === 'approved'
                          ? '#d4edda'
                          : letter.status === 'rejected'
                          ? '#f8d7da'
                          : '#e7e7e7',
                      borderRadius: '3px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {letter.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{new Date(letter.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>
                  {letter.status === 'draft' && (
                    <>
                      <button
                        onClick={() => handleEdit(letter)}
                        style={{
                          padding: '5px 10px',
                          marginRight: '5px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSubmitLetter(letter.id)}
                        style={{
                          padding: '5px 10px',
                          marginRight: '5px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => handleDelete(letter.id)}
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
                    </>
                  )}
                  {letter.status !== 'draft' && (
                    <button
                      onClick={() => navigate(`/letters/${letter.id}`)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
