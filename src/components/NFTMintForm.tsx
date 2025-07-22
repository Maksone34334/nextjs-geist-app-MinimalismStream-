'use client';

import React, { useState } from 'react';
import { mintPlaylistNFT, isWalletConnected, connectWallet } from '@/lib/web3';

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  coverArt?: string;
  createdAt: Date;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

// Mock playlist data
const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: '1',
    name: 'Midnight Vibes',
    description: 'Chill electronic beats for late night sessions',
    tracks: [
      { id: '1', title: 'Midnight Echoes', artist: 'Luna Beats', duration: 245 },
      { id: '2', title: 'Neon Dreams', artist: 'Luna Beats', duration: 198 },
      { id: '3', title: 'Digital Rain', artist: 'Luna Beats', duration: 312 }
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Synthwave Collection',
    description: 'Retro-futuristic synthwave anthology',
    tracks: [
      { id: '4', title: 'Neon Pulse', artist: 'Synth Wave', duration: 267 },
      { id: '5', title: 'Cyber Highway', artist: 'Synth Wave', duration: 289 },
      { id: '6', title: 'Electric Dreams', artist: 'Synth Wave', duration: 234 },
      { id: '7', title: 'Digital Sunset', artist: 'Synth Wave', duration: 301 }
    ],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Ambient Spaces',
    description: 'Atmospheric soundscapes for meditation and focus',
    tracks: [
      { id: '8', title: 'Floating Clouds', artist: 'Echo Chamber', duration: 456 },
      { id: '9', title: 'Deep Space', artist: 'Echo Chamber', duration: 378 },
      { id: '10', title: 'Ocean Waves', artist: 'Echo Chamber', duration: 423 }
    ],
    createdAt: new Date('2024-01-25')
  }
];

interface MintedNFT {
  id: string;
  playlistName: string;
  tokenId: string;
  transactionHash: string;
  mintedAt: Date;
  status: 'minting' | 'completed' | 'failed';
}

