import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { userId } = params

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Don't allow following yourself
    if (user.id === userId) {
      return new NextResponse("Cannot follow yourself", { status: 400 })
    }

    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: user.id,
        following_id: userId,
        created_at: new Date().toISOString()
      })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Followed", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { userId } = params

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .match({ follower_id: user.id, following_id: userId })

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return new NextResponse("Unfollowed", { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 