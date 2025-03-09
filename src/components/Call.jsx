// File: src/components/Call.jsx
import { useState } from "react";
import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff } from "react-icons/fi";
import "../styles/Call.css";
import VideoRoom from "./VideoRoom";
import AudioRoom from "./AudioRoom";
import callicon from '../assets/call2.svg'
import { VideoCall, VideoCallRounded } from "@mui/icons-material";
const Call = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isjoined, setisjoined]=useState(false);
  const [userName, setuserName]=useState('');
  const [recentCalls] = useState([
    { id: "call1", name: "AN1234", time: "10:45 AM", missed: false },
    { id: "call2", name: "XY5678", time: "9:22 AM", missed: true },
    { id: "call3", name: "KL9012", time: "Yesterday", missed: false },
  ]);
  const handleVideoCall = ()=>{
    if(userName==''){
      alert('Enter a valid userName to connect the call');
    }else{
      setIsVideoOn(true);
      setisjoined(true);
    }
  }
  const toggleCall = () => {
    if(userName==''){
      alert('Invalid username.');
    }else{
      setIsInCall(!isInCall);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  return (
    <div className="call">
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
                  <button style={{height:'60px', width:'60px', borderRadius:'50%', backgroundColor:'var(--accent-color)'}}>
                    <img src={callicon} alt="" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginTop:'10%',display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <input
              type="text"
              placeholder="Enter ID or search"
              className="call-input"
              style={{width:'70%', height:'50px'}}
              value={userName}
              onChange={(e)=>setuserName(e.target.value)}
            />
          </div>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <button className="call-button voice" onClick={toggleCall} style={{marginRight:'10px'}}>
                <img src={callicon} alt="" />
            </button>
            <button
              className="call-button video"
              onClick={() => {
                handleVideoCall()
              }}
            >
              <VideoCallRounded />
            </button>
          </div>
        </>
      )}
      {isInCall && (
        <AudioRoom userName={userName} />
      )}
      {isjoined && (
        <>
          <VideoRoom username={userName} />
        </>
        
      )}
    </div>
  );
};

export default Call;
