"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Upload, Music, X, CheckCircle } from "lucide-react"

interface UploadedTrack {
  id: string
  name: string
  size: number
  duration?: number
  status: "uploading" | "processing" | "ready" | "error"
  progress: number
  url?: string
}

interface MusicUploaderProps {
  onFiles: (files: File[]) => void
}

export default function MusicUploader({ onFiles }: MusicUploaderProps) {
  const [tracks, setTracks] = useState<UploadedTrack[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const processFiles = useCallback(
    async (files: File[]) => {
      const newTracks: UploadedTrack[] = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: "uploading" as const,
        progress: 0,
      }))

      setTracks((prev) => [...prev, ...newTracks])
      onFiles(files)

      // Simulate upload process
      for (const track of newTracks) {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, progress } : t)))
        }

        // Set to processing
        setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, status: "processing" } : t)))

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Set to ready
        setTracks((prev) =>
          prev.map((t) =>
            t.id === track.id
              ? {
                  ...t,
                  status: "ready",
                  url: URL.createObjectURL(files.find((f) => f.name === track.name)!),
                }
              : t,
          ),
        )
      }
    },
    [onFiles],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("audio/"))
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music size={20} />
          Music Uploader
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-white bg-white/5" : "border-gray-600 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-white mb-2">Drag & drop music files here</p>
          <p className="text-gray-400 text-sm mb-4">or</p>

          <input
            id="music-upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="music-upload">
            <Button variant="outline" className="cursor-pointer bg-transparent">
              Choose Files
            </Button>
          </label>

          <p className="text-xs text-gray-500 mt-4">Supported: MP3, WAV, OGG, M4A, AAC, FLAC (max 100MB each)</p>
        </div>

        {tracks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Uploaded Tracks</h3>
            {tracks.map((track) => (
              <div key={track.id} className="border border-gray-600 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{track.name}</p>
                    <p className="text-gray-400 text-xs">{formatFileSize(track.size)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {track.status === "ready" && <CheckCircle size={16} className="text-green-500" />}
                    <Button variant="ghost" size="sm" onClick={() => removeTrack(track.id)}>
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                {track.status === "uploading" && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${track.progress}%` }}
                    />
                  </div>
                )}

                {track.status === "processing" && <div className="text-xs text-yellow-400">Processing...</div>}

                {track.status === "ready" && <div className="text-xs text-green-400">Ready to stream</div>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
