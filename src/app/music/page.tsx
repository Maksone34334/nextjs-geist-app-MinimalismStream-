'use client';

import { useState } from 'react';
import MusicUploader from '@/components/MusicUploader';
import MusicPlayer from '@/components/MusicPlayer';

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'player'>('upload');

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Music Studio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your tracks, create playlists, and broadcast your music to the world. 
          Share your creativity and connect with your audience.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upload Music
          </button>
          <button
            onClick={() => setActiveTab('player')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'player'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Music Player
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'upload' && <MusicUploader />}
        {activeTab === 'player' && <MusicPlayer />}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-3">High-Quality Upload</h3>
          <p className="text-muted-foreground text-sm">
            Support for multiple audio formats including lossless WAV files. 
            Automatic metadata extraction and quality optimization.
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-3">Live Broadcasting</h3>
          <p className="text-muted-foreground text-sm">
            Stream your music live to audiences worldwide. 
            Real-time interaction with viewers and instant tip notifications.
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-3">NFT Integration</h3>
          <p className="text-muted-foreground text-sm">
            Convert your playlists into unique ERC-1155 NFTs. 
            Create collectible music experiences for your fans.
          </p>
        </div>
      </div>
    </div>
  );
}
