"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const categories = [
  "All",
  "Singing & Dancing",
  "Comedy",
  "Sports",
  "Anime & Comics",
  "Relationship",
  "Shows",
  "Lipsync",
  "Daily Life",
  "Beauty Care",
  "Games",
  "Society",
  "Outfit",
  "Cars",
  "Food",
]

const videos = [
  {
    id: "1",
    thumbnail: "https://i.imgur.com/1.jpg",
    views: "1.9M",
    username: "user1",
    description: "When you think the locals are being nice but they're making you a target",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    thumbnail: "https://i.imgur.com/2.jpg",
    views: "2.3M",
    username: "user2",
    description: "He is a tall king",
    avatar: "/placeholder.svg",
  },
  // Add more video data...
]

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search videos, users, or sounds..." className="pl-10" />
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeCategory === category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {category}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="space-y-2">
            <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.description}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-sm">
                <span>▶</span>
                <span>{video.views}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <img src={video.avatar || "/placeholder.svg"} alt={video.username} className="w-8 h-8 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{video.username}</p>
                <p className="text-sm text-muted-foreground truncate">{video.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

