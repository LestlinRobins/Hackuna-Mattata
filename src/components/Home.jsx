// File: src/components/Home.jsx
import { useState } from "react";
import "../styles/Home.css";
import FakeIdentity from "./Identity";

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
    return (
      <FakeIdentity onBack={handleBackClick} onConfirm={handleConfirmClick} />
    );
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
            <img
              src="https://drive.google.com/thumbnail?id=1PZT1Cp52D7cMhvishy1EAiFFAJLEEpYr"
              alt="Avatar 1"
            />
          </div>
          <div className="avatar-item selected">
            <img
              src="https://drive.google.com/thumbnail?id=13U3ngsvMSIZka-F_QpwFXlShBFx1Vztc"
              alt="Avatar 2"
            />
          </div>
          <div className="avatar-item">
            <img
              src="https://drive.google.com/thumbnail?id=1B9nuGmEG19nbdq2Sm0ygifbksomW4tm8"
              alt="Avatar 3"
            />
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
