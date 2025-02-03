"use client"

import { useEffect, useState } from "react"

interface EngagementMetrics {
  likes_count: number
  dislikes_count: number
  comments_count: number
  total_watch_time: number
  completion_rate: number
}

interface VideoEngagement {
  isLiked: boolean
  isDisliked: boolean
  metrics: EngagementMetrics
}

export function useVideoEngagement(videoId: string) {
  const [engagement, setEngagement] = useState<VideoEngagement>({
    isLiked: false,
    isDisliked: false,
    metrics: {
      likes_count: 0,
      dislikes_count: 0,
      comments_count: 0,
      total_watch_time: 0,
      completion_rate: 0
    }
  })

  useEffect(() => {
    fetchEngagementMetrics()
  }, [videoId])

  const fetchEngagementMetrics = async () => {
    try {
      // Fetch engagement metrics
      const metricsRes = await fetch(`/api/videos/${videoId}/metrics`)
      if (!metricsRes.ok) throw new Error('Failed to fetch metrics')
      const metrics = await metricsRes.json()

      // Check if user has liked the video
      const likeRes = await fetch(`/api/videos/${videoId}/like`, {
        method: 'GET'
      })
      const isLiked = likeRes.ok

      // Check if user has disliked the video
      const dislikeRes = await fetch(`/api/videos/${videoId}/dislike`, {
        method: 'GET'
      })
      const isDisliked = dislikeRes.ok

      setEngagement({
        isLiked,
        isDisliked,
        metrics
      })
    } catch (error) {
      console.error('Error fetching engagement metrics:', error)
    }
  }

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/videos/${videoId}/like`, {
        method: engagement.isLiked ? 'DELETE' : 'POST'
      })
      
      if (res.ok) {
        setEngagement(prev => ({
          ...prev,
          isLiked: !prev.isLiked,
          isDisliked: false, // Remove dislike if exists
          metrics: {
            ...prev.metrics,
            likes_count: prev.isLiked ? prev.metrics.likes_count - 1 : prev.metrics.likes_count + 1,
            dislikes_count: prev.isDisliked ? prev.metrics.dislikes_count - 1 : prev.metrics.dislikes_count
          }
        }))
      }
    } catch (error) {
      console.error('Error handling like:', error)
    }
  }

  const handleDislike = async () => {
    try {
      const res = await fetch(`/api/videos/${videoId}/dislike`, {
        method: engagement.isDisliked ? 'DELETE' : 'POST'
      })
      
      if (res.ok) {
        setEngagement(prev => ({
          ...prev,
          isDisliked: !prev.isDisliked,
          isLiked: false, // Remove like if exists
          metrics: {
            ...prev.metrics,
            dislikes_count: prev.isDisliked ? prev.metrics.dislikes_count - 1 : prev.metrics.dislikes_count + 1,
            likes_count: prev.isLiked ? prev.metrics.likes_count - 1 : prev.metrics.likes_count
          }
        }))
      }
    } catch (error) {
      console.error('Error handling dislike:', error)
    }
  }

  return {
    ...engagement,
    handleLike,
    handleDislike,
    refetch: fetchEngagementMetrics
  }
} 