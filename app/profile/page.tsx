import { Settings, Grid, Bookmark, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">@username</h1>
              <p className="text-muted-foreground">John Doe</p>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-4 text-center">
          <div className="flex-1">
            <div className="font-bold">0</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
          <div className="flex-1">
            <div className="font-bold">0</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="flex-1">
            <div className="font-bold">0</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
        </div>
        <Tabs defaultValue="videos">
          <TabsList className="w-full">
            <TabsTrigger value="videos" className="flex-1">
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">
              <Heart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">
              <Bookmark className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">No liked videos yet</div>
          </TabsContent>
          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">No saved videos yet</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

