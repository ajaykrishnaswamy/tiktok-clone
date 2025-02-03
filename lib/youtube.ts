interface YouTubeVideo {
  id: string
  url: string
  thumbnail_url: string | null
  title: string
  description: string | null
  tiktok_users: {
    id: string
    username: string
    avatar_url: string
  }[]
  isYouTube: boolean
}

export function createYouTubeVideo(youtubeUrl: string): YouTubeVideo {
  // Extract video ID from URL
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = youtubeUrl.match(regExp)
  const videoId = match && match[2].length === 11 ? match[2] : null

  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  // Create a video object compatible with our player
  return {
    id: videoId,
    url: youtubeUrl,
    thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    title: "YouTube Video", // You can fetch the actual title using YouTube API if needed
    description: null,
    tiktok_users: [{
      id: "youtube",
      username: "YouTube",
      avatar_url: "https://www.youtube.com/favicon.ico"
    }],
    isYouTube: true
  }
} 