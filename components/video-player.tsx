"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface VideoPlayerProps {
  video: {
    id: string
    url: string
    title: string
    description: string
    user: {
      name: string
      image: string
    }
    likes: number
    comments: number
    shares: number
  }
  isActive?: boolean
}

export function VideoPlayer({ video, isActive = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked, show play button
          setIsPlaying(false)
        })
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {
          setError("Failed to play video")
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
  }

  const handleError = () => {
    setError("Failed to load video")
    setIsLoading(false)
  }

  const handleLoadedData = () => {
    setIsLoading(false)
    setError(null)
  }

  return (
    <div className="relative h-full w-full bg-black">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        loop
        muted
        playsInline
        onClick={togglePlay}
        onError={handleError}
        onLoadedData={handleLoadedData}
        poster="/placeholder.svg"
      >
        <source src={video.url} type="video/mp4" />
      </video>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center p-4">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null)
                setIsLoading(true)
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
              className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 text-white hover:bg-black/40 w-12 h-12"
          onClick={handleLike}
        >
          <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
        <span className="text-white text-sm font-medium">{video.likes}</span>

        <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40 w-12 h-12">
          <MessageCircle className="h-6 w-6" />
        </Button>
        <span className="text-white text-sm font-medium">{video.comments}</span>

        <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40 w-12 h-12">
          <Share2 className="h-6 w-6" />
        </Button>
        <span className="text-white text-sm font-medium">{video.shares}</span>

        <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40 w-12 h-12">
          <Bookmark className="h-6 w-6" />
        </Button>
      </div>

      {/* Video Info */}
      <div className="absolute bottom-4 left-4 right-16 text-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={video.user.image} />
            <AvatarFallback>{video.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{video.user.name}</h3>
            <p className="text-sm opacity-90">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

