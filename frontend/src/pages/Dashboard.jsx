import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Welcome, {user?.full_name}!</h2>
        <p>Email: {user?.email}</p>
        {user?.department && <p>Department: {user.department}</p>}
        {user?.position && <p>Position: {user.position}</p>}
        <p>Role: {user?.role}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Services</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <button
            onClick={() => window.location.href = '/finance'}
            style={{
              padding: '15px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Finance Management
          </button>
          <button
            onClick={() => window.location.href = '/letters'}
            style={{
              padding: '15px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Letter Management
          </button>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  )
}
