export function VideoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted">
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-sm">
              <span>▶</span>
              <span>{Math.floor(Math.random() * 1000)}K</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 