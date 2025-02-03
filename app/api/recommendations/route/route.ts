import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RecommendedVideo {
  video_id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  user_id: string;
  created_at: string;
  recommendation_score: number;
}

interface TikTokUser {
  id: string;
  username: string;
  avatar_url: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const excludeWatched = searchParams.get("excludeWatched") === "true";

    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get recommended videos with user information
    const { data: recommendedVideos, error: recommendationError } = await supabase
      .rpc("get_recommended_videos", {
        p_user_id: user.id,
        p_limit: limit,
        p_exclude_watched: excludeWatched,
      });

    if (recommendationError) {
      console.error("Error fetching recommendations:", recommendationError);
      return NextResponse.json(
        { error: "Failed to fetch recommendations" },
        { status: 500 }
      );
    }

    // Fetch user information for each video
    const videoUserIds = [...new Set(recommendedVideos.map((video: RecommendedVideo) => video.user_id))];
    const { data: users, error: usersError } = await supabase
      .from("tiktok_users")
      .select("id, username, avatar_url")
      .in("id", videoUserIds);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch user information" },
        { status: 500 }
      );
    }

    // Create a map of user information
    const userMap = new Map(users?.map((user: TikTokUser) => [user.id, user]));

    // Combine video and user information
    const videosWithUsers = recommendedVideos.map((video: RecommendedVideo) => ({
      ...video,
      tiktok_users: [{
        id: video.user_id,
        username: userMap.get(video.user_id)?.username || "",
        avatar_url: userMap.get(video.user_id)?.avatar_url || "",
      }],
    }));

    return NextResponse.json(videosWithUsers);
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 