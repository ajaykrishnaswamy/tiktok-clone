import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get analytics data from Supabase
    const { data: videos, error: videosError } = await supabase
      .from("tiktok_videos")
      .select(`
        id,
        views_count,
        likes_count,
        comments_count,
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (videosError) {
      throw videosError
    }

    // Calculate totals and trends
    const totals = videos.reduce(
      (acc, video) => ({
        views: acc.views + (video.views_count || 0),
        likes: acc.likes + (video.likes_count || 0),
        comments: acc.comments + (video.comments_count || 0),
      }),
      { views: 0, likes: 0, comments: 0 }
    )

    return NextResponse.json({
      totals,
      videos,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return new Response("Failed to fetch analytics", { status: 500 })
  }
} 