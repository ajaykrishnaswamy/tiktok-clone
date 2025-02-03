"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, MessageCircle, Share2, Music2, Plus, Bookmark } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Comments } from "@/components/comments"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useVideoEngagement } from "@/hooks/use-video-engagement"
import { toast } from "@/components/ui/use-toast"
import { useSpring, animated } from "@react-spring/web"

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
  isYouTube?: boolean
}

interface VideoPlayerProps {
  video: Video
  isActive: boolean
}

export function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [shareCount, setShareCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [watchDuration, setWatchDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const watchIntervalRef = useRef<NodeJS.Timeout>()

  const {
    isLiked,
    metrics: {
      likes_count: likeCount,
      comments_count: commentCount
    },
    handleLike: handleVideoLike
  } = useVideoEngagement(video.id)

  const likeAnimation = useSpring({
    transform: isLikeAnimating ? "scale(1.2)" : "scale(1)",
    config: {
      tension: 300,
      friction: 10,
    },
  })

  useEffect(() => {
    if (!video.isYouTube) {
      if (isActive && videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
        setIsPlaying(true)
        
        // Start tracking watch duration
        watchIntervalRef.current = setInterval(() => {
          if (videoRef.current) {
            setWatchDuration(prev => prev + 1)
            
            // Mark as completed if watched more than 90%
            if (videoRef.current.currentTime / videoRef.current.duration > 0.9) {
              setIsCompleted(true)
            }
          }
        }, 1000)
      } else if (!isActive && videoRef.current) {
        videoRef.current.pause()
        setIsPlaying(false)
        
        // Stop tracking and update watch history
        if (watchIntervalRef.current) {
          clearInterval(watchIntervalRef.current)
          updateWatchHistory()
        }
      }
    }

    return () => {
      if (watchIntervalRef.current) {
        clearInterval(watchIntervalRef.current)
        updateWatchHistory()
      }
    }
  }, [isActive, video.isYouTube])

  const updateWatchHistory = async () => {
    try {
      await fetch(`/api/videos/${video.id}/watch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watchDuration,
          completed: isCompleted,
        }),
      })
    } catch (error) {
      console.error('Failed to update watch history:', error)
    }
  }

  const handleLike = async () => {
    try {
      setIsLikeAnimating(true);
      await handleVideoLike();
      
      // Show a toast notification
      toast({
        title: isLiked ? "Removed Like" : "Liked",
        description: isLiked ? "Video unliked" : "Added to your liked videos",
        duration: 1500
      });

      // Reset animation after a short delay
      setTimeout(() => setIsLikeAnimating(false), 200);
    } catch (error) {
      console.error('Failed to like video:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
        duration: 2000
      });
      setIsLikeAnimating(false);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/users/${video.tiktok_users[0].id}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        // Show a toast notification
        toast({
          title: isFollowing ? "Unfollowed" : "Following",
          description: isFollowing 
            ? `Unfollowed ${video.tiktok_users[0].username}` 
            : `Following ${video.tiktok_users[0].username}`,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

  const togglePlay = () => {
    if (video.isYouTube && iframeRef.current) {
      const message = isPlaying ? 'pauseVideo' : 'playVideo'
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: message }), '*'
      )
      setIsPlaying(!isPlaying)
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const user = video.tiktok_users[0]

  return (
    <div className="relative h-full bg-black">
      {/* Video */}
      {video.isYouTube ? (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}?enablejsapi=1&autoplay=${isActive ? 1 : 0}&controls=0&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0`}
          className="h-full w-full object-cover"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onClick={togglePlay}
        />
      ) : (
        <video
          ref={videoRef}
          src={video.url}
          className="h-full w-full object-cover"
          loop
          playsInline
          onClick={togglePlay}
        />
      )}

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
        {/* Avatar and Follow Button */}
        <div className="relative group">
          <Image
            src={user?.avatar_url || '/placeholder.svg'}
            alt={user?.username || 'user'}
            width={48}
            height={48}
            className="rounded-full border-2 border-white cursor-pointer"
          />
          <button 
            onClick={handleFollow}
            className={cn(
              "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center",
              "bg-primary hover:bg-primary/90 transition-colors",
              "group-hover:scale-110 transform duration-200",
              isFollowing && "bg-muted hover:bg-muted/90"
            )}
          >
            <Plus size={14} className="text-white" />
          </button>
        </div>

        {/* Like Button */}
        <button 
          onClick={handleLike}
          className="group flex flex-col items-center gap-1"
        >
          <animated.div 
            style={likeAnimation}
            className={cn(
              "p-3 rounded-full bg-black/20 backdrop-blur-lg group-hover:bg-black/30 transition-colors",
              isLiked && "bg-red-500/20"
            )}
          >
            <Heart 
              size={28} 
              className={cn(
                "transition-all duration-300",
                isLiked ? "fill-red-500 text-red-500" : "text-white group-hover:scale-110"
              )} 
            />
          </animated.div>
          <span className="text-white text-xs font-medium">{likeCount}</span>
        </button>

        {/* Comment Button */}
        <Sheet open={showComments} onOpenChange={setShowComments}>
          <SheetTrigger asChild>
            <button className="group flex flex-col items-center gap-1">
              <div className="p-3 rounded-full bg-black/20 backdrop-blur-lg group-hover:bg-black/30 transition-colors">
                <MessageCircle 
                  size={28} 
                  className="text-white group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <span className="text-white text-xs font-medium">{commentCount}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0">
            <Comments videoId={video.id} onClose={() => setShowComments(false)} />
          </SheetContent>
        </Sheet>

        {/* Bookmark Button */}
        <button className="group flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-lg group-hover:bg-black/30 transition-colors">
            <Bookmark 
              size={28} 
              className="text-white group-hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <span className="text-white text-xs font-medium">Save</span>
        </button>

        {/* Share Button */}
        <button className="group flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-lg group-hover:bg-black/30 transition-colors">
            <Share2 
              size={28} 
              className="text-white group-hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <span className="text-white text-xs font-medium">{shareCount}</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-16 text-white">
        <div className="space-y-2">
          <h3 className="font-semibold">@{user?.username}</h3>
          <p className="text-sm">{video.description}</p>
          <div className="flex items-center gap-2">
            <Music2 size={16} />
            <span className="text-sm">Original Sound</span>
          </div>
        </div>
      </div>
    </div>
  )
}

