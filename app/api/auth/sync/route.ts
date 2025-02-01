import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a username if not provided
    const generateUsername = () => {
      if (user.username) return user.username
      if (user.emailAddresses[0]?.emailAddress) {
        return user.emailAddresses[0].emailAddress.split('@')[0]
      }
      return `user_${user.id.slice(-8)}`
    }

    // Check if user already exists in Supabase
    const { data: existingUser } = await supabase
      .from("tiktok_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!existingUser) {
      const { error: insertError } = await supabase
        .from("tiktok_users")
        .insert({
          id: user.id,
          username: generateUsername(),
          email: user.emailAddresses[0]?.emailAddress,
          avatar_url: user.imageUrl,
          bio: "",
          created_at: new Date(user.createdAt).toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Auth sync error:", error)
    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 