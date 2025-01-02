import VideoPlayer from './VideoPlayer'
import { useRef } from 'react'

import './App.css'

function App() {
  const playerRef = useRef(null)

  const videoLink = "http://localhost:8000/uploads/courses/708fb45d-1422-4533-a6a3-8183c1ce34b7/index.m3u8"

  const videoPlayerOptions = {
    controls:true,
    responsive:true,
    fluid:true,
    sources:[{
      src:videoLink,
      type:"application/x-mpegURL"
    }]
  }

  const handlePlayerRef = (player) =>{
    playerRef.current = player;

    player.on("waiting",()=>{
      videojs.log("player is waiting")
    })

    player.on("dispose",()=>{
      videojs.log("player will dispose")
    })
  }

  return (
    <>
      <div>
        <h1>video player</h1>
      </div>
      <VideoPlayer
        options = {videoPlayerOptions}
        onReady = {handlePlayerRef}
      />
    </>
  )
}

export default App
