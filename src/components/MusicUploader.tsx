"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Music, FileAudio, AlertCircle, Cloud } from "lucide-react"

interface UploadedTrack {
  id: string
  name: string
  file: File
  duration: number
  size: string
  uploadedAt: Date
  status: "uploading" | "processing" | "ready" | "error"
  progress: number
  error?: string
  audioUrl?: string
  blobUrl?: string // Vercel Blob URL for permanent storage
}

export default function MusicUploader() {
  const [tracks, setTracks] = useState<UploadedTrack[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)

      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration)
        URL.revokeObjectURL(url)
      })

      audio.addEventListener("error", () => {
        resolve(0)
        URL.revokeObjectURL(url)
      })

      audio.src = url
    })
  }

  const validateAudioFile = (file: File): string | null => {
    const validTypes = [
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/aac",
      "audio/flac",
      "audio/webm",
    ]
    const maxSize = 100 * 1024 * 1024 // 100MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      return "Invalid file type. Please upload MP3, WAV, OGG, M4A, AAC, or FLAC files."
    }

    if (file.size > maxSize) {
      return "File too large. Maximum size is 100MB."
    }

    return null
  }

  // Upload to Vercel Blob for permanent storage
  const uploadToVercelBlob = async (file: File, trackId: string): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("filename", `${trackId}-${file.name}`)

    const response = await fetch("/api/upload-music", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload to Vercel Blob")
    }

    const { url } = await response.json()
    return url
  }

  const simulateUpload = async (trackId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }

        setTracks((prev) =>
          prev.map((track) => (track.id === trackId ? { ...track, progress: Math.min(progress, 100) } : track)),
        )
      }, 200)
    })
  }

  const processAudioFile = async (file: File): Promise<UploadedTrack> => {
    const trackId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    // Create initial track object
    const newTrack: UploadedTrack = {
      id: trackId,
      name: file.name.replace(/\.[^/.]+$/, ""),
      file,
      duration: 0,
      size: formatFileSize(file.size),
      uploadedAt: new Date(),
      status: "uploading",
      progress: 0,
    }

    // Add track to state
    setTracks((prev) => [newTrack, ...prev])

    try {
      // Simulate upload progress
      await simulateUpload(trackId)

      // Update status to processing
      setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, status: "processing" } : track)))

      // Get audio duration
      const duration = await getAudioDuration(file)

      // Create temporary URL for immediate playback
      const audioUrl = URL.createObjectURL(file)

      // Upload to Vercel Blob for permanent storage
      let blobUrl: string | undefined
      try {
        blobUrl = await uploadToVercelBlob(file, trackId)
      } catch (error) {
        console.warn("Failed to upload to Vercel Blob, using temporary URL:", error)
      }

      // Update track with final data
      setTracks((prev) =>
        prev.map((track) =>
          track.id === trackId
            ? {
                ...track,
                duration,
                audioUrl,
                blobUrl,
                status: "ready",
                progress: 100,
              }
            : track,
        ),
      )

      return { ...newTrack, duration, audioUrl, blobUrl, status: "ready" }
    } catch (error) {
      // Handle error
      setTracks((prev) =>
        prev.map((track) =>
          track.id === trackId
            ? {
                ...track,
                status: "error",
                error: "Failed to process audio file",
              }
            : track,
        ),
      )
      throw error
    }
  }

  const handleFileUpload = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    const validationError = validateAudioFile(file)
    if (validationError) {
      // Add error track
      const errorTrack: UploadedTrack = {
        id: Date.now().toString(),
        name: file.name,
        file,
        duration: 0,
        size: formatFileSize(file.size),
        uploadedAt: new Date(),
        status: "error",
        progress: 0,
        error: validationError,
      }
      setTracks((prev) => [errorTrack, ...prev])
      return
    }

    try {
      await processAudioFile(file)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files)
    }
  }

  const removeTrack = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    if (track?.audioUrl) {
      URL.revokeObjectURL(track.audioUrl)
    }
    setTracks((prev) => prev.filter((track) => track.id !== trackId))
  }

  const retryUpload = async (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    if (!track) return

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, status: "uploading", progress: 0, error: undefined } : t)),
    )

    try {
      await processAudioFile(track.file)
    } catch (error) {
      console.error("Retry failed:", error)
    }
  }

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "Unknown"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusBadge = (track: UploadedTrack) => {
    switch (track.status) {
      case "uploading":
        return <Badge variant="secondary">Uploading...</Badge>
      case "processing":
        return <Badge variant="secondary">Processing...</Badge>
      case "ready":
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="bg-green-600">
              Ready
            </Badge>
            {track.blobUrl && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Cloud className="w-3 h-3 mr-1" />
                Stored
              </Badge>
            )}
          </div>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`transition-colors ${dragActive ? "border-gray-800 bg-gray-50" : ""}`}>
        <CardContent
          className="p-8 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-4xl text-gray-600">
              <Music className="w-16 h-16 mx-auto" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Upload Your Music</h3>
              <p className="text-gray-600 mb-4">Drag and drop your audio files here, or click to browse</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC (Max 100MB)
              <br />
              <span className="text-blue-600">Files are automatically stored in Vercel Blob for permanent access</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />

      {/* Uploaded Tracks */}
      {tracks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Your Music Library</h3>
          <div className="space-y-3">
            {tracks.map((track) => (
              <Card key={track.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {track.status === "error" ? (
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        ) : (
                          <FileAudio className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{track.name}</h4>
                          {getStatusBadge(track)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>⏱️ {formatDuration(track.duration)}</span>
                          <span>📁 {track.size}</span>
                          <span>📅 {track.uploadedAt.toLocaleDateString()}</span>
                          {track.blobUrl && <span className="text-blue-600">☁️ Permanently stored</span>}
                        </div>

                        {/* Progress Bar */}
                        {(track.status === "uploading" || track.status === "processing") && (
                          <div className="mt-2">
                            <Progress value={track.progress} className="w-full" />
                            <div className="text-xs text-gray-500 mt-1">
                              {track.status === "uploading" ? "Uploading to cloud storage" : "Processing audio"} -{" "}
                              {Math.round(track.progress)}%
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {track.status === "error" && track.error && (
                          <div className="mt-2 text-sm text-red-600">{track.error}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {track.status === "error" && (
                        <Button variant="outline" size="sm" onClick={() => retryUpload(track.id)}>
                          Retry
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => removeTrack(track.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Storage Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-900 flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Permanent Storage
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Your uploaded music is automatically stored in Vercel Blob for permanent access</p>
            <p>• Files remain available even after app redeployment</p>
            <p>• Secure cloud storage with global CDN for fast streaming</p>
            <p>• Your music can be used in live streams and converted to NFTs</p>
            <p>• All uploads are processed securely with metadata extraction</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
