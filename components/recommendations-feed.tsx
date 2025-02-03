"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { VideoPlayer } from "@/components/video-player";
import { useRecommendations } from "@/hooks/use-recommendations";
import { Loader2 } from "lucide-react";

interface RecommendationsFeedProps {
  limit?: number;
  excludeWatched?: boolean;
}

export function RecommendationsFeed({
  limit = 20,
  excludeWatched = true,
}: RecommendationsFeedProps) {
  const {
    videos,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useRecommendations({ limit, excludeWatched });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">
          Error loading recommendations. Please try again.
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">No recommendations found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {videos.map((video) => (
        <div key={video.video_id} className="w-full mb-4">
          <VideoPlayer
            video={{
              id: video.video_id,
              title: video.title,
              description: video.description,
              url: video.url,
              thumbnail_url: video.thumbnail_url,
              tiktok_users: [{
                id: video.user_id,
                username: "", // We'll need to fetch this from the API
                avatar_url: "" // We'll need to fetch this from the API
              }]
            }}
            isActive={false}
          />
        </div>
      ))}
      
      {hasNextPage && (
        <div
          ref={ref}
          className="flex items-center justify-center w-full py-4"
        >
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
} 