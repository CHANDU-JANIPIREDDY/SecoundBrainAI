import { useState } from "react";
import { askAI } from "../services/Api";
import PageTransition from "../components/PageTransition";
import "./AskAI.css";

function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await askAI(question);
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error: " + (error.response?.data?.error || error.message));
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

  const formatAnswer = (text) => {
    const cleaned = cleanMarkdown(text);
    return cleaned.split("\n\n").map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  return (
    <div className="askai-page">
      <div className="askai-container">
        <div className="askai-header">
          <h1>Ask Your Knowledge Base</h1>
          <p>Get intelligent answers from your notes and insights</p>
        </div>

        <form onSubmit={handleSubmit} className="askai-form">
          <div className="form-group">
            <label htmlFor="question">Your Question</label>
            <textarea
              id="question"
              placeholder="What would you like to know about your notes?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="ask-textarea"
              rows="6"
            />
          </div>

          <button 
            type="submit" 
            className="ask-button"
            disabled={loading}
          >
            {loading ? (
              <span className="button-loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                Thinking...
              </span>
            ) : (
              "Ask AI"
            )}
          </button>
        </form>

        {answer && (
          <div className="answer-section">
            <div className="answer-header">
              <span className="answer-icon">🧠</span>
              <h2>AI Response</h2>
            </div>
            <div className="answer-content">
              {formatAnswer(answer)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AskAI;
