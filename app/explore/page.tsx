import { Suspense } from "react"
import { VideoGrid, VideoGridSkeleton } from "@/components/video-grid"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function getVideos() {
  try {
    const res = await fetch('http://localhost:3000/api/videos', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('API Error:', text)
      return []
    }

    const contentType = res.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType)
      return []
    }

    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

export default function ExplorePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      <Suspense fallback={<VideoGridSkeleton />}>
        <ExploreContent />
      </Suspense>
    </div>
  )
}

async function ExploreContent() {
  const videos = await getVideos()
  
  if (!videos.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No videos found. Try uploading some videos first!</p>
      </div>
    )
  }

  return <VideoGrid videos={videos} />
}

