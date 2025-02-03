import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { videoId } = params
    const { watchDuration, completed } = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if watch history exists
    const { data: existingHistory } = await supabase
      .from('video_watch_history')
      .select()
      .match({ video_id: videoId, user_id: user.id })
      .single()

    if (existingHistory) {
      // Update existing history
      const { error } = await supabase
        .from('video_watch_history')
        .update({
          watch_duration_seconds: watchDuration,
          completed,
          updated_at: new Date().toISOString()
        })
        .match({ video_id: videoId, user_id: user.id })

      if (error) {
        return new NextResponse(error.message, { status: 500 })
      }
    } else {
      // Create new history
      const { error } = await supabase
        .from('video_watch_history')
        .insert({
          video_id: videoId,
          user_id: user.id,
          watch_duration_seconds: watchDuration,
          completed,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        return new NextResponse(error.message, { status: 500 })
      }
    }

    return new NextResponse("Watch history updated", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { videoId } = params

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { data: watchHistory, error } = await supabase
      .from('video_watch_history')
      .select()
      .match({ video_id: videoId, user_id: user.id })
      .single()

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(watchHistory)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 