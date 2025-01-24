import { MessageCircle } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="text-center py-12 space-y-4">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Share videos and chat with your friends</p>
        </div>
      </div>
    </div>
  )
}

