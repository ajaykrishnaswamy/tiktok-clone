"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { VideoGrid } from "@/components/video-grid"

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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      <VideoGrid />
    </div>
  )
}

