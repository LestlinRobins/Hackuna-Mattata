import React, { useEffect, useRef } from 'react'

const VideoPlayer = ({user}) => {
    const ref = useRef();
    useEffect(()=>{
        user.videoTrack.play(ref.current);
    }, [])
  return (
    <div>
      <div ref={ref} style={{width:'300px', height:'300px'}}>
        
      </div>
    </div>
  )
}

export default VideoPlayer
