import "./SkeletonLoader.css";

function SkeletonLoader() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-container">
        {/* Navbar Skeleton */}
        <div className="skeleton-navbar">
          <div className="skeleton-logo">
            <div className="skeleton-logo-icon"></div>
            <div className="skeleton-logo-text"></div>
          </div>
          <div className="skeleton-nav-links">
            <div className="skeleton-nav-link"></div>
            <div className="skeleton-nav-link"></div>
            <div className="skeleton-nav-link"></div>
            <div className="skeleton-nav-link"></div>
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="skeleton-hero">
          <div className="skeleton-hero-content">
            <div className="skeleton-hero-title"></div>
            <div className="skeleton-hero-subtitle"></div>
            <div className="skeleton-hero-buttons">
              <div className="skeleton-btn skeleton-btn-primary"></div>
              <div className="skeleton-btn skeleton-btn-outline"></div>
            </div>
          </div>
        </div>

        {/* Features Section Skeleton */}
        <div className="skeleton-features">
          <div className="skeleton-section-header">
            <div className="skeleton-section-title"></div>
            <div className="skeleton-section-subtitle"></div>
          </div>
          <div className="skeleton-features-grid">
            <div className="skeleton-feature-card">
              <div className="skeleton-feature-icon"></div>
              <div className="skeleton-feature-title"></div>
              <div className="skeleton-feature-text"></div>
              <div className="skeleton-feature-text short"></div>
            </div>
            <div className="skeleton-feature-card">
              <div className="skeleton-feature-icon"></div>
              <div className="skeleton-feature-title"></div>
              <div className="skeleton-feature-text"></div>
              <div className="skeleton-feature-text short"></div>
            </div>
            <div className="skeleton-feature-card">
              <div className="skeleton-feature-icon"></div>
              <div className="skeleton-feature-title"></div>
              <div className="skeleton-feature-text"></div>
              <div className="skeleton-feature-text short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
