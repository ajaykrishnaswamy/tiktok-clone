import { Suspense } from "react"
import { StudioLayout } from "@/components/layouts/studio-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

async function getAnalytics(userId: string) {
  const { data: videos, error } = await supabase
    .from("tiktok_videos")
    .select(`
      id,
      title,
      views_count,
      likes_count,
      comments_count,
      created_at
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) throw error

  const totals = videos?.reduce(
    (acc, video) => ({
      views: acc.views + (video.views_count || 0),
      likes: acc.likes + (video.likes_count || 0),
      comments: acc.comments + (video.comments_count || 0),
    }),
    { views: 0, likes: 0, comments: 0 }
  ) || { views: 0, likes: 0, comments: 0 }

  return {
    totals,
    recentVideos: videos || [],
  }
}

async function Analytics() {
  const user = await currentUser()
  if (!user) return null

  const { totals, recentVideos } = await getAnalytics(user.id)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.views}</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.likes}</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.comments}</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {recentVideos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No videos uploaded yet
            </div>
          ) : (
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <div key={video.id} className="flex justify-between items-center">
                  <div className="font-medium">{video.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(video.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default function StudioPage() {
  return (
    <StudioLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Studio Dashboard</h1>
          <Link href="/studio/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-4 w-24 bg-muted rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-16 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <Analytics />
        </Suspense>
      </div>
    </StudioLayout>
  )
} 