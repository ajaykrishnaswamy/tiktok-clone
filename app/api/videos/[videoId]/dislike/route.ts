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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Remove like if exists
    await supabase
      .from('video_likes')
      .delete()
      .match({ video_id: videoId, user_id: user.id })

    // Add dislike
    const { error } = await supabase
      .from('video_dislikes')
      .insert({
        video_id: videoId,
        user_id: user.id,
        created_at: new Date().toISOString()
      })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Disliked", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from('video_dislikes')
      .delete()
      .match({ video_id: videoId, user_id: user.id })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Undisliked", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 