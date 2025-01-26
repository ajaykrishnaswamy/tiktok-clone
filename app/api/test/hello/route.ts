import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    return NextResponse.json({
      message: "Hello World - Protected",
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
} 