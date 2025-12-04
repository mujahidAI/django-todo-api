// src/components/TodoDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/todo_detail.css";

function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalActions, setModalActions] = useState(null);

  // Fetch todo on load
  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/todos/${id}/`);
      const data = await res.json();

      setTitle(data.title);
      setDescription(data.description || "");
      setIsCompleted(data.is_completed);
    } catch (err) {
      showMessage("Error loading todo.", true);
    }
  };

  // Modal: simple info message
  const showMessage = (message, isError = false) => {
    setModalText(message);
    setModalActions(
      <button
        className="px-4 py-2 rounded bg-indigo-600 text-white"
        onClick={() => setModalVisible(false)}
      >
        OK
      </button>
    );
    setModalVisible(true);
  };

  // Modal: confirmation dialog
  const showConfirmation = (message, callback) => {
    setModalText(message);
    setModalActions(
      <>
        <button
          className="px-4 py-2 rounded bg-gray-200"
          onClick={() => {
            setModalVisible(false);
            callback(false);
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white"
          onClick={() => {
            setModalVisible(false);
            callback(true);
          }}
        >
          Delete
        </button>
      </>
    );
    setModalVisible(true);
  };

  // Update todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showMessage("Title cannot be empty.", true);
      return;
    }

    const payload = {
      title,
      description,
      is_completed: isCompleted,
    };

    try {
      const res = await fetch(`http://localhost:8000/api/todos/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showMessage("To-Do updated successfully!");
      } else {
        showMessage("Error updating todo.", true);
      }
    } catch {
      showMessage("Network error.", true);
    }
  };

  // Delete todo
  const handleDelete = () => {
    showConfirmation("Are you sure you want to delete this item?", async (confirmed) => {
      if (!confirmed) return;

      try {
        const res = await fetch(`http://localhost:8000/api/todos/${id}/`, {
          method: "DELETE",
        });

        if (res.status === 204 || res.ok) {
          showMessage("Deleted! Redirecting...");
          setTimeout(() => navigate("/"), 800);
        } else {
          showMessage("Error deleting todo.", true);
        }
      } catch {
        showMessage("Network error while deleting.", true);
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h1 className="page-title">Edit To-Do Item</h1>

        {/* Modal */}
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <p className="modal-text">{modalText}</p>
              <div className="modal-actions">{modalActions}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input-field"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <textarea
              rows="4"
              className="textarea-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              className="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            <label className="checkbox-label">Completed</label>
          </div>

          <button type="submit" className="btn-primary">
            Update To-Do
          </button>
        </form>

        {/* Buttons */}
        <div className="button-row">
          <button className="btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoDetail;