export default function NFTMintForm() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [mintingStatus, setMintingStatus] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const [nftMetadata, setNftMetadata] = useState({
    name: '',
    description: '',
    royaltyPercentage: 5,
    maxSupply: 100
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (tracks: Track[]): string => {
    const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
    return formatDuration(totalSeconds);
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setNftMetadata({
      name: playlist.name,
      description: playlist.description,
      royaltyPercentage: 5,
      maxSupply: 100
    });
    setError('');
  };

  const handleMintNFT = async () => {
    if (!selectedPlaylist) {
      setError('Please select a playlist to mint.');
      return;
    }

    if (!isWalletConnected()) {
      try {
        await connectWallet();
      } catch (err: any) {
        setError('Please connect your wallet to mint NFTs.');
        return;
      }
    }

    if (!nftMetadata.name.trim()) {
      setError('Please enter a name for your NFT.');
      return;
    }

    if (nftMetadata.maxSupply < 1 || nftMetadata.maxSupply > 10000) {
      setError('Max supply must be between 1 and 10,000.');
      return;
    }

    if (nftMetadata.royaltyPercentage < 0 || nftMetadata.royaltyPercentage > 20) {
      setError('Royalty percentage must be between 0% and 20%.');
      return;
    }

    setMintingStatus('minting');
    setError('');

    try {
      const playlistData = {
        name: nftMetadata.name,
        description: nftMetadata.description,
        tracks: selectedPlaylist.tracks.map(track => track.title),
        metadata: {
          originalPlaylistId: selectedPlaylist.id,
          totalTracks: selectedPlaylist.tracks.length,
          totalDuration: getTotalDuration(selectedPlaylist.tracks),
          artist: selectedPlaylist.tracks[0]?.artist || 'Various Artists',
          royaltyPercentage: nftMetadata.royaltyPercentage,
          maxSupply: nftMetadata.maxSupply,
          mintedAt: new Date().toISOString(),
          attributes: [
            { trait_type: 'Track Count', value: selectedPlaylist.tracks.length },
            { trait_type: 'Duration', value: getTotalDuration(selectedPlaylist.tracks) },
            { trait_type: 'Genre', value: 'Electronic' },
            { trait_type: 'Royalty %', value: nftMetadata.royaltyPercentage }
          ]
        }
      };

      const result = await mintPlaylistNFT(playlistData);

      const newMintedNFT: MintedNFT = {
        id: Date.now().toString(),
        playlistName: nftMetadata.name,
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
        mintedAt: new Date(),
        status: 'completed'
      };

      setMintedNFTs(prev => [newMintedNFT, ...prev]);
      setMintingStatus('success');

      // Reset form after successful mint
      setTimeout(() => {
        setSelectedPlaylist(null);
        setNftMetadata({
          name: '',
          description: '',
          royaltyPercentage: 5,
          maxSupply: 100
        });
        setMintingStatus('idle');
      }, 3000);

    } catch (err: any) {
      setError(err.message);
      setMintingStatus('error');
    }
  };

  const getStatusColor = (status: MintedNFT['status']) => {
    switch (status) {
      case 'minting': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: MintedNFT['status']) => {
    switch (status) {
      case 'minting': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Playlist Selection */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Select Playlist to Mint</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PLAYLISTS.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistSelect(playlist)}
              className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                selectedPlaylist?.id === playlist.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                {/* Playlist Cover */}
                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎵</span>
                </div>
                
                {/* Playlist Info */}
                <div>
                  <h4 className="font-semibold">{playlist.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {playlist.description}
                  </p>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{playlist.tracks.length} tracks</span>
                  <span>{getTotalDuration(playlist.tracks)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Playlist Details */}
      {selectedPlaylist && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Playlist Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Track List */}
            <div>
              <h4 className="font-medium mb-3">Tracks ({selectedPlaylist.tracks.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedPlaylist.tracks.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NFT Metadata Form */}
            <div className="space-y-4">
              <h4 className="font-medium">NFT Metadata</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">NFT Name</label>
                <input
                  type="text"
                  value={nftMetadata.name}
                  onChange={(e) => setNftMetadata(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter NFT name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={nftMetadata.description}
                  onChange={(e) => setNftMetadata(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={3}
                  placeholder="Describe your NFT collection"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Royalty %</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={nftMetadata.royaltyPercentage}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, royaltyPercentage: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Max Supply</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={nftMetadata.maxSupply}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, maxSupply: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mint Button */}
      {selectedPlaylist && (
        <div className="text-center">
          <button
            onClick={handleMintNFT}
            disabled={mintingStatus === 'minting'}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {mintingStatus === 'minting' ? 'Minting NFT...' : 'Mint as ERC-1155 NFT'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {mintingStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-green-500 text-xl">✅</div>
            <div>
              <h4 className="font-medium text-green-800">NFT Minted Successfully!</h4>
              <p className="text-green-700 text-sm mt-1">
                Your playlist has been converted to an ERC-1155 NFT on MONAD testnet.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <h4 className="font-medium text-red-800">Minting Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Minted NFTs History */}
      {mintedNFTs.length > 0 && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Your Minted NFTs</h3>
          <div className="space-y-3">
            {mintedNFTs.map((nft) => (
              <div
                key={nft.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-background"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getStatusIcon(nft.status)}</span>
                  <div>
                    <h4 className="font-medium">{nft.playlistName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Token ID: #{nft.tokenId}</span>
                      <span>Minted: {nft.mintedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getStatusColor(nft.status)}`}>
                    {nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {nft.transactionHash.substring(0, 10)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">About ERC-1155 Playlist NFTs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>• Convert your playlists into unique NFT collections</p>
            <p>• ERC-1155 standard allows multiple copies of the same NFT</p>
            <p>• Set custom royalty percentages for secondary sales</p>
          </div>
          <div className="space-y-2">
            <p>• Fans can collect and trade your music NFTs</p>
            <p>• Metadata includes track information and artwork</p>
            <p>• Minted on MONAD testnet for fast, low-cost transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
