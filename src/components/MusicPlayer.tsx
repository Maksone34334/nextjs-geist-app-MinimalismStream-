'use client';

import React, { useState, useRef, useEffect } from 'react';
import RealTimeTips from './RealTimeTips';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src: string;
}

// Real audio playlist data with generated test files
const DEMO_PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'Midnight Echoes',
    artist: 'Luna Beats',
    duration: 30,
    src: '/demo-audio/track1.wav'
  },
  {
    id: '2',
    title: 'Digital Dreams',
    artist: 'Echo Chamber',
    duration: 25,
    src: '/demo-audio/track2.wav'
  },
  {
    id: '3',
    title: 'Neon Pulse',
    artist: 'Synth Wave',
    duration: 35,
    src: '/demo-audio/track3.wav'
  },
  {
    id: '4',
    title: 'Binary Sunset',
    artist: 'Digital Dreams',
    duration: 28,
    src: '/demo-audio/track4.wav'
  }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEMO_PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [playlist] = useState<Track[]>(DEMO_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load audio. Using demo mode.');
      setIsLoading(false);
    };
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
      setError('');
    } catch (err) {
      setError('Playback failed. Demo mode active.');
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePrevious = () => {
    let newIndex;
    if (isShuffled) {
      newIndex = Math.floor(Math.random() * playlist.length);
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    }
    setCurrentIndex(newIndex);
    setCurrentTrack(playlist[newIndex]);
    setCurrentTime(0);
  };

  const handleNext = () => {
    let newIndex;
    if (repeatMode === 'all' && currentIndex === playlist.length - 1) {
      newIndex = 0;
    } else if (isShuffled) {
      newIndex = Math.floor(Math.random() * playlist.length);
    } else {
      newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    }
    setCurrentIndex(newIndex);
    setCurrentTrack(playlist[newIndex]);
    setCurrentTime(0);
  };

  const selectTrack = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return '🔂';
      case 'all': return '🔁';
      default: return '↩️';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <audio ref={audioRef} preload="metadata" />

      {/* Error Display */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-500 text-xl">⚠️</div>
            <div>
              <h4 className="font-medium text-yellow-800">Demo Mode</h4>
              <p className="text-yellow-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Now Playing */}
      {currentTrack && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center space-x-6">
            {/* Album Art Placeholder */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
              <span className="text-3xl">🎵</span>
            </div>

            {/* Track Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
              <p className="text-lg text-muted-foreground">{currentTrack.artist}</p>
              
              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <input
                  type="range"
                  min="0"
                  max={currentTrack.duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="text-primary">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Controls */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-center space-x-6">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              isShuffled ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title="Shuffle"
          >
            🔀
          </button>

          {/* Previous */}
          <button
            onClick={handlePrevious}
            className="p-3 hover:bg-muted rounded-lg transition-colors"
            title="Previous"
          >
            ⏮️
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlay}
            disabled={!currentTrack || isLoading}
            className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="p-3 hover:bg-muted rounded-lg transition-colors"
            title="Stop"
          >
            ⏹️
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="p-3 hover:bg-muted rounded-lg transition-colors"
            title="Next"
          >
            ⏭️
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-lg transition-colors ${
              repeatMode !== 'none' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-32 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Playlist */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Playlist</h3>
        <div className="space-y-2">
          {playlist.map((track, index) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track, index)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                currentTrack?.id === track.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center text-sm">
                  {currentTrack?.id === track.id && isPlaying ? '🎵' : index + 1}
                </div>
                <div>
                  <div className="font-medium">{track.title}</div>
                  <div className="text-sm text-muted-foreground">{track.artist}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatTime(track.duration)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Tips Integration */}
      <RealTimeTips 
        artistAddress="0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4" 
        artistName="Demo Artist" 
      />

      {/* Broadcasting Controls */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Live Broadcasting</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Live Broadcast</p>
            <p className="text-sm text-muted-foreground">
              Share your music with live stream viewers and receive tips in real-time
            </p>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Start Broadcasting
          </button>
        </div>
      </div>
    </div>
  );
}
