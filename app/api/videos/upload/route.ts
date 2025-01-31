import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { put } from "@vercel/blob"
import { supabase } from "@/lib/supabase"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    console.log("User:", user) // Debug log

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    console.log("Form data received") // Debug log

    const file = formData.get("video") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    console.log("Received data:", { 
      fileName: file?.name,
      title,
      description 
    }) // Debug log

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields", fields: { file: !!file, title: !!title } },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    console.log("Starting Vercel Blob upload") // Debug log
    const blob = await put(file.name, file, {
      access: 'public',
    })
    console.log("Blob upload successful:", blob.url) // Debug log

    // Generate embedding
    console.log("Starting embedding generation") // Debug log
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(description || title)
    const embedding = result.response.text()
    console.log("Embedding generated") // Debug log

    // Save to Supabase
    console.log("Saving to Supabase") // Debug log
    const { data, error } = await supabase
      .from("tiktok_videos")
      .insert([
        {
          user_id: user.id,
          title,
          description,
          url: blob.url,
          embedding,
          thumbnail_url: null,
          duration: 0,
          views_count: 0,
          likes_count: 0,
          comments_count: 0,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Database error", details: error }, { status: 500 })
    }

    console.log("Video saved successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

