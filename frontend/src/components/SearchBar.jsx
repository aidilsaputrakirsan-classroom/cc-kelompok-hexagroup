export default function SearchBar({ onSearch }) {
  const handleChange = (e) => {
    onSearch(e.target.value)
  }

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search transactions or letters..."
        onChange={handleChange}
        style={styles.input}
      />
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
}
