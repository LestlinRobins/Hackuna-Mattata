// File: src/components/Call.jsx
import { useState } from "react";
import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff } from "react-icons/fi";
import "../styles/Call.css";
import VideoRoom from "./VideoRoom";

const Call = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isjoined, setisjoined]=useState(false);
  const [recentCalls] = useState([
    { id: "call1", name: "AN1234", time: "10:45 AM", missed: false },
    { id: "call2", name: "XY5678", time: "9:22 AM", missed: true },
    { id: "call3", name: "KL9012", time: "Yesterday", missed: false },
  ]);

  const toggleCall = () => {
    setIsInCall(!isInCall);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  return (
    <div className="call">
      <h1>Secure Calls</h1>

      {(!isInCall && !isjoined) && (
        <>
          <div className="call-section">
            <h2>Recent</h2>
            <div className="recent-calls">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className={`call-item ${call.missed ? "missed" : ""}`}
                >
                  <div className="call-avatar">{call.name.substring(0, 2)}</div>
                  <div className="call-details">
                    <h3>{call.name}</h3>
                    <p>{call.time}</p>
                  </div>
                  <button className="call-action">
                    <FiPhone />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="call-dialpad">
            <input
              type="text"
              placeholder="Enter ID or search"
              className="call-input"
            />
            <div className="call-buttons">
              <button className="call-button voice" onClick={toggleCall}>
                <FiPhone />
              </button>
              <button
                className="call-button video"
                onClick={() => {
                  setIsVideoOn(true);
                  setisjoined(true);
                }}
              >
                <FiVideo />
              </button>
            </div>
          </div>
        </>
      )}
      {isInCall && (
        <div className="active-call">
          <div className="caller-info">
            <div className="large-avatar">{isVideoOn ? "Video" : "AN"}</div>
            <h2>AN1234</h2>
            <p>Secure call in progress</p>
          </div>

          <div className="call-controls">
            <button
              className={`control-button ${isMuted ? "active" : ""}`}
              onClick={toggleMute}
            >
              {isMuted ? <FiMicOff /> : <FiMic />}
            </button>
            <button className="control-button end" onClick={toggleCall}>
              <FiPhone />
            </button>
          </div>
        </div>
      )}
      {isjoined && (
        <>
          <VideoRoom />
        </>
        
      )}
    </div>
  );
};

export default Call;
