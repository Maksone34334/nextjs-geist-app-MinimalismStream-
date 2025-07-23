"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Music } from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  src: string
  duration?: number
}

const DEMO_TRACKS: Track[] = [
  {
    id: "1",
    title: "Loving You",
    artist: "DJ Osiris",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_MIkzSiLTOaZu8DPIeJIdS5TMo7Re/Ky9f3fiS1YRiu9W5SiUPdX/public/demo-audio/01.%20DJ%20Osiris%20-%20Loving%20You.mp3",
  },
  {
    id: "2",
    title: "Hotspot",
    artist: "Dave Ross",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_MIkzSiLTOaZu8DPIeJIdS5TMo7Re/vUrRoAAfhFGvTSEGe2o87m/public/demo-audio/02.%20Dave%20Ross%20-%20Hotspot.mp3",
  },
]

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [tracks] = useState<Track[]>(DEMO_TRACKS)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none")
  const [isLoading, setIsLoading] = useState(false)

  const currentTrack = tracks[currentTrackIndex]

  const handlePlay = useCallback(async () => {
    if (!audioRef.current) return

    try {
      setIsLoading(true)
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error("Playback error:", error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handlePause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }, [isPlaying, handlePlay, handlePause])

  const nextTrack = useCallback(() => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    }
  }, [isShuffled, tracks.length])

  const previousTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }, [tracks.length])

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        handlePlay()
      }
    } else if (repeatMode === "all" || currentTrackIndex < tracks.length - 1) {
      nextTrack()
    } else {
      setIsPlaying(false)
    }
  }, [repeatMode, currentTrackIndex, tracks.length, nextTrack, handlePlay])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }, [])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }, [isMuted, volume])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src
      audioRef.current.load()
      setCurrentTime(0)
      setDuration(0)

      if (isPlaying) {
        handlePlay()
      }
    }
  }, [currentTrackIndex, currentTrack, isPlaying, handlePlay])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music size={20} />
          Music Player
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />

        {/* Current Track Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">{currentTrack?.title || "No track selected"}</h3>
          <p className="text-gray-400">{currentTrack?.artist || "Unknown artist"}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShuffled(!isShuffled)}
            className={isShuffled ? "text-white" : "text-gray-400"}
          >
            <Shuffle size={20} />
          </Button>

          <Button variant="ghost" size="sm" onClick={previousTrack}>
            <SkipBack size={20} />
          </Button>

          <Button size="lg" onClick={togglePlayPause} disabled={isLoading} className="rounded-full w-12 h-12">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </Button>

          <Button variant="ghost" size="sm" onClick={nextTrack}>
            <SkipForward size={20} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const modes: Array<"none" | "one" | "all"> = ["none", "one", "all"]
              const currentIndex = modes.indexOf(repeatMode)
              const nextMode = modes[(currentIndex + 1) % modes.length]
              setRepeatMode(nextMode)
            }}
            className={repeatMode !== "none" ? "text-white" : "text-gray-400"}
          >
            <Repeat size={20} />
            {repeatMode === "one" && <span className="absolute -top-1 -right-1 text-xs">1</span>}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Track List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Playlist</h4>
          <div className="space-y-1">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                  index === currentTrackIndex ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                }`}
                onClick={() => setCurrentTrackIndex(index)}
              >
                <div className="w-6 text-center">
                  {index === currentTrackIndex && isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-white animate-pulse"></div>
                      <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
