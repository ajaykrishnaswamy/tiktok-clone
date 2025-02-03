"use client";

import { useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface RecommendedVideo {
  video_id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  user_id: string;
  created_at: string;
  recommendation_score: number;
}

interface UseRecommendationsOptions {
  limit?: number;
  excludeWatched?: boolean;
}

interface RecommendationsPage {
  videos: RecommendedVideo[];
  nextPage: number | undefined;
}

export function useRecommendations({
  limit = 20,
  excludeWatched = true,
}: UseRecommendationsOptions = {}) {
  const fetchRecommendations = useCallback(
    async ({ pageParam = 0 }): Promise<RecommendationsPage> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        excludeWatched: excludeWatched.toString(),
      });

      const response = await fetch(`/api/recommendations/route?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      return {
        videos: data as RecommendedVideo[],
        nextPage: data.length === limit ? pageParam + 1 : undefined,
      };
    },
    [limit, excludeWatched]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["recommendations", { limit, excludeWatched }],
    queryFn: fetchRecommendations,
    getNextPageParam: (lastPage: RecommendationsPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const videos = data?.pages.flatMap((page: RecommendationsPage) => page.videos) ?? [];

  return {
    videos,
    fetchNextPage,
    hasNextPage,
    isLoading: isFetching && !isFetchingNextPage,
    isFetchingNextPage,
    error,
  };
} 