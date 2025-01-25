import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { recipientUserId, message } = await req.json()

    if (!recipientUserId) {
      return new Response("Recipient user ID is required", { status: 400 })
    }

    // Check if video exists
    const { data: video, error: videoError } = await supabase
      .from("tiktok_videos")
      .select("id")
      .eq("id", params.videoId)
      .single()

    if (videoError || !video) {
      return new Response("Video not found", { status: 404 })
    }

    // Check if recipient user exists
    const { data: recipientUser, error: recipientError } = await supabase
      .from("tiktok_users")
      .select("id")
      .eq("id", recipientUserId)
      .single()

    if (recipientError || !recipientUser) {
      return new Response("Recipient user not found", { status: 404 })
    }

    const { error } = await supabase.from("tiktok_forwards").insert({
      user_id: user.id,
      video_id: params.videoId,
      recipient_user_id: recipientUserId,
      message,
    })

    if (error?.code === "23505") {
      return new Response("Already forwarded to this user", { status: 409 })
    }

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return new Response("Forwarded successfully", { status: 200 })
  } catch (error) {
    console.error("Forward error:", error)
    return new Response("Failed to forward", { status: 500 })
  }
} 