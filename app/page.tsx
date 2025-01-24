"use client"

import { useEffect, useRef, useState } from "react"
import { VideoPlayer } from "@/components/video-player"

// Using publicly available video samples
const sampleVideos = [
  {
    id: "1",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Sample Video 1",
    description: "This is a sample video description",
    user: {
      name: "User 1",
      image: "/placeholder.svg",
    },
    likes: 1234,
    comments: 56,
    shares: 78,
  },
  {
    id: "2",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    title: "Sample Video 2",
    description: "Another sample video description",
    user: {
      name: "User 2",
      image: "/placeholder.svg",
    },
    likes: 5678,
    comments: 90,
    shares: 12,
  },
  {
    id: "3",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "Sample Video 3",
    description: "Yet another sample video",
    user: {
      name: "User 3",
      image: "/placeholder.svg",
    },
    likes: 9012,
    comments: 34,
    shares: 56,
  },
]

export default function Home() {
  const [videos, setVideos] = useState(sampleVideos)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const videoHeight = containerRef.current.clientHeight
        const index = Math.round(scrollTop / videoHeight)
        setCurrentVideoIndex(index)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-[100vh] overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {videos.map((video, index) => (
        <div key={video.id} className="h-[100vh] snap-start snap-always">
          <VideoPlayer video={video} isActive={currentVideoIndex === index} />
        </div>
      ))}
    </div>
  )
}

