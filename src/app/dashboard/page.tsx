'use client';

import { useState, useEffect } from 'react';
import { getArtistEarnings, isWalletConnected, connectWallet } from '@/lib/web3';
import type { EarningsData, TipTransaction } from '@/lib/web3';

export default function DashboardPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletAndLoadData();
  }, []);

  const checkWalletAndLoadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!isWalletConnected()) {
        setWalletConnected(false);
        setIsLoading(false);
        return;
      }

      setWalletConnected(true);
      
      // In a real app, you'd get the artist's address from the connected wallet
      const mockArtistAddress = '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4';
      const earningsData = await getArtistEarnings(mockArtistAddress);
      setEarnings(earningsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      await checkWalletAndLoadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.slice(-4)}`;
  };

  if (!walletConnected) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Artist Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your wallet to view your earnings, manage your content, and track your performance.
          </p>
        </div>

        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="border border-border rounded-lg p-8 bg-card">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your Web3 wallet to access your artist dashboard and view your earnings.
            </p>
            <button
              onClick={handleConnectWallet}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Artist Dashboard</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Artist Dashboard</h1>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-4xl">⚠️</div>
              <h3 className="font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={checkWalletAndLoadData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Artist Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track your earnings, manage your content, and grow your audience.
        </p>
      </div>

      {/* Earnings Overview */}
      {earnings && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold">{earnings.totalEarnings.toFixed(2)} MON</div>
            <p className="text-sm text-muted-foreground mt-1">
              From {earnings.tipCount} tips received
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Average Tip</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold">{earnings.averageTip.toFixed(2)} MON</div>
            <p className="text-sm text-muted-foreground mt-1">
              Per tip received
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Tips</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold">{earnings.tipCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Tips received all time
            </p>
          </div>
        </div>
      )}

      {/* Recent Tips */}
      {earnings && earnings.recentTips.length > 0 && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Recent Tips</h3>
          <div className="space-y-3">
            {earnings.recentTips.map((tip) => (
              <div
                key={tip.hash}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-background"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">💰</span>
                  </div>
                  <div>
                    <p className="font-medium">{tip.amount} MON</p>
                    <p className="text-sm text-muted-foreground">
                      From: {formatAddress(tip.recipient)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {tip.status === 'confirmed' ? '✅ Confirmed' : '🔄 Pending'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(tip.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Content Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Uploaded Tracks</p>
                <p className="text-sm text-muted-foreground">12 tracks</p>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                Manage
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Playlists</p>
                <p className="text-sm text-muted-foreground">3 playlists</p>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                Manage
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Minted NFTs</p>
                <p className="text-sm text-muted-foreground">2 collections</p>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                View
              </button>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Performance Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Stream Views</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chat Messages</span>
              <span className="font-medium">456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">NFT Sales</span>
              <span className="font-medium">23</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors text-center">
            <div className="text-2xl mb-2">🎵</div>
            <p className="font-medium">Upload Music</p>
          </button>
          
          <button className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors text-center">
            <div className="text-2xl mb-2">📺</div>
            <p className="font-medium">Start Stream</p>
          </button>
          
          <button className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors text-center">
            <div className="text-2xl mb-2">🎨</div>
            <p className="font-medium">Mint NFT</p>
          </button>
          
          <button className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="font-medium">Chat</p>
          </button>
        </div>
      </div>

      {/* Withdrawal */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Withdraw Earnings</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Available Balance</p>
            <p className="text-2xl font-bold text-green-600">
              {earnings?.totalEarnings.toFixed(2)} MON
            </p>
            <p className="text-sm text-muted-foreground">
              Ready to withdraw to your wallet
            </p>
          </div>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Withdraw All
          </button>
        </div>
      </div>
    </div>
  );
}
