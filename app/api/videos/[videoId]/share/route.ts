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

    const { error } = await supabase.from("tiktok_shares").insert({
      user_id: user.id,
      video_id: params.videoId,
      recipient_user_id: recipientUserId,
      message,
    })

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return new Response("Shared successfully", { status: 200 })
  } catch (error) {
    console.error("Share error:", error)
    return new Response("Failed to share", { status: 500 })
  }
} 