"use client"

import { StudioLayout } from "@/components/layouts/studio-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, Video } from "lucide-react"
import { useState } from "react"

export default function UploadPage() {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true)
    } else if (e.type === "dragleave") {
      setDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      setFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !title) {
      toast({
        title: "Error",
        description: "Please provide a title and select a video file",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("video", file)
      formData.append("title", title)
      formData.append("description", description)

      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      })

      // Reset form
      setFile(null)
      setTitle("")
      setDescription("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <StudioLayout>
      <div className="container max-w-4xl mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Upload Video</h1>

        <div
          className={`border-2 border-dashed rounded-lg p-12 ${
            dragging ? "border-primary bg-primary/10" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Video className="w-16 h-16 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {file ? file.name : "Select video to upload"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Or drag and drop a file
            </p>
            <ul className="text-xs text-muted-foreground mb-6 space-y-2">
              <li>MP4 or WebM</li>
              <li>720x1280 resolution or higher</li>
              <li>Up to 60 minutes</li>
              <li>Less than 2 GB</li>
            </ul>
            <label htmlFor="video-upload">
              <Button disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Select file
              </Button>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>
        </div>

        {file && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title that describes your video"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers more about your video"
                disabled={uploading}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        )}
      </div>
    </StudioLayout>
  )
} 