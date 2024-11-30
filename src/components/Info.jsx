import { useState, useEffect } from "react";
import "../styles/Info.css";

const data = {
  Privacy: [
    {
      topic: "VPN",
      description:
        "Encrypts internet traffic and hides your IP address from trackers and ISPs.",
    },
    {
      topic: "Encryption",
      description:
        "Ensures only the sender and recipient can read messages, preventing interception.",
    },
    {
      topic: "Zero-Knowledge",
      description:
        "Companies store your data in a way that even they can't access it.",
    },
    {
      topic: "Incognito Mode",
      description:
        "Hides local history but doesn't prevent tracking by ISPs or websites.",
    },
    {
      topic: "Data Brokers",
      description:
        "Companies that collect and sell your personal data without direct user consent.",
    },
  ],
  Security: [
    {
      topic: "2FA",
      description:
        "Adds an extra security layer, requiring a second form of verification.",
    },
    {
      topic: "Password Managers",
      description:
        "Securely store and generate complex passwords for different accounts.",
    },
    {
      topic: "Biometrics",
      description:
        "Uses fingerprints, facial recognition, or iris scans for security.",
    },
    {
      topic: "Phishing",
      description:
        "Deceptive emails or messages tricking users into giving sensitive information.",
    },
    {
      topic: "Ransomware",
      description:
        "Malware that encrypts your files and demands payment for decryption.",
    },
  ],
  Tracking: [
    {
      topic: "Cookies",
      description:
        "Small files used to track online activity and serve targeted ads.",
    },
    {
      topic: "Fingerprinting",
      description:
        "Collects unique device data to track users without cookies.",
    },
    {
      topic: "Trackers",
      description:
        "First-party trackers are from the website you visit, while third-party ones follow you across sites.",
    },
    {
      topic: "Telemetry",
      description:
        "Data collected by apps and OSs to improve services, sometimes at the cost of privacy.",
    },
    {
      topic: "Opt-Out",
      description:
        "Ways to minimize data collection, such as disabling ad personalization.",
    },
  ],
  Anonymity: [
    {
      topic: "Tor",
      description:
        "Routes traffic through multiple relays to anonymize online activity.",
    },
    {
      topic: "Decentralized Chat",
      description: "Messaging platforms that don't rely on central servers.",
    },
    {
      topic: "Burner Info",
      description:
        "Temporary emails and numbers for signing up without revealing identity.",
    },
    {
      topic: "Self-Hosting",
      description:
        "Running personal cloud storage or email servers to avoid third-party access.",
    },
    {
      topic: "Privacy Coins",
      description: "Cryptocurrencies that prioritize anonymous transactions.",
    },
  ],
  Footprint: [
    {
      topic: "Right to Forget",
      description:
        "Laws allowing users to request data deletion from online services.",
    },
    {
      topic: "Social Privacy",
      description: "Configuring social media settings to limit data exposure.",
    },
    {
      topic: "Account Cleanup",
      description:
        "Removing unused accounts to minimize personal data exposure.",
    },
    {
      topic: "Data Detox",
      description:
        "Reviewing and reducing your online presence for better privacy.",
    },
    {
      topic: "De-Googling",
      description:
        "Using alternatives to Google services to reduce data tracking.",
    },
  ],
};

function Info() {
  const [activeCategory, setActiveCategory] = useState(Object.keys(data)[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedItems, setDisplayedItems] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Show items from the active category when no search term
      setDisplayedItems(data[activeCategory]);
    } else {
      // Search across all categories
      const results = [];

      Object.values(data).forEach((category) => {
        category.forEach((item) => {
          if (
            item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            results.push(item);
          }
        });
      });

      setDisplayedItems(results);
    }
  }, [searchTerm, activeCategory]);

  return (
    <div className="info-container">
      <header className="info-header">
        <h1>Info</h1>
      </header>

      <div className="search-container">
        <div className="search-input">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF3366"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="category-tabs">
        {Object.keys(data).map((category, index) => (
          <button
            key={index}
            className={`category-tab ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(category);
              setSearchTerm("");
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="topics-container">
        {displayedItems.map((item, index) => (
          <div className="topic-card" key={index}>
            <h3>{item.topic}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Info;
