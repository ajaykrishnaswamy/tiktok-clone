import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { put } from "@vercel/blob"
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

    const formData = await req.formData()
    const newClip = formData.get("newClip") as File
    const startTime = formData.get("startTime")
    const endTime = formData.get("endTime")

    if (!newClip || !startTime || !endTime) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Upload new clip to Vercel Blob
    const blob = await put(newClip.name, newClip, {
      access: "public",
    })

    // Create new stitched video record
    const { data: video, error } = await supabase
      .from("tiktok_videos")
      .insert({
        user_id: user.id,
        url: blob.url,
        is_stitch: true,
        original_video_id: params.videoId,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return new Response("Database error", { status: 500 })
    }

    // Create stitch record
    const { error: stitchError } = await supabase.from("tiktok_stitches").insert({
      original_video_id: params.videoId,
      stitched_video_id: video.id,
      start_time: startTime,
      end_time: endTime,
    })

    if (stitchError) {
      console.error("Stitch error:", stitchError)
      return new Response("Failed to create stitch record", { status: 500 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error("Stitch error:", error)
    return new Response("Failed to create stitch", { status: 500 })
  }
} 