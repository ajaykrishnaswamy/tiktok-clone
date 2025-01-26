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
  views: number
  likes: number
  comments: number
  createdAt: string
}

export default function PostsPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos/feed?limit=50")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setVideos(data)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <StudioLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Posts</h1>
          <Link href="/studio/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[100px] text-right">Views</TableHead>
                <TableHead className="w-[100px] text-right">Likes</TableHead>
                <TableHead className="w-[100px] text-right">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No videos found
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{video.views}</TableCell>
                    <TableCell className="text-right">{video.likes}</TableCell>
                    <TableCell className="text-right">{video.comments}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </StudioLayout>
  )
} 