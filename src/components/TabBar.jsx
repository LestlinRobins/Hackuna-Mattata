// File: src/components/TabBar.jsx
import {
  FiHome,
  FiMessageSquare,
  FiGlobe,
  FiShield,
  FiInfo,
  FiPhoneCall,
  FiPhone,
} from "react-icons/fi";
import "../styles/TabBar.css";

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", icon: <FiHome />, label: "Home" },
    { id: "chat", icon: <FiMessageSquare />, label: "Chat" },
    { id: "browser", icon: <FiGlobe />, label: "Browser" },
    { id: "vpn", icon: <FiPhoneCall />, label: "Call" },
    { id: "info", icon: <FiInfo />, label: "Info" },
  ];

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="tab-icon">{tab.icon}</div>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
