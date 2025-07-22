'use client';

import React, { useState, useRef } from 'react';

interface UploadedTrack {
  id: string;
  name: string;
  file: File;
  duration: number;
  size: string;
  uploadedAt: Date;
}

export default function MusicUploader() {
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => {
        resolve(0); // Return 0 if duration can't be determined
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  const validateAudioFile = (file: File): string | null => {
    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload MP3, WAV, OGG, M4A, or AAC files.';
    }

    if (file.size > maxSize) {
      return 'File too large. Maximum size is 50MB.';
    }

    return null;
  };

  const handleFileUpload = async (files: FileList) => {
    setError('');
    const file = files[0];

    if (!file) return;

    const validationError = validateAudioFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Get audio duration
      const duration = await getAudioDuration(file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create track object
      const newTrack: UploadedTrack = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        file,
        duration,
        size: formatFileSize(file.size),
        uploadedAt: new Date(),
      };

      setTracks(prev => [newTrack, ...prev]);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);

    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const removeTrack = (trackId: string) => {
    setTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : uploading
            ? 'border-muted bg-muted/20'
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="text-lg font-medium">Uploading...</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">🎵</div>
            <div>
              <h3 className="text-lg font-medium mb-2">Upload Your Music</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your audio files here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Choose Files
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              Supported formats: MP3, WAV, OGG, M4A, AAC (Max 50MB)
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <h4 className="font-medium text-red-800">Upload Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Tracks */}
      {tracks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Music Library</h3>
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎵</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{track.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>⏱️ {formatDuration(track.duration)}</span>
                      <span>📁 {track.size}</span>
                      <span>📅 {track.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeTrack(track.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Upload Tips</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Use high-quality audio files for the best listening experience</p>
          <p>• Ensure your files are properly tagged with artist and title information</p>
          <p>• Consider uploading lossless formats (WAV) for premium quality</p>
          <p>• Your uploaded music can be used in live streams and converted to NFTs</p>
          <p>• All uploads are stored securely and can be managed from your dashboard</p>
        </div>
      </div>
    </div>
  );
}
