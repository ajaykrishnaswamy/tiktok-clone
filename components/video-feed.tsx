'use client'

import { useEffect, useRef, useState } from "react"
import { VideoPlayer } from "@/components/video-player"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: string
  url: string
  thumbnail_url: string | null
  title: string
  description: string | null
  tiktok_users: {
    id: string
    username: string
    avatar_url: string
  }[]
}

interface VideoFeedProps {
  videos: Video[]
}

export function VideoFeed({ videos }: VideoFeedProps) {
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
    <div className="max-w-3xl mx-auto w-full">
      <div
        ref={containerRef}
        className="h-[calc(100vh-theme(spacing.16))] overflow-y-scroll snap-y snap-mandatory"
      >
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="h-full snap-start snap-always"
          >
            <VideoPlayer 
              video={video} 
              isActive={currentVideoIndex === index} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function VideoFeedSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="h-[calc(100vh-theme(spacing.16))]">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  )
} 