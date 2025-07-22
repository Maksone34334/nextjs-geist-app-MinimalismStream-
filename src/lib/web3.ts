// Web3 integration with Blink-Starter for MONAD testnet
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface TipTransaction {
  hash: string;
  amount: number;
  recipient: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WalletConnection {
  address: string;
  balance: number;
  network: string;
}

// MONAD testnet configuration
const MONAD_TESTNET_CONFIG = {
  chainId: '0x279f', // MONAD testnet chain ID (10143 in hex)
  chainName: 'MONAD Testnet',
  nativeCurrency: {
    name: 'MONAD',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://monad-testnet.drpc.org'],
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
};

// Blink-Starter integration for seamless transactions
class BlinkStarterIntegration {
  private static instance: BlinkStarterIntegration;
  private walletAddress: string | null = null;
  private isConnected: boolean = false;

  static getInstance(): BlinkStarterIntegration {
    if (!BlinkStarterIntegration.instance) {
      BlinkStarterIntegration.instance = new BlinkStarterIntegration();
    }
    return BlinkStarterIntegration.instance;
  }

  async connectWallet(): Promise<WalletConnection> {
    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet found. Please install MetaMask or another Web3 wallet.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      // Switch to MONAD testnet
      await this.switchToMonadTestnet();

      // Get balance
      const balance = await this.getBalance(accounts[0]);

      this.walletAddress = accounts[0];
      this.isConnected = true;

      return {
        address: accounts[0],
        balance,
        network: 'MONAD Testnet',
      };
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  private async switchToMonadTestnet(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // Chain not added to wallet, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MONAD_TESTNET_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  private async getBalance(address: string): Promise<number> {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      // Convert from wei to MON
      return parseInt(balance, 16) / Math.pow(10, 18);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async sendTip(recipientAddress: string, amount: number): Promise<TipTransaction> {
    if (!this.isConnected || !this.walletAddress) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    if (amount <= 0) {
      throw new Error('Tip amount must be greater than 0.');
    }

    try {
      // Check balance
      const balance = await this.getBalance(this.walletAddress);
      if (balance < amount) {
        throw new Error(`Insufficient funds. Balance: ${balance.toFixed(4)} MON, Required: ${amount} MON`);
      }

      // Convert amount to wei
      const amountInWei = '0x' + (amount * Math.pow(10, 18)).toString(16);

      // Send transaction using Blink-Starter optimized parameters
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: this.walletAddress,
          to: recipientAddress,
          value: amountInWei,
          gas: '0x5208', // 21000 gas for simple transfer
          gasPrice: '0x9184e72a000', // 10 gwei
        }],
      });

      const transaction: TipTransaction = {
        hash: transactionHash,
        amount,
        recipient: recipientAddress,
        timestamp: Date.now(),
        status: 'pending',
      };

      // Monitor transaction status
      this.monitorTransaction(transaction);

      return transaction;
    } catch (error: any) {
      console.error('Tip transaction failed:', error);
      
      // Handle specific error cases
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user.');
      } else if (error.code === -32603) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds for transaction and gas fees.');
      } else {
        throw new Error(`Transaction failed: ${error.message}`);
      }
    }
  }

  private async monitorTransaction(transaction: TipTransaction): Promise<void> {
    const checkStatus = async () => {
      try {
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [transaction.hash],
        });

        if (receipt) {
          transaction.status = receipt.status === '0x1' ? 'confirmed' : 'failed';
          // Emit event or update UI
          this.notifyTransactionUpdate(transaction);
        } else {
          // Transaction still pending, check again in 5 seconds
          setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        transaction.status = 'failed';
        this.notifyTransactionUpdate(transaction);
      }
    };

    checkStatus();
  }

  private notifyTransactionUpdate(transaction: TipTransaction): void {
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('transactionUpdate', {
      detail: transaction,
    }));
  }

  async disconnectWallet(): Promise<void> {
    this.walletAddress = null;
    this.isConnected = false;
  }

  getConnectedAddress(): string | null {
    return this.walletAddress;
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const blinkStarter = BlinkStarterIntegration.getInstance();

// Convenience functions
export async function connectWallet(): Promise<WalletConnection> {
  return blinkStarter.connectWallet();
}

export async function sendTipTransaction(recipientAddress: string, amount: number): Promise<TipTransaction> {
  return blinkStarter.sendTip(recipientAddress, amount);
}

export async function disconnectWallet(): Promise<void> {
  return blinkStarter.disconnectWallet();
}

export function getConnectedWallet(): string | null {
  return blinkStarter.getConnectedAddress();
}

export function isWalletConnected(): boolean {
  return blinkStarter.isWalletConnected();
}

// NFT minting functionality for ERC-1155 playlists
export async function mintPlaylistNFT(playlistData: {
  name: string;
  description: string;
  tracks: string[];
  metadata: any;
}): Promise<{ transactionHash: string; tokenId: string }> {
  if (!blinkStarter.isWalletConnected()) {
    throw new Error('Wallet not connected. Please connect your wallet first.');
  }

  try {
    // This would integrate with your ERC-1155 smart contract
    // For now, we'll simulate the minting process
    const mockTransactionHash = '0x' + Math.random().toString(16).substr(2, 64);
    const mockTokenId = Math.floor(Math.random() * 10000).toString();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      transactionHash: mockTransactionHash,
      tokenId: mockTokenId,
    };
  } catch (error: any) {
    console.error('NFT minting failed:', error);
    throw new Error(`Failed to mint NFT: ${error.message}`);
  }
}

// Artist earnings tracking
export interface EarningsData {
  totalEarnings: number;
  tipCount: number;
  averageTip: number;
  recentTips: TipTransaction[];
}

export async function getArtistEarnings(artistAddress: string): Promise<EarningsData> {
  // In a real implementation, this would query your backend or blockchain
  // For now, we'll return mock data
  const mockEarnings: EarningsData = {
    totalEarnings: 45.67,
    tipCount: 23,
    averageTip: 1.99,
    recentTips: [
      {
        hash: '0xabc123...',
        amount: 2.5,
        recipient: artistAddress,
        timestamp: Date.now() - 3600000,
        status: 'confirmed',
      },
      {
        hash: '0xdef456...',
        amount: 1.0,
        recipient: artistAddress,
        timestamp: Date.now() - 7200000,
        status: 'confirmed',
      },
    ],
  };

  return mockEarnings;
}
