"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MusicUploader from "@/components/MusicUploader"
import MusicPlayer from "@/components/MusicPlayer"

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "player">("player")

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Music Studio</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your tracks, create playlists, and broadcast your music to the world. Share your creativity and connect
          with your audience.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <Card>
          <CardContent className="p-1">
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "player" ? "default" : "ghost"}
                onClick={() => setActiveTab("player")}
                className={activeTab === "player" ? "bg-gray-800 text-white" : "text-gray-600"}
              >
                Music Player
              </Button>
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                onClick={() => setActiveTab("upload")}
                className={activeTab === "upload" ? "bg-gray-800 text-white" : "text-gray-600"}
              >
                Upload Music
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === "upload" && <MusicUploader />}
        {activeTab === "player" && <MusicPlayer />}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">High-Quality Streaming</h3>
            <p className="text-gray-600 text-sm">
              Real-time audio streaming with buffering optimization and network error handling. Support for multiple
              audio formats with automatic quality adjustment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Live Broadcasting</h3>
            <p className="text-gray-600 text-sm">
              Stream your music live to audiences worldwide with real-time interaction. Instant tip notifications and
              viewer engagement features.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Web3 Integration</h3>
            <p className="text-gray-600 text-sm">
              Convert your playlists into unique ERC-1155 NFTs on MONAD testnet. Receive tips in real-time through Web3
              wallet integration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
