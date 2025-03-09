import React, { useState, useEffect, useRef } from "react";
import "../styles/Browser.css";

const Browser = () => {
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [torStatus, setTorStatus] = useState("disconnected"); // disconnected, connecting, connected
  const iframeRef = useRef(null);

  // Simulate connecting to Tor network
  const connectToTor = () => {
    setTorStatus("connecting");
    setErrorMessage("");

    // Simulate connection time
    setTimeout(() => {
      setTorStatus("connected");
    }, 3000);
  };

  // Disconnect from Tor
  const disconnectFromTor = () => {
    setTorStatus("disconnected");
    setCurrentUrl("");
    // Clear iframe content if it exists
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
  };

  // Handle URL submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url) {
      setErrorMessage("Please enter a URL");
      return;
    }

    if (torStatus !== "connected") {
      setErrorMessage("Please connect to Tor network first");
      return;
    }

    // Process URL (add https:// if missing)
    let processedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = "https://" + url;
    }

    setIsLoading(true);
    setErrorMessage("");

    // Simulate page loading
    setTimeout(() => {
      setCurrentUrl(processedUrl);
      setIsLoading(false);

      // Add to history
      setHistory((prev) => [processedUrl, ...prev]);

      // In a real implementation, we would route through Tor
      // For demo purposes, we're loading the URL directly
      if (iframeRef.current) {
        try {
          iframeRef.current.src = processedUrl;
        } catch (error) {
          setErrorMessage(`Failed to load: ${error.message}`);
        }
      }
    }, 1500);
  };

  // Add current page to bookmarks
  const addBookmark = () => {
    if (currentUrl && !bookmarks.includes(currentUrl)) {
      setBookmarks((prev) => [...prev, currentUrl]);
    }
  };

  // Clear browsing data
  const clearData = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all browsing data?"
    );
    if (confirmClear) {
      setHistory([]);
      setCurrentUrl("");
      setUrl("");
      if (iframeRef.current) {
        iframeRef.current.src = "about:blank";
      }
    }
  };

  // Simulate Tor circuit change
  const changeCircuit = () => {
    if (torStatus === "connected") {
      setIsLoading(true);
      setErrorMessage("");

      setTimeout(() => {
        setIsLoading(false);
        alert(
          "Tor circuit changed successfully. Your connection is using a new relay path."
        );

        // Reload the current page if one is loaded
        if (currentUrl && iframeRef.current) {
          iframeRef.current.src = currentUrl;
        }
      }, 2000);
    } else {
      setErrorMessage("Please connect to Tor network first");
    }
  };

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe errors
  const handleIframeError = () => {
    setErrorMessage(
      "Failed to load the page. The site may be blocking access through proxies or iframes."
    );
  };

  return (
    <div className="browser">
      <div className="browser-header">
        <h1>Private Tor Browser</h1>
        <div className="tor-status">
          <div className={`status-indicator ${torStatus}`}></div>
          <span>Tor: {torStatus}</span>
          {torStatus === "disconnected" ? (
            <button onClick={connectToTor} className="tor-button connect">
              Connect to Tor
            </button>
          ) : (
            <button
              onClick={disconnectFromTor}
              className="tor-button disconnect"
            >
              Disconnect
            </button>
          )}
          <button
            onClick={changeCircuit}
            className="tor-button"
            disabled={torStatus !== "connected"}
          >
            New Circuit
          </button>
        </div>
      </div>

      <div className="browser-toolbar">
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="text"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter .onion or regular URL"
            disabled={torStatus !== "connected"}
          />
          <button
            type="submit"
            className="navigate-button"
            disabled={torStatus !== "connected"}
          >
            Go
          </button>
        </form>
        <div className="browser-actions">
          <button onClick={addBookmark} disabled={!currentUrl}>
            Bookmark
          </button>
          <button onClick={clearData}>Clear Data</button>
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="browser-content">
        {isLoading ? (
          <div className="loading-screen">
            <p>Loading via Tor network...</p>
            <div className="loading-spinner"></div>
            <p>Your connection is encrypted through multiple relays</p>
          </div>
        ) : currentUrl ? (
          <div className="webpage-container">
            <div className="webpage-header">
              <p>Connected to: {currentUrl}</p>
              <p className="security-notice">End-to-end encrypted connection</p>
            </div>
            <div className="iframe-container">
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="webpage-iframe"
                title="Tor Browser Content"
                sandbox="allow-same-origin allow-scripts allow-forms"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
              <div className="iframe-overlay">
                <p className="overlay-notice">
                  Note: In a real Tor browser implementation, traffic would be
                  routed through the Tor network. This is a simulation and the
                  iframe may not load certain sites due to browser security
                  restrictions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="start-page">
            <h2>Private Browsing with Tor</h2>
            <p className="placeholder-text">
              Browse without being tracked. Your connection is routed through
              multiple relays to mask your identity and location.
            </p>
            <div className="privacy-features">
              <h3>Privacy Features:</h3>
              <ul>
                <li>Connection routed through multiple encrypted relays</li>
                <li>Access to .onion sites on the dark web</li>
                <li>No browsing history stored after session</li>
                <li>Protection against tracking and fingerprinting</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {bookmarks.length > 0 && (
        <div className="browser-sidebar">
          <h3>Bookmarks</h3>
          <ul>
            {bookmarks.map((bookmark, index) => (
              <li
                key={index}
                onClick={() => {
                  setUrl(bookmark);
                  handleSubmit({ preventDefault: () => {} });
                }}
              >
                {bookmark}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  browser: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#121212",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderBottom: "1px solid #333",
  },
  headerTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
  },
  torButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    color: "white",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  addButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#e91e63",
    color: "white",
    fontSize: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  searchBarContainer: {
    padding: "15px",
  },
  urlForm: {
    width: "100%",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: "30px",
    padding: "8px 15px",
  },
  searchIcon: {
    marginRight: "10px",
    color: "#888",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "15px",
    outline: "none",
  },
  errorMessage: {
    padding: "10px 15px",
    backgroundColor: "#ff5252",
    color: "white",
    margin: "0 15px",
    borderRadius: "5px",
    fontSize: "14px",
  },
  browserContent: {
    flex: 1,
    overflow: "auto",
    padding: "0 15px",
  },
  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
  },
  loadingSpinner: {
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 2s linear infinite",
    margin: "20px 0",
  },
  webpageContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  webpageHeader: {
    padding: "10px 0",
    fontSize: "14px",
  },
  securityNotice: {
    color: "#4CAF50",
    fontSize: "12px",
    margin: "5px 0",
  },
  iframeContainer: {
    position: "relative",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "6px",
    overflow: "hidden",
  },
  webpageIframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  iframeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: "10px",
  },
  overlayNotice: {
    margin: 0,
    fontSize: "12px",
    color: "#fff",
  },
  startPage: {
    padding: "10px 0",
  },
  trendingHeader: {
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "normal",
  },
  trendingItem: {
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
  },
  trendingTitle: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    fontWeight: "bold",
  },
  trendingSubtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#aaa",
    lineHeight: "1.4",
  },
};

export default Browser;
