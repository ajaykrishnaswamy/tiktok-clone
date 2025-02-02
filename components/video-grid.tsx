"use client"

import Link from "next/link"
import Image from "next/image"
import { formatNumber } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: string
  user_id: string
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

interface VideoGridProps {
  videos: Video[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  if (!videos?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No videos found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Link key={video.id} href={`/watch/${video.id}`} className="block">
          <div className="space-y-2">
            <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No thumbnail</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2">
              {video.tiktok_users[0]?.avatar_url ? (
                <Image
                  src={video.tiktok_users[0].avatar_url}
                  alt={video.tiktok_users[0].username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted" />
              )}
              <div className="flex-1 space-y-1">
                <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                <p className="text-sm text-muted-foreground">
                  @{video.tiktok_users[0]?.username}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[9/16] w-full rounded-md" />
          <div className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 