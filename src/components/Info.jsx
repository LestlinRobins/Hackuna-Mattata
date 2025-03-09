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

      <nav className="bottom-navbar">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default Info;
