import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Sync user to Supabase
    const { data, error } = await supabase
      .from("tiktok_users")
      .upsert({
        id: user.id,
        username: user.username || `user_${user.id}`,
        email: user.emailAddresses[0].emailAddress,
        avatar_url: user.imageUrl,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error("Failed to sync user:", error)
      return new Response("Failed to sync user", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Auth sync error:", error)
    return new Response("Auth sync failed", { status: 500 })
  }
} 