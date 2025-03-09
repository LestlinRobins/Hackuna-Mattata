import "../styles/Info.css";

const Info = () => {
  return (
    <div className="info">
      <h1>Privacy Center</h1>

      <div className="info-section">
        <h2>About This App</h2>
        <p>
          This privacy-focused application helps you maintain your online
          privacy and security through secure browsing, encrypted chat, and VPN
          protection.
        </p>
      </div>

      <div className="info-section">
        <h2>Privacy Features</h2>
        <ul className="feature-list">
          <li>End-to-end encrypted messaging</li>
          <li>Secure VPN with multiple locations</li>
          <li>Private browser with tracker blocking</li>
          <li>Data minimization practices</li>
          <li>No logs policy</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Contact</h2>
        <p>
          For support or privacy inquiries, contact us at:
          <br />
          <a href="mailto:support@securelink.app">support@securelink.app</a>
        </p>
      </div>
    </div>
  );
};

export default Info;
