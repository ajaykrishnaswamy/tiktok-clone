import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { data: comments, error } = await supabase
      .from("tiktok_comments")
      .select(`
        *,
        user:tiktok_users!inner(*)
      `)
      .eq("video_id", params.videoId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Comments error:", error)
    return new Response("Failed to fetch comments", { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { content } = await req.json()

    if (!content) {
      return new Response("Missing content", { status: 400 })
    }

    const { data: comment, error } = await supabase
      .from("tiktok_comments")
      .insert({
        user_id: user.id,
        video_id: params.videoId,
        content,
      })
      .select(`
        *,
        user:tiktok_users!inner(*)
      `)
      .single()

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Comment error:", error)
    return new Response("Failed to create comment", { status: 500 })
  }
} 