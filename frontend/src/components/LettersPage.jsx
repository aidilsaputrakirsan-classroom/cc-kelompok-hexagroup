import { useState, useEffect } from "react";
import { letterAPI } from "../services/api";

function LettersPage({ user, showToast }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    letterType: "",
    content: "",
  });

  const canCreate = user.role === "sekretaris" || user.role === "ketua";

  useEffect(() => {
    loadLetters();
  }, [statusFilter]);

  const loadLetters = async () => {
    try {
      setLoading(true);
      const data = await letterAPI.getLetters(statusFilter);
      setLetters(data);
    } catch (err) {
      showToast(err.message, "error"); // ❌
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.letterType || !formData.content) {
        showToast("Semua field harus diisi", "error");
        return;
      }

      if (editingId) {
        await letterAPI.updateLetter(editingId, {
          title: formData.title,
          letter_type: formData.letterType,
          content: formData.content,
        });

        showToast("Surat berhasil diupdate", "success"); // ✅
      } else {
        await letterAPI.createLetter(
          formData.title,
          formData.letterType,
          formData.content
        );

        showToast("Surat berhasil dibuat", "success"); // ✅
      }

      setFormData({
        title: "",
        letterType: "",
        content: "",
      });

      setShowForm(false);
      setEditingId(null);
      loadLetters();
    } catch (err) {
      showToast(err.message, "error"); // ❌
    }
  };

  const handleEditLetter = (letter) => {
    setEditingId(letter.id);
    setFormData({
      title: letter.title,
      letterType: letter.letter_type,
      content: letter.content,
    });
    setShowForm(true);
  };

  const handleApproveLetter = async (id) => {
    try {
      await letterAPI.approveLetter(id);
      showToast("Surat berhasil disetujui", "success"); // ✅
      loadLetters();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRejectLetter = async (id) => {
    try {
      await letterAPI.rejectLetter(id);
      showToast("Surat berhasil ditolak", "success"); // ✅
      loadLetters();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSubmitLetter = async (id) => {
    try {
      await letterAPI.submitLetter(id);
      showToast("Surat berhasil dikirim", "success"); // ✅
      loadLetters();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus surat ini?")) {
      try {
        await letterAPI.deleteLetter(id);
        showToast("Surat berhasil dihapus", "success"); // ✅
        loadLetters();
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Letters Management</h2>

      {canCreate && (
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Letter"}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <input
            placeholder="Type"
            value={formData.letterType}
            onChange={(e) =>
              setFormData({ ...formData, letterType: e.target.value })
            }
          />

          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />

          <button type="submit">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        letters.map((l) => (
          <div key={l.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <h4>{l.title}</h4>
            <p>{l.content}</p>
            <p>Status: {l.status}</p>

            {canCreate && (
              <>
                <button onClick={() => handleEditLetter(l)}>Edit</button>
                <button onClick={() => handleSubmitLetter(l.id)}>Submit</button>
                <button onClick={() => handleApproveLetter(l.id)}>Approve</button>
                <button onClick={() => handleRejectLetter(l.id)}>Reject</button>
                <button onClick={() => handleDelete(l.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default LettersPage;