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

    // Remove any existing dislike first
    await supabase
      .from("tiktok_dislikes")
      .delete()
      .match({ user_id: user.id, video_id: params.videoId })

    // Add like
    const { error } = await supabase.from("tiktok_likes").insert({
      user_id: user.id,
      video_id: params.videoId,
    })

    if (error?.code === "23505") {
      return new Response("Already liked", { status: 409 })
    }

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return new Response("Liked", { status: 200 })
  } catch (error) {
    console.error("Like error:", error)
    return new Response("Failed to like", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { error } = await supabase
      .from("tiktok_likes")
      .delete()
      .match({ user_id: user.id, video_id: params.videoId })

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    return new Response("Unliked", { status: 200 })
  } catch (error) {
    console.error("Unlike error:", error)
    return new Response("Failed to unlike", { status: 500 })
  }
} 