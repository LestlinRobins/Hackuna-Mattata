// File: src/components/Home.jsx
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home">
      <header className="header">
        <h1>
          Secure<span className="accent">Link</span>
        </h1>
        <p className="tagline">Your privacy matters</p>
      </header>

      <div className="status-card">
        <div className="status-icon protected">
          <span className="status-check">✓</span>
        </div>
        <div className="status-info">
          <h2>Protected</h2>
          <p>Your connection is secure</p>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-item">
          <h3>Privacy Score</h3>
          <div className="score-circle">98</div>
          <p>Excellent protection</p>
        </div>

        <div className="feature-item">
          <h3>Data Saved</h3>
          <div className="data">
            <p className="data-value">1.2</p>
            <p className="data-unit">GB</p>
          </div>
          <p>This month</p>
        </div>

        <div className="feature-item">
          <h3>Threats Blocked</h3>
          <p className="threat-value">247</p>
          <p>Last 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
