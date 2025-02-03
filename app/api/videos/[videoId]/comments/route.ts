import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { videoId } = params

    const { data: comments, error } = await supabase
      .from('video_comments')
      .select(`
        *,
        tiktok_users (
          id,
          username,
          avatar_url
        )
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(comments)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { videoId } = params
    const { content, parentCommentId } = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { error } = await supabase
      .from('video_comments')
      .insert({
        video_id: videoId,
        user_id: user.id,
        content,
        parent_comment_id: parentCommentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Comment added", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { commentId } = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { error } = await supabase
      .from('video_comments')
      .delete()
      .match({ id: commentId, user_id: user.id })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Comment deleted", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { commentId, content } = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { error } = await supabase
      .from('video_comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .match({ id: commentId, user_id: user.id })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Comment updated", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 