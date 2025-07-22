'use client';

import React, { useRef, useState, useEffect } from 'react';

interface StreamStats {
  viewers: number;
  duration: string;
  quality: string;
}

export default function LiveStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [stats, setStats] = useState<StreamStats>({
    viewers: 0,
    duration: '00:00:00',
    quality: 'HD 720p'
  });
  const [startTime, setStartTime] = useState<number | null>(null);

  // Update duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (streaming && startTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        setStats(prev => ({
          ...prev,
          duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streaming, startTime]);

  // Simulate viewer count changes
  useEffect(() => {
    if (streaming) {
      const interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 3) - 1)
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [streaming]);

  const startStream = async () => {
    setError(null);
    
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setMediaStream(stream);
      setStreaming(true);
      setStartTime(Date.now());
      setStats(prev => ({ ...prev, viewers: Math.floor(Math.random() * 10) + 1 }));

      // In a real implementation, you would start streaming to your server here
      console.log('Stream started with settings:', {
        video: stream.getVideoTracks()[0]?.getSettings(),
        audio: stream.getAudioTracks()[0]?.getSettings()
      });

    } catch (err: any) {
      console.error('Stream start failed:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera and microphone access denied. Please allow permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Please connect your devices and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera or microphone is already in use by another application.');
      } else {
        setError(`Failed to start stream: ${err.message}`);
      }
    }
  };

  const stopStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setMediaStream(null);
    setStreaming(false);
    setStartTime(null);
    setStats({
      viewers: 0,
      duration: '00:00:00',
      quality: 'HD 720p'
    });
    setError(null);
  };

  const toggleMute = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const isAudioEnabled = mediaStream?.getAudioTracks()[0]?.enabled ?? true;
  const isVideoEnabled = mediaStream?.getVideoTracks()[0]?.enabled ?? true;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stream Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          playsInline
        />
        
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/40 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                </div>
              </div>
              <p className="text-muted-foreground">Stream preview will appear here</p>
            </div>
          </div>
        )}

        {/* Stream Stats Overlay */}
        {streaming && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
            <div className="text-xs space-y-1">
              <div>👥 {stats.viewers} viewers</div>
              <div>⏱️ {stats.duration}</div>
              <div>📺 {stats.quality}</div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <h4 className="font-medium text-red-800">Stream Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stream Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        {!streaming ? (
          <button
            onClick={startStream}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span>Start Live Stream</span>
          </button>
        ) : (
          <>
            <button
              onClick={stopStream}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Stop Stream
            </button>
            
            <button
              onClick={toggleMute}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isAudioEnabled 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {isAudioEnabled ? '🎤 Mute' : '🔇 Unmute'}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isVideoEnabled 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {isVideoEnabled ? '📹 Camera On' : '📷 Camera Off'}
            </button>
          </>
        )}
      </div>

      {/* Stream Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-2">Stream Quality</h3>
          <p className="text-sm text-muted-foreground">
            Automatically optimized for your connection and device capabilities
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-2">Audience Engagement</h3>
          <p className="text-sm text-muted-foreground">
            Viewers can tip you directly during the stream using Web3 wallets
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-2">Stream Settings</h3>
          <p className="text-sm text-muted-foreground">
            HD quality with noise cancellation and auto-gain control enabled
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Ensure your camera and microphone are connected and working</p>
          <p>• Grant browser permissions when prompted</p>
          <p>• Click "Start Live Stream" to begin broadcasting</p>
          <p>• Use the controls to mute/unmute or turn camera on/off during stream</p>
          <p>• Viewers can send you tips in real-time using the tip feature</p>
          <p>• Click "Stop Stream" when you're finished broadcasting</p>
        </div>
      </div>
    </div>
  );
}
