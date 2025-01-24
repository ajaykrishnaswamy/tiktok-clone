import { Bell } from "lucide-react"

export default function ActivityPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Activity</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
              <div className="h-16 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

