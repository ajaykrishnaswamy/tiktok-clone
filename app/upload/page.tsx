"use client"

import { useState } from "react"
import { Upload, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true)
    } else if (e.type === "dragleave") {
      setDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      setFile(files[0])
      await handleUpload(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setFile(files[0])
      await handleUpload(files[0])
    }
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("video", file)

    try {
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/video/${data.id}`)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
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
            <h3 className="text-lg font-semibold mb-2">Select video to upload</h3>
            <p className="text-sm text-muted-foreground mb-4">Or drag and drop a file</p>
            <ul className="text-xs text-muted-foreground mb-6 space-y-2">
              <li>MP4 or WebM</li>
              <li>720x1280 resolution or higher</li>
              <li>Up to 60 minutes</li>
              <li>Less than 2 GB</li>
            </ul>
            <label htmlFor="video-upload">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Select file
              </Button>
            </label>
            <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
          </div>
        </div>
      </div>
    </div>
  )
}

