import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { data: videos, error } = await supabase
      .from("tiktok_videos")
      .select(`
        id,
        title,
        description,
        url,
        views_count,
        likes_count,
        comments_count,
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return new Response("Failed to fetch videos", { status: 500 })
    }

    console.log('Fetched videos from DB:', videos) // Debug log
    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return new Response("Failed to fetch videos", { status: 500 })
  }
} 