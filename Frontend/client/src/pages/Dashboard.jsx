import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getNotes } from "../services/Api";
import PageTransition from "../components/PageTransition";
import "./Dashboard.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const cleanMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/^\s*-\s*/gm, "")
      .replace(/^\s*\*\s*/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const getTypeBadge = (type) => {
    const typeLabels = {
      note: "Note",
      link: "Link",
      insight: "Insight",
    };
    return (
      <span className={`type-badge type-${type}`}>
        {typeLabels[type] || type}
      </span>
    );
  };

  const truncateContent = (content, maxLength = 150) => {
    const cleaned = cleanMarkdown(content);
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + "...";
  };

  const filteredNotes = notes.filter((note) => {
    const search = searchTerm.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(search);
    const contentMatch = note.content.toLowerCase().includes(search);
    const tagsMatch = note.tags && note.tags.some((tag) => tag.toLowerCase().includes(search));
    return titleMatch || contentMatch || tagsMatch;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-content">
          <div className="dashboard-header">
            <h2 className="page-title">Dashboard</h2>
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm("")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="empty-state"
            >
              <div className="empty-icon">📝</div>
              <h3>No notes yet</h3>
              <p>Start building your second brain by adding your first note!</p>
            </motion.div>
          ) : filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="no-results"
            >
              <div className="no-results-icon">🔍</div>
              <h3>No notes found</h3>
              <p>Try adjusting your search term to find what you're looking for.</p>
            </motion.div>
          ) : (
            <motion.div
              className="notes-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  className="note-card"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.03,
                    y: -6,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                >
                  <div className="note-card-header">
                    <h3 className="note-title">{cleanMarkdown(note.title)}</h3>
                    {getTypeBadge(note.type)}
                  </div>
                  <p className="note-content">{truncateContent(note.content)}</p>
                  {note.summary && (
                    <div className="note-summary">
                      <span className="summary-label">Summary</span>
                      <p className="summary-text">{cleanMarkdown(note.summary)}</p>
                    </div>
                  )}
                  {note.tags && note.tags.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="note-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="note-footer">
                    <span className="note-date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Dashboard;
