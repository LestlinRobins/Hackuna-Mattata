import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FiMic, FiMicOff, FiPhone } from 'react-icons/fi';
import VideoPlayer from './VideoPlayer';
const APP_ID = '608567868b1643d7bef27e64eb47e078';
const TOKEN = '007eJxTYNjJtLr32jqO7AunHRnqH9xZeaX8yOdWrcVSLCZFTIzaaz4pMJgZWJiamVuYWSQZmpkYp5gnpaYZmaeamaQmmZinGphb3JM8k94QyMjwrmIZAyMUgvjcDKXFqUWGuiDSiIEBAD1jIhI=';
const CHANNEL = 'user1-user2';
const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
    
})
const VideoRoom = () => {
    const [user, setUser]=useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [localTracks, setLocalTracks]=useState([]);
    const toggleMute = () => {
        setIsMuted(!isMuted);
      };
    
      const toggleVideo = () => {
        setIsVideoOn(!isVideoOn);
      };
    const handleUserJoined = async (user, mediaType)=>{
        await client.subscribe(user, mediaType);
        if(mediaType ==='video'){
            setUser((previousUsers)=> [...previousUsers, user])
        }
        if(mediaType ==='audio'){
            user.audioTrack.play()
        }
    }
    const handleUserLeft = (user)=>{
        setUser((previousUsers)=>
            previousUsers.filter((u)=>u.uid!==user.uid)
        )
    }
    const refreshPage = () => {
        window.location.reload();
      };
    useEffect(()=>{
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);
        client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          uid,
        ])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUser((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });
        return ()=>{
            for(let localTrack of localTracks){
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.unpublish(tracks).then(()=>client.leave());
        }
    }, []);
  return (
    <div>
        <div className="active-call">
            <div className="caller-info">
            <div className="large-avatar">{isVideoOn ? "Video" : "AN"}</div>
            <h2>AN1234</h2>
            <p>Secure call in progress</p>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div style={{display:'grid', gridTemplateColumns: 'repeat(2, 200px)'}}>
                    {user.map((users)=>(
                        <div key={users.uid}>
                            <VideoPlayer user={users} key={users.uid} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="call-controls">
            <button
                className={`control-button ${isMuted ? "active" : ""}`}
                onClick={toggleMute}
            >
                {isMuted ? <FiMicOff /> : <FiMic />}
            </button>
            </div>
            <button style={{alignSelf:'center'}} className="control-button end" onClick={()=>refreshPage()}>
              <FiPhone />
          </button>
        </div>
    </div>
  )
}

export default VideoRoom
