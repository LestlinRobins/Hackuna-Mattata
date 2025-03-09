import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FiMic, FiMicOff, FiPhone } from 'react-icons/fi';
import VideoPlayer from './VideoPlayer';
import "../styles/Call.css";
import { CallEnd, CallEndTwoTone, Mic, MicExternalOffOutlined, MicExternalOnOutlined, MicOff, VolumeMuteOutlined } from '@mui/icons-material';
const APP_ID = '608567868b1643d7bef27e64eb47e078';
const TOKEN = '007eJxTYDj1Olvw2XTXZtHnitMK5/TNbVp2a97ZpxtmnF4v2Jj99tNOBQYzAwtTM3MLM4skQzMT4xTzpNQ0I/NUM5PUJBPzVANzi427z6Y3BDIynJlznJmRAQJBfG6G0uLUIkNdEGnEwAAAaP0mKg==';
const CHANNEL = 'user1-user2';
const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
    
})
const VideoRoom = ({username}) => {
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
          <div className="appbar">
          <div className="appbar-left">
            <h1>Distral</h1>
          </div>
          <div className="appbar-right">
            <h1>Video-Call</h1>
          </div>
        </div>
        <div className="active-call">
            <div className="caller-info">
            <p>Secure call in progress</p>
            <br />
            <h1>{username}</h1>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
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
                  {isMuted ? <MicOff /> : <Mic />}
              </button>
              <button style={{alignSelf:'center'}} className="control-button end" onClick={()=>refreshPage()}>
                <CallEndTwoTone />
            </button>
            </div>
        </div>
    </div>
  )
}

export default VideoRoom
