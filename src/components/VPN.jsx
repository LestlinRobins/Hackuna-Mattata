// File: src/components/VPN.jsx
import { useState } from "react";
import "../styles/VPN.css";

const VPN = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("automatic");

  const locations = [
    { id: "automatic", name: "Automatic", flag: "🌐", ping: "12 ms" },
    { id: "us", name: "United States", flag: "🇺🇸", ping: "45 ms" },
    { id: "uk", name: "United Kingdom", flag: "🇬🇧", ping: "78 ms" },
    { id: "jp", name: "Japan", flag: "🇯🇵", ping: "120 ms" },
    { id: "de", name: "Germany", flag: "🇩🇪", ping: "65 ms" },
  ];

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="vpn">
      <h1>Secure VPN</h1>

      <div className="connection-status">
        <div
          className={`status-indicator ${
            isConnected ? "connected" : "disconnected"
          }`}
        >
          <div className="indicator-ripple"></div>
        </div>
        <div className="status-info">
          <h2>{isConnected ? "Connected" : "Disconnected"}</h2>
          {isConnected && (
            <p>
              Via {locations.find((loc) => loc.id === selectedLocation).name}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={toggleConnection}
        className={`connection-button ${
          isConnected ? "disconnect" : "connect"
        }`}
      >
        {isConnected ? "Disconnect" : "Connect Now"}
      </button>

      <div className="location-selector">
        <h3>Select Location</h3>
        <div className="location-list">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`location-item ${
                selectedLocation === location.id ? "selected" : ""
              }`}
              onClick={() => setSelectedLocation(location.id)}
            >
              <div className="location-flag">{location.flag}</div>
              <div className="location-details">
                <h4>{location.name}</h4>
                <p className="ping">Ping: {location.ping}</p>
              </div>
              {selectedLocation === location.id && (
                <div className="selected-check">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="vpn-stats">
        <div className="stat-item">
          <p className="stat-value">1.45 GB</p>
          <p className="stat-label">Downloaded</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">428 MB</p>
          <p className="stat-label">Uploaded</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">3h 42m</p>
          <p className="stat-label">Connected</p>
        </div>
      </div>
    </div>
  );
};

export default VPN;
