// File: src/components/Home.jsx
import { useState } from "react";
import "../styles/Home.css";
import Identity from "./Identity";

const Home = () => {
  const [showIdentity, setShowIdentity] = useState(false);

  const handleCreateClick = () => {
    setShowIdentity(true);
  };

  const handleBackClick = () => {
    setShowIdentity(false);
  };

  const handleConfirmClick = () => {
    // Handle confirmation logic here
    setShowIdentity(false);
    // You could add additional logic here if needed
  };

  // Render the Identity component if showIdentity is true
  if (showIdentity) {
    return <Identity onBack={handleBackClick} onConfirm={handleConfirmClick} />;
  }

  // Otherwise render the Home component
  return (
    <div className="home">
      <header className="header">
        <h1>Anyname</h1>
        <div className="settings-icon">⚙️</div>
      </header>

      <div className="connection-banner">
        <div className="status-icon">✓</div>
        <p>Your connection is secured</p>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <h2>98</h2>
          <p>Private Score</p>
        </div>

        <div className="stat-item">
          <h2>1.2</h2>
          <p>Data Saved</p>
        </div>

        <div className="stat-item">
          <h2>247</h2>
          <p>Threats Blocked</p>
        </div>
      </div>

      <div className="persona-section">
        <h2>Step into a New Persona</h2>
        <p className="subtitle">identities are just a click away</p>

        <div className="avatar-grid">
          <div className="avatar-item">
            <img src="/avatar1.png" alt="Avatar 1" />
          </div>
          <div className="avatar-item selected">
            <img src="/avatar2.png" alt="Avatar 2" />
          </div>
          <div className="avatar-item">
            <img src="/avatar3.png" alt="Avatar 3" />
          </div>
        </div>

        <button className="create-button" onClick={handleCreateClick}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
