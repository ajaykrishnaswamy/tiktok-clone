import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get videos with likes and user info
    const { data: videos, error } = await supabase
      .from("tiktok_videos")
      .select(`
        *,
        user:tiktok_users!inner(*),
        likes:tiktok_likes(count),
        comments:tiktok_comments(count),
        shares:tiktok_shares(count)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Feed error:", error)
    return new Response("Failed to fetch feed", { status: 500 })
  }
} 