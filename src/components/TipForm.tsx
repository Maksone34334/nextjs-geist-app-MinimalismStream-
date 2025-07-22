'use client';

import React, { useState, useEffect } from 'react';
import { connectWallet, sendTipTransaction, disconnectWallet, getConnectedWallet, isWalletConnected } from '@/lib/web3';
import type { WalletConnection, TipTransaction } from '@/lib/web3';

interface Artist {
  id: string;
  name: string;
  address: string;
  avatar?: string;
}

// Mock artist data - in production, this would come from your backend
const MOCK_ARTISTS: Artist[] = [
  { id: '1', name: 'Luna Beats', address: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4' },
  { id: '2', name: 'Echo Chamber', address: '0x853e46Dd7745D5643936a4c5D5D5D5D5D5D5D5D5' },
  { id: '3', name: 'Neon Pulse', address: '0x964f57Ee8856E6754047b6D6E6E6E6E6E6E6E6E6' },
  { id: '4', name: 'Digital Dreams', address: '0xa75068Ff9967F7865158c7C7C7C7C7C7C7C7C7C7' },
];

const PRESET_AMOUNTS = [0.5, 1.0, 2.5, 5.0, 10.0];

export default function TipForm() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [recentTransactions, setRecentTransactions] = useState<TipTransaction[]>([]);

  useEffect(() => {
    // Check if wallet is already connected
    if (isWalletConnected()) {
      const address = getConnectedWallet();
      if (address) {
        // Simulate getting wallet info for already connected wallet
        setWallet({
          address,
          balance: 0, // Would fetch real balance
          network: 'MONAD Testnet'
        });
      }
    }

    // Listen for transaction updates
    const handleTransactionUpdate = (event: CustomEvent) => {
      const transaction = event.detail as TipTransaction;
      setRecentTransactions(prev => {
        const updated = prev.map(tx => 
          tx.hash === transaction.hash ? transaction : tx
        );
        if (!updated.find(tx => tx.hash === transaction.hash)) {
          updated.unshift(transaction);
        }
        return updated.slice(0, 5); // Keep only last 5 transactions
      });

      if (transaction.status === 'confirmed') {
        setStatus(`✅ Tip of ${transaction.amount} MON sent successfully!`);
        setError('');
      } else if (transaction.status === 'failed') {
        setError('❌ Transaction failed. Please try again.');
        setStatus('');
      }
    };

    window.addEventListener('transactionUpdate', handleTransactionUpdate as EventListener);
    return () => {
      window.removeEventListener('transactionUpdate', handleTransactionUpdate as EventListener);
    };
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError('');
    setStatus('');

    try {
      const walletConnection = await connectWallet();
      setWallet(walletConnection);
      setStatus(`✅ Connected to ${walletConnection.address.substring(0, 6)}...${walletConnection.address.slice(-4)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWallet(null);
      setStatus('');
      setError('');
      setRecentTransactions([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSendTip = async () => {
    if (!wallet || !selectedArtist) {
      setError('Please connect wallet and select an artist.');
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid tip amount.');
      return;
    }

    setIsSending(true);
    setError('');
    setStatus('🔄 Processing tip transaction...');

    try {
      const transaction = await sendTipTransaction(selectedArtist.address, amount);
      
      // Add to recent transactions immediately with pending status
      setRecentTransactions(prev => [transaction, ...prev.slice(0, 4)]);
      
      setStatus(`🔄 Tip sent! Transaction hash: ${transaction.hash.substring(0, 10)}...`);
      
      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      
    } catch (err: any) {
      setError(err.message);
      setStatus('');
    } finally {
      setIsSending(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusIcon = (status: TipTransaction['status']) => {
    switch (status) {
      case 'pending': return '🔄';
      case 'confirmed': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Wallet Connection Section */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Web3 Wallet Connection</h3>
        
        {!wallet ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Connect your Web3 wallet to send tips on MONAD testnet
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connected: {formatAddress(wallet.address)}</p>
                <p className="text-sm text-muted-foreground">
                  Balance: {wallet.balance.toFixed(4)} MON
                </p>
                <p className="text-sm text-muted-foreground">Network: {wallet.network}</p>
              </div>
              <button
                onClick={handleDisconnectWallet}
                className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Artist Selection */}
      {wallet && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Select Artist to Tip</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_ARTISTS.map((artist) => (
              <button
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedArtist?.id === artist.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{artist.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatAddress(artist.address)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tip Amount Selection */}
      {wallet && selectedArtist && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">
            Tip Amount for {selectedArtist.name}
          </h3>
          
          {/* Preset Amounts */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Quick Select (MON)</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      selectedAmount === amount
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {amount} MON
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <p className="text-sm font-medium mb-2">Custom Amount</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="px-3 py-2 text-muted-foreground">MON</span>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendTip}
              disabled={isSending || (!selectedAmount && !customAmount)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? 'Sending Tip...' : `Send Tip ${selectedAmount || customAmount || ''} MON`}
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {(status || error) && (
        <div className="border border-border rounded-lg p-4 bg-card">
          {status && (
            <p className="text-sm text-foreground mb-2">{status}</p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-xl font-semibold mb-4">Recent Tips</h3>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-background"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(tx.status)}</span>
                  <div>
                    <p className="font-medium">{tx.amount} MON</p>
                    <p className="text-sm text-muted-foreground">
                      To: {formatAddress(tx.recipient)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatAddress(tx.hash)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">How Tipping Works</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Connect your Web3 wallet (MetaMask recommended)</p>
          <p>• Ensure you're on MONAD testnet</p>
          <p>• Select an artist and tip amount</p>
          <p>• Confirm the transaction in your wallet</p>
          <p>• Tips are sent directly to the artist's wallet</p>
        </div>
      </div>
    </div>
  );
}
