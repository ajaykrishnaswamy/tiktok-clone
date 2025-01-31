"use client"

import { StudioLayout } from "@/components/layouts/studio-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, Video } from "lucide-react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      console.log("File selected:", file.name) // Debug log
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsUploading(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      
      // Debug logs
      console.log("Form data contents:")
      for (const [key, value] of formData.entries()) {
        console.log(key, ":", value)
      }
      
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      const responseData = await response.json()
      console.log("Upload response:", responseData) // Debug log

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      })

      // Force a complete page reload and navigation
      window.location.href = "/studio/posts"
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <StudioLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mb-2"
            >
              <Video className="w-4 h-4 mr-2" />
              Select Video
            </Button>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              disabled={isUploading}
              placeholder="Enter video title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              disabled={isUploading}
              placeholder="Enter video description"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !selectedFile} 
            className="w-full"
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </form>
      </div>
    </StudioLayout>
  )
} 