"use client"

import { StudioLayout } from "@/components/layouts/studio-layout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Upload } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Video {
  id: string
  title: string
  description: string
  url: string
  views_count: number
  likes_count: number
  comments_count: number
  created_at: string
}

export default function PostsPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchVideos() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/videos', {
        // Prevent caching
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }
      
      const data = await response.json()
      console.log('Fetched videos:', data) // Debug log
      setVideos(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching videos:', error)
      setError('Failed to load videos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
    
    // Refresh data every 5 seconds while the page is open
    const interval = setInterval(fetchVideos, 5000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <StudioLayout>
        <div className="p-6">
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        </div>
      </StudioLayout>
    )
  }

  return (
    <StudioLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Posts</h1>
          <Link href="/studio/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No videos uploaded yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Likes</TableHead>
                <TableHead className="text-right">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    <Link href={video.url} target="_blank" className="hover:underline">
                      {video.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(video.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">{video.views_count || 0}</TableCell>
                  <TableCell className="text-right">{video.likes_count || 0}</TableCell>
                  <TableCell className="text-right">{video.comments_count || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </StudioLayout>
  )
} 