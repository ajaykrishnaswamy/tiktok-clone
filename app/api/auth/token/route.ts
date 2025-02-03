import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a custom JWT token that Supabase will accept
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: process.env.SUPABASE_AUTH_EMAIL!,
      password: process.env.SUPABASE_AUTH_PASSWORD!,
    });

    if (error || !session) {
      console.error('Supabase auth error:', error);
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }

    return NextResponse.json({ token: session.access_token });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
} 