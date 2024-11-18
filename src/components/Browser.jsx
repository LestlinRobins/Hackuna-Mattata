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

export default Browser;
