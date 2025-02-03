"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Suspense } from "react"
import { VideoFeed } from "@/components/video-feed"
import { VideoFeedSkeleton } from "@/components/video-feed"

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

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function getVideos() {
  try {
    const res = await fetch('/api/videos', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch videos')
    }

    const videos = await res.json()
    return Array.isArray(videos) ? videos : []
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

export default function HomePage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkOnboarding() {
      if (!userId) return

      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!preferences) {
        router.push('/onboarding')
      }
    }

    if (isLoaded) {
      if (!userId) {
        router.push('/sign-in')
      } else {
        checkOnboarding()
      }
    }
  }, [isLoaded, userId, router, supabase])

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div className="flex flex-col items-center py-6">
      <Suspense fallback={<VideoFeedSkeleton />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}

async function HomeContent() {
  const videos = await getVideos()
  
  if (!videos.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No videos found. Try uploading some videos first!</p>
      </div>
    )
  }

  return <VideoFeed videos={videos} />
}

