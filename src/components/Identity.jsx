// File: src/components/Identity.jsx
import { useState } from "react";
import "../styles/Identity.css";

const Identity = ({ onBack, onConfirm }) => {
  const [name, setName] = useState("Racheal");
  const [email, setEmail] = useState("racheal4u@anyname.com");
  const [phone, setPhone] = useState("9876543210");

  return (
    <div className="identity">
      <header className="header">
        <h1>Anyname</h1>
        <div className="settings-icon">⚙️</div>
      </header>

      <div className="success-banner">
        <div className="status-icon">✓</div>
        <p>Fake ID Successfully Generated</p>
      </div>

      <div className="profile-container">
        <div className="avatar-container">
          <img
            src="https://drive.google.com/thumbnail?id=1B9nuGmEG19nbdq2Sm0ygifbksomW4tm8"
            alt="Avatar"
            className="selected-avatar"
          />
        </div>

        <h2 className="profile-name">{name}</h2>

        <div className="profile-details">
          <p className="detail-item">Email : {email}</p>
          <p className="detail-item">Phone : {phone}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="change-button" onClick={onBack}>
          Change
        </button>
        <button className="confirm-button" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Identity;
