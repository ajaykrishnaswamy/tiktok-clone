import { Users } from "lucide-react"

export default function FollowingPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Following</h1>
        <p className="text-muted-foreground">Follow accounts to see their latest videos here.</p>
      </div>
    </div>
  )
}

