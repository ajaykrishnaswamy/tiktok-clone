import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("video") as File

    if (!file) {
      return new Response("No file provided", { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Create video record in Supabase
    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          url: blob.url,
          title: file.name,
          user_id: user,
        }
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return new Response("Database error", { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Upload error:", error)
    return new Response("Upload failed", { status: 500 })
  }
}

