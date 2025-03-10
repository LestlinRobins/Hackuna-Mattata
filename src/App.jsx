// File: src/App.jsx
import { useState } from "react";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Browser from "./components/Browser";
import Call from "./components/Call";
import Info from "./components/Info";
import TabBar from "./components/TabBar";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "chat":
        return <Chat />;
      case "browser":
        return <Browser />;
      case "call":
        return <Call />;
      case "info":
        return <Info />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <main className="content">{renderContent()}</main>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
