"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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

interface VideoPlayerProps {
  video: Video
  isActive: boolean
}

export function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const user = video.tiktok_users[0]

  return (
    <div className="relative h-full bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full object-contain"
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-end justify-between text-white">
          {/* Video Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {user?.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span className="font-semibold">@{user?.username}</span>
            </div>
            <p className="line-clamp-2">{video.title}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 items-center ml-4">
            <button className="p-2 hover:text-red-500">
              <Heart size={24} />
            </button>
            <button className="p-2">
              <MessageCircle size={24} />
            </button>
            <button className="p-2">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

