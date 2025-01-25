import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("video") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file || !title) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Generate embedding using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(`${title} ${description}`)
    const embedding = await result.response.text()

    // Create video record in Supabase
    const { data, error } = await supabase
      .from('tiktok_videos')
      .insert([
        {
          user_id: user.id,
          title,
          description,
          url: blob.url,
          embedding,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return new Response("Database error", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Upload error:", error)
    return new Response("Upload failed", { status: 500 })
  }
}

