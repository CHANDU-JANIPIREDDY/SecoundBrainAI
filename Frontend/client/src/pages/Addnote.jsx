import { useState } from "react";
import { createNote } from "../services/Api";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import "./AddNote.css";

function AddNote() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "note",
    tags: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      await createNote({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        tags: tagsArray,
      });

      setIsError(false);
      setMessage("Note created successfully!");
      setFormData({ title: "", content: "", type: "note", tags: "" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      setIsError(true);
      setMessage(
        "Error creating note: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-note-page">
      <div className="add-note-container">
        <div className="add-note-header">
          <h1>Create New Note</h1>
          <p>Capture your thoughts, ideas, and insights</p>
        </div>

        <form onSubmit={handleSubmit} className="add-note-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your note content here..."
              value={formData.content}
              onChange={handleChange}
              required
              className="form-textarea"
              rows="8"
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-option ${formData.type === "note" ? "active" : ""}`}
                onClick={() => handleTypeChange("note")}
              >
                Note
              </button>
              <button
                type="button"
                className={`type-option ${formData.type === "link" ? "active" : ""}`}
                onClick={() => handleTypeChange("link")}
              >
                Link
              </button>
              <button
                type="button"
                className={`type-option ${formData.type === "insight" ? "active" : ""}`}
                onClick={() => handleTypeChange("insight")}
              >
                Insight
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              name="tags"
              placeholder="e.g. work, ideas, learning (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Note"}
          </button>
        </form>

        {message && (
          <div className={`alert-message ${isError ? "error" : "success"}`}>
            <span className="alert-icon">{isError ? "⚠️" : "✅"}</span>
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddNote;
