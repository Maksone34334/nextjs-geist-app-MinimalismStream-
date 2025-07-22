"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Cloud,
} from "lucide-react"
import RealTimeTips from "./RealTimeTips"

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  src: string
  file?: File
  isCloudStored?: boolean
}

// -----------------------------------------------------------------------------
// Demo tracks served from /public/demo-audio. Filenames contain no spaces,
// ensuring Next.js resolves them correctly on both localhost and Vercel.
// -----------------------------------------------------------------------------
const DEMO_PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Loving You",
    artist: "DJ Osiris",
    duration: 0, // real duration set after metadata loads
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_MIkzSiLTOaZu8DPIeJIdS5TMo7Re/Ky9f3fiS1YRiu9W5SiUPdX/public/demo-audio/01.%20DJ%20Osiris%20-%20Loving%20You.mp3",
    isCloudStored: true,
  },
  {
    id: "2",
    title: "Hotspot",
    artist: "Dave Ross",
    duration: 0,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_MIkzSiLTOaZu8DPIeJIdS5TMo7Re/vUrRoAAfhFGvTSEGe2o87m/public/demo-audio/02.%20Dave%20Ross%20-%20Hotspot.mp3",
    isCloudStored: true,
  },
]

type RepeatMode = "none" | "one" | "all"

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEMO_PLAYLIST[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([0.7])
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [playlist, setPlaylist] = useState<Track[]>(DEMO_PLAYLIST)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none")
  const [isBuffering, setIsBuffering] = useState(false)
  const [bufferedRanges, setBufferedRanges] = useState<TimeRanges | null>(null)

  // Audio event handlers
  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
    setError("")
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
    setIsBuffering(false)
  }, [])

  const handleWaiting = useCallback(() => {
    setIsBuffering(true)
  }, [])

  const handlePlaying = useCallback(() => {
    setIsBuffering(false)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setBufferedRanges(audioRef.current.buffered)
    }
  }, [])

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      handleNext()
    }
  }, [repeatMode])

  const handleError = useCallback((e: Event) => {
    const audio = e.target as HTMLAudioElement
    let errorMessage = "Failed to load audio file"

    if (audio.error) {
      switch (audio.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio loading was aborted"
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error occurred while loading audio"
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio file is corrupted or unsupported"
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio format not supported"
          break
      }
    }

    setError(errorMessage)
    setIsLoading(false)
    setIsPlaying(false)
    setIsBuffering(false)
  }, [])

  // Setup audio element event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [
    handleLoadStart,
    handleLoadedMetadata,
    handleCanPlay,
    handleWaiting,
    handlePlaying,
    handleTimeUpdate,
    handleEnded,
    handleError,
  ])

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src
      audioRef.current.load()
      setCurrentTime(0)
      setDuration(0)
    }
  }, [currentTrack])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0]
    }
  }, [volume, isMuted])

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlay = async () => {
    if (!audioRef.current || !currentTrack) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
      setError("")
    } catch (err) {
      console.error("Playback error:", err)
      setError("Playback failed. Please try again.")
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const time = value[0]
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handlePrevious = () => {
    let newIndex
    if (isShuffled) {
      newIndex = Math.floor(Math.random() * playlist.length)
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1
    }
    setCurrentIndex(newIndex)
    setCurrentTrack(playlist[newIndex])
  }

  const handleNext = () => {
    let newIndex
    if (repeatMode === "all" && currentIndex === playlist.length - 1) {
      newIndex = 0
    } else if (isShuffled) {
      newIndex = Math.floor(Math.random() * playlist.length)
    } else {
      newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0
    }
    setCurrentIndex(newIndex)
    setCurrentTrack(playlist[newIndex])
  }

  const selectTrack = (track: Track, index: number) => {
    setCurrentTrack(track)
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ["none", "one", "all"]
    const currentModeIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentModeIndex + 1) % modes.length]
    setRepeatMode(nextMode)
  }

  const getBufferedPercentage = (): number => {
    if (!bufferedRanges || !duration || bufferedRanges.length === 0) return 0

    let buffered = 0
    for (let i = 0; i < bufferedRanges.length; i++) {
      buffered += bufferedRanges.end(i) - bufferedRanges.start(i)
    }
    return (buffered / duration) * 100
  }

  const addTrackFromFile = (file: File, blobUrl?: string) => {
    const url = blobUrl || URL.createObjectURL(file)
    const newTrack: Track = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      duration: 0,
      src: url,
      file,
      isCloudStored: !!blobUrl,
    }

    setPlaylist((prev) => [...prev, newTrack])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="text-red-500 text-xl">⚠️</div>
              <div>
                <h4 className="font-medium text-red-800">Playback Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Now Playing */}
      {currentTrack && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              {/* Album Art */}
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center relative">
                <span className="text-3xl">🎵</span>
                {(isLoading || isBuffering) && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-900">{currentTrack.title}</h2>
                  {currentTrack.isCloudStored && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Cloud className="w-3 h-3 mr-1" />
                      Stored
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-gray-600">{currentTrack.artist}</p>

                {/* Status Badges */}
                <div className="flex items-center space-x-2 mt-2">
                  {isPlaying && (
                    <Badge variant="default" className="bg-green-600">
                      Playing
                    </Badge>
                  )}
                  {isBuffering && <Badge variant="secondary">Buffering...</Badge>}
                  {isLoading && <Badge variant="secondary">Loading...</Badge>}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-2">
                  <div className="relative">
                    {/* Buffered Progress */}
                    <div
                      className="absolute top-0 left-0 h-2 bg-gray-300 rounded-full"
                      style={{ width: `${getBufferedPercentage()}%` }}
                    />
                    {/* Playback Progress */}
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                      disabled={!duration}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            {/* Shuffle */}
            <Button variant={isShuffled ? "default" : "outline"} size="sm" onClick={toggleShuffle}>
              <Shuffle className="w-4 h-4" />
            </Button>

            {/* Previous */}
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              <SkipBack className="w-4 h-4" />
            </Button>

            {/* Play/Pause */}
            <Button
              onClick={handlePlay}
              disabled={!currentTrack || isLoading}
              size="lg"
              className="w-12 h-12 rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            {/* Stop */}
            <Button variant="outline" size="sm" onClick={handleStop}>
              <Square className="w-4 h-4" />
            </Button>

            {/* Next */}
            <Button variant="outline" size="sm" onClick={handleNext}>
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Repeat */}
            <Button variant={repeatMode !== "none" ? "default" : "outline"} size="sm" onClick={toggleRepeat}>
              {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted || volume[0] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <div className="w-32">
              <Slider value={isMuted ? [0] : volume} max={1} step={0.1} onValueChange={handleVolumeChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Playlist</h3>
          <div className="space-y-2">
            {playlist.map((track, index) => (
              <button
                key={track.id}
                onClick={() => selectTrack(track, index)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  currentTrack?.id === track.id ? "bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                      currentTrack?.id === track.id ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {currentTrack?.id === track.id && isPlaying ? "🎵" : index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{track.title}</span>
                      {track.isCloudStored && (
                        <Cloud
                          className={`w-3 h-3 ${currentTrack?.id === track.id ? "text-white/70" : "text-blue-600"}`}
                        />
                      )}
                    </div>
                    <div className={`text-sm ${currentTrack?.id === track.id ? "text-gray-300" : "text-gray-600"}`}>
                      {track.artist}
                    </div>
                  </div>
                </div>
                <div className={`text-sm ${currentTrack?.id === track.id ? "text-gray-300" : "text-gray-600"}`}>
                  {formatTime(track.duration)}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Tips Integration */}
      <RealTimeTips artistAddress="0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4" artistName="Demo Artist" />

      {/* Broadcasting Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Live Broadcasting</h3>
              <p className="text-gray-600 mt-1">
                Share your music with live stream viewers and receive tips in real-time
              </p>
              {currentTrack && isPlaying && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    🔴 Now Playing: {currentTrack.title}
                  </Badge>
                </div>
              )}
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={!currentTrack}>
              {isPlaying ? "Broadcasting Live" : "Start Broadcasting"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
