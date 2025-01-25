import { Video } from "lucide-react"

export default function LivePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <Video className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">LIVE</h1>
        <p className="text-muted-foreground">Watch live streams from your favorite creators.</p>
      </div>
    </div>
  )
} 