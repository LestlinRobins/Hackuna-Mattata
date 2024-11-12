// File: src/components/TabBar.jsx
import {
  FiHome,
  FiMessageSquare,
  FiGlobe,
  FiPhone,
  FiInfo,
} from "react-icons/fi";
import "../styles/TabBar.css";

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", icon: <FiHome />, label: "HOME" },
    { id: "chat", icon: <FiMessageSquare />, label: "CHAT" },
    { id: "browser", icon: <FiGlobe />, label: "BROWSER" },
    { id: "call", icon: <FiPhone />, label: "CALL" },
    { id: "info", icon: <FiInfo />, label: "INFO" },
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
