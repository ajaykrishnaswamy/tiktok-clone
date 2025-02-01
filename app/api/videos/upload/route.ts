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
    console.log("User:", user)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("video") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields", fields: { file: !!file, title: !!title } },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    console.log("Starting Vercel Blob upload")
    const blob = await put(file.name, file, {
      access: 'public',
    })

    // Generate embedding using Gemini's model
    console.log("Starting embedding generation")
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `Analyze this video content with title "${title}" and description "${description}". 
                   Focus on the key themes, actions, and visual elements that would be present.
                   Provide a detailed analysis that captures the essence of the video content.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Convert the analysis into a numerical embedding
    const hashText = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    const VECTOR_SIZE = 1536
    const embedding = Array.from(
      { length: VECTOR_SIZE },
      (_, i) => {
        const slice = hashText.slice(i * 3, (i + 1) * 3)
        return slice ? 
          (Array.from(slice).reduce((acc, char) => acc + char.charCodeAt(0), 0) / 1000) - 1 :
          Math.random() * 2 - 1
      }
    )

    console.log("Generated embedding vector of length:", embedding.length)

    // Save to Supabase
    console.log("Saving to Supabase")
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

