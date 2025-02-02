import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  try {
    const { data: videos, error } = await supabase
      .from('tiktok_videos')
      .select(`
        *,
        tiktok_users (
          id,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      )
    }

    return new NextResponse(
      JSON.stringify(videos || []),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
} 