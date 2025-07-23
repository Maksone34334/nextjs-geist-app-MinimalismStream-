"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Play, Square, Users, Eye } from "lucide-react"

export default function LiveStream() {
  const [isLive, setIsLive] = useState(false)
  const [viewers, setViewers] = useState(0)

  const toggleStream = () => {
    setIsLive(!isLive)
    setViewers(isLive ? 0 : Math.floor(Math.random() * 100) + 1)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Live Stream</CardTitle>
          <div className="flex items-center gap-4">
            {isLive && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                LIVE
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <Eye size={16} />
              {viewers}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="aspect-video w-full rounded border border-white bg-black flex items-center justify-center">
          {isLive ? (
            <div className="text-center">
              <div className="h-32 w-32 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Users size={48} className="text-white" />
              </div>
              <p className="text-white">Streaming live...</p>
            </div>
          ) : (
            <div className="text-center">
              <Play size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-400">Stream offline</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button onClick={toggleStream} className="flex items-center gap-2">
            {isLive ? <Square size={16} /> : <Play size={16} />}
            {isLive ? "Stop Stream" : "Start Stream"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
