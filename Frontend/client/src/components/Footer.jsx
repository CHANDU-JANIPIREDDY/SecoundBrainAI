import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-brand">
              <span className="footer-logo">🧠</span>
              <h3>Second Brain</h3>
            </div>
            <p className="footer-description">
              Your personal AI-powered knowledge management system.
              Capture ideas, organize notes, and unlock insights.
            </p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul className="footer-links">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/add">Add Note</Link>
              </li>
              <li>
                <Link to="/ask">Ask AI</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="#documentation">Documentation</a>
              </li>
              <li>
                <a href="#api">API</a>
              </li>
              <li>
                <a href="#support">Support</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Connect</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:cjanipireddy@gmail.com">Email</a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/chandu-janipireddy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/CHANDU-JANIPIREDDY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            © {currentYear} Second Brain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
