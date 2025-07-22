'use client';

import React, { useState, useEffect } from 'react';
import type { TipTransaction } from '@/lib/web3';

interface RealTimeTipsProps {
  artistAddress: string;
  artistName: string;
}

export default function RealTimeTips({ artistAddress, artistName }: RealTimeTipsProps) {
  const [tips, setTips] = useState<TipTransaction[]>([]);
  const [totalTips, setTotalTips] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time tips for demo purposes
    const tipInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newTip: TipTransaction = {
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          amount: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
          recipient: artistAddress,
          timestamp: Date.now(),
          status: 'confirmed'
        };
        
        setTips(prev => [newTip, ...prev.slice(0, 4)]);
        setTotalTips(prev => prev + newTip.amount);
      }
    }, 5000);

    return () => clearInterval(tipInterval);
  }, [artistAddress]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Real-time Tips</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {tips.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No tips received yet. Start playing music to receive tips!
          </p>
        ) : (
          <>
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-green-600">{totalTips.toFixed(2)} MON</p>
              <p className="text-sm text-muted-foreground">Total tips received</p>
            </div>
            
            <div className="space-y-2">
              {tips.map((tip) => (
                <div
                  key={tip.hash}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 text-xl">💰</span>
                    <div>
                      <p className="font-medium text-green-800">{tip.amount} MON</p>
                      <p className="text-sm text-green-600">
                        {formatTime(tip.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-green-600">
                    {tip.hash.substring(0, 6)}...{tip.hash.slice(-4)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 Tips are sent directly to your wallet in real-time while your music is playing!
        </p>
      </div>
    </div>
  );
}
