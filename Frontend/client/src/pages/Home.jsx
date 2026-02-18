import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import "./Home.css";

function Home() {
  return (
    <PageTransition>
      <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content-wrapper">
            <h1 className="hero-title">
              Design Your AI-Powered Knowledge System
            </h1>
            <p className="hero-subtitle">
              Capture ideas with clarity.
              Transform information into structured insight.
              Access intelligent answers instantly.
            </p>
            <div className="hero-cta">
              <Link to="/add" className="btn-primary">Get Started</Link>
              <Link to="/dashboard" className="btn-outline">View Dashboard</Link>
            </div>
          </div>

          <div className="hero-illustration-wrapper">
            <svg className="main-circle" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" fill="none"/>
              <circle cx="200" cy="200" r="140" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" fill="none"/>
              <circle cx="200" cy="200" r="100" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" fill="none"/>
              <circle cx="200" cy="200" r="60" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="1" fill="none"/>
              <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1"/>
              <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1"/>
              <line x1="73" y1="73" x2="327" y2="327" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1"/>
              <line x1="327" y1="73" x2="73" y2="327" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1"/>
              <circle cx="200" cy="200" r="25" fill="rgba(99, 102, 241, 0.3)"/>
              <circle cx="200" cy="80" r="6" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="320" cy="200" r="6" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="200" cy="320" r="6" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="80" cy="200" r="6" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="280" cy="120" r="5" fill="rgba(168, 85, 247, 0.4)"/>
              <circle cx="120" cy="120" r="5" fill="rgba(168, 85, 247, 0.4)"/>
              <circle cx="120" cy="280" r="5" fill="rgba(168, 85, 247, 0.4)"/>
              <circle cx="280" cy="280" r="5" fill="rgba(168, 85, 247, 0.4)"/>
            </svg>

            {/* Orbit Container - Clockwise */}
            <div className="orbit-container orbit-cw">
              <div className="orbit-icon orbit-icon-1">
                <img src="/assets/icons/neural-network.svg" alt="Neural Network" className="orbit-img" />
              </div>
              <div className="orbit-icon orbit-icon-2">
                <img src="/assets/icons/ai-chip.svg" alt="AI Chip" className="orbit-img" />
              </div>
              <div className="orbit-icon orbit-icon-3">
                <img src="/assets/icons/machine-learning.svg" alt="Machine Learning" className="orbit-img" />
              </div>
            </div>

            {/* Orbit Container - Counter Clockwise */}
            <div className="orbit-container orbit-ccw">
              <div className="orbit-icon orbit-icon-4">
                <img src="/assets/icons/data-analysis.svg" alt="Data Analysis" className="orbit-img" />
              </div>
              <div className="orbit-icon orbit-icon-5">
                <img src="/assets/icons/knowledge-graph.svg" alt="Knowledge Graph" className="orbit-img" />
              </div>
            </div>

            {/* Floating AI Symbols */}
            <div className="floating-symbols">
              <div className="floating-symbol symbol-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z"/>
                  <path d="M9 12a3 3 0 106 0 3 3 0 00-6 0z"/>
                </svg>
              </div>
              <div className="floating-symbol symbol-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3"/>
                  <circle cx="6" cy="6" r="2"/>
                  <circle cx="18" cy="6" r="2"/>
                  <circle cx="6" cy="18" r="2"/>
                  <circle cx="18" cy="18" r="2"/>
                  <line x1="8.5" y1="8.5" x2="10" y2="10"/>
                  <line x1="15.5" y1="8.5" x2="14" y2="10"/>
                  <line x1="8.5" y1="15.5" x2="10" y2="14"/>
                  <line x1="15.5" y1="15.5" x2="14" y2="14"/>
                </svg>
              </div>
              <div className="floating-symbol symbol-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <line x1="6.5" y1="10" x2="6.5" y2="14"/>
                  <line x1="17.5" y1="10" x2="17.5" y2="14"/>
                  <line x1="10" y1="6.5" x2="14" y2="6.5"/>
                  <line x1="10" y1="17.5" x2="14" y2="17.5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              Powerful features to help you organize and retrieve your knowledge effortlessly.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3>Smart Notes</h3>
              <p>Capture thoughts and ideas with automatic AI-generated summaries.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3>Organized Dashboard</h3>
              <p>View and manage all your notes with powerful search and filtering.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3>Ask AI</h3>
              <p>Get intelligent answers from your knowledge base instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Start building your personal knowledge base today.</p>
            <Link to="/add" className="btn-large">Create Your First Note</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
}

export default Home;
