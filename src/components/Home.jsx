// File: src/components/Home.jsx
import { useState, useEffect } from "react";
import "../styles/Home.css";
import Identity from "./Identity";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import FakeIdentity from "./Identity";
import { supabase } from "../supabase";

const Home = () => {
  const [showIdentity, setShowIdentity] = useState(false);
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const fetchLastRow = async () => {
    try {
      const { data, error } = await supabase
        .from("identities")
        .select("id, name, email, phone, expires_at, avatar")
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Last row data:", data[0]);
        setFetchedData(data[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call the function to fetch the last row when the component mounts
  useEffect(() => {
    fetchLastRow();
  }, []);
  const handleCreateClick = () => {
    if (selectedImage === "") {
      alert("Select an Avatar.");
    } else {
      setShowIdentity(true);
    }
  };

  const handleBackClick = () => {
    setShowIdentity(false);
  };

  const handleConfirmClick = () => {
    setShowIdentity(false);
    // You can add additional logic here if needed
  };

  const avatarImages = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
  };

  const handleAvatarClick = (imageKey) => {
    setSelectedImage(imageKey);
    setImage(avatarImages[imageKey]);
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
        <p className="subtitle">Identities are just a click away</p>

        <div className="avatar-grid">
          <div
            className={`avatar-item ${
              selectedImage === "avatar1" ? "selected" : ""
            }`}
            onClick={() => handleAvatarClick("avatar1")}
          >
            <img src={avatar1} alt="Avatar 1" />
          </div>
          <div
            className={`avatar-item ${
              selectedImage === "avatar2" ? "selected" : ""
            }`}
            onClick={() => handleAvatarClick("avatar2")}
          >
            <img src={avatar2} alt="Avatar 2" />
          </div>
          <div
            className={`avatar-item ${
              selectedImage === "avatar3" ? "selected" : ""
            }`}
            onClick={() => handleAvatarClick("avatar3")}
          >
            <img src={avatar3} alt="Avatar 3" />
          </div>
        </div>

        <button className="create-button" onClick={handleCreateClick}>
          Create
        </button>
      </div>
      <div className="current-person">
        <h2>Your current persona</h2>
        <img src={avatar1}></img>

        <p className="current-person-data-placeholder">
          ID:
          <p className="current-person-data">{fetchedData.id}</p>
        </p>
        <p className="current-person-data-placeholder">
          Name:
          <p className="current-person-data">{fetchedData.name}</p>
        </p>
        <p className="current-person-data-placeholder">
          Email:
          <p className="current-person-data">{fetchedData.email}</p>
        </p>
        <p className="current-person-data-placeholder">
          Phone:
          <p className="current-person-data">{fetchedData.phone}</p>
        </p>
      </div>
    </div>
  );
};

export default Home;
