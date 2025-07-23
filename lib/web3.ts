// Web3 utility functions for MONAD testnet integration

declare global {
  interface Window {
    ethereum?: any
  }
}

const MONAD_TESTNET = {
  chainId: "0x279f", // 10143 in hex
  chainName: "MONAD Testnet",
  nativeCurrency: {
    name: "MONAD",
    symbol: "MONAD",
    decimals: 18,
  },
  rpcUrls: ["https://monad-testnet.drpc.org"],
  blockExplorerUrls: ["https://testnet-explorer.monad.xyz"],
}

export const isWalletConnected = async (): Promise<boolean> => {
  if (!window.ethereum) return false

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    return accounts.length > 0
  } catch (error) {
    console.error("Error checking wallet connection:", error)
    return false
  }
}

export const connectWallet = async (): Promise<string | null> => {
  if (!window.ethereum) {
    alert("Please install MetaMask!")
    return null
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    if (accounts.length === 0) {
      throw new Error("No accounts found")
    }

    // Add MONAD testnet to MetaMask
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [MONAD_TESTNET],
      })
    } catch (addError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (addError.code === 4902) {
        console.log("MONAD testnet added to MetaMask")
      } else {
        throw addError
      }
    }

    // Switch to MONAD testnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MONAD_TESTNET.chainId }],
    })

    return accounts[0]
  } catch (error) {
    console.error("Error connecting wallet:", error)
    throw error
  }
}

export const disconnectWallet = async (): Promise<void> => {
  // MetaMask doesn't have a disconnect method, but we can clear local state
  console.log("Wallet disconnected (local state cleared)")
}

export const getConnectedWallet = async (): Promise<string | null> => {
  if (!window.ethereum) return null

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    return accounts.length > 0 ? accounts[0] : null
  } catch (error) {
    console.error("Error getting connected wallet:", error)
    return null
  }
}

export const sendTipTransaction = async (amount: number): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  const accounts = await window.ethereum.request({ method: "eth_accounts" })
  if (accounts.length === 0) {
    throw new Error("No wallet connected")
  }

  try {
    // Convert amount to wei (18 decimals for MONAD)
    const amountInWei = (amount * Math.pow(10, 18)).toString(16)

    const transactionParameters = {
      to: "0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9", // Test recipient
      from: accounts[0],
      value: "0x" + amountInWei,
      gas: "0x5208", // 21000 in hex
    }

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    })

    console.log("Transaction sent:", txHash)
    return txHash
  } catch (error) {
    console.error("Error sending tip:", error)
    throw error
  }
}

export const mintPlaylistNFT = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  const accounts = await window.ethereum.request({ method: "eth_accounts" })
  if (accounts.length === 0) {
    throw new Error("No wallet connected")
  }

  try {
    // This is a placeholder for NFT minting
    // In a real implementation, you would:
    // 1. Deploy an ERC-1155 contract
    // 2. Call the mint function with playlist metadata
    // 3. Upload metadata to IPFS

    console.log("Minting NFT for playlist...")

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return mock transaction hash
    return "0x" + Math.random().toString(16).substr(2, 64)
  } catch (error) {
    console.error("Error minting NFT:", error)
    throw error
  }
}

export const getArtistEarnings = async (): Promise<number> => {
  // This would typically fetch from a smart contract or backend
  // For now, return a mock value
  return Math.random() * 100
}

// Event listeners for wallet changes
if (typeof window !== "undefined" && window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts: string[]) => {
    console.log("Accounts changed:", accounts)
    // Handle account change
  })

  window.ethereum.on("chainChanged", (chainId: string) => {
    console.log("Chain changed:", chainId)
    // Handle chain change
  })
}
