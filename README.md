# Minimalist Streaming Platform

A sleek, black-and-white streaming platform with Web3 integration, built with Next.js, TypeScript, and Tailwind CSS. Features live streaming, music broadcasting, real-time chat, Web3 tipping via Blink-Starter on MONAD testnet, and ERC-1155 NFT minting.

## 🎵 Features

### Core Functionality
- **Live Streaming**: Start live broadcasts with camera/microphone support
- **Music Broadcasting**: Upload and share music with real-time playback
- **Real-time Chat**: Public and private messaging with Web3 integration
- **Web3 Tipping**: Send crypto tips directly to artists using MONAD testnet
- **NFT Minting**: Convert playlists into ERC-1155 NFT collections
- **Artist Dashboard**: Track earnings and manage content

### Web3 Integration
- **Blink-Starter Integration**: Seamless Web3 wallet connections
- **MONAD Testnet**: Fast, low-cost transactions on the correct chain (10143/0x279f)
- **Real-time Tips**: Live tip notifications during music playback
- **ERC-1155 NFTs**: Create collectible music experiences

### Design
- **Minimalist Aesthetic**: Clean black-and-white design with eye-friendly colors
- **Responsive Layout**: Works on all device sizes
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Web3 wallet (MetaMask recommended)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd minimalist-streaming-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8000](http://localhost:8000) in your browser

## 🔧 Configuration

### Environment Variables
```bash
# Web3 Configuration
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-testnet.drpc.org
NEXT_PUBLIC_MONAD_CHAIN_ID=10143
NEXT_PUBLIC_MONAD_EXPLORER_URL=https://testnet-explorer.monad.xyz

# Application Settings
NEXT_PUBLIC_APP_NAME=Minimalist Streaming Platform
NEXT_PUBLIC_APP_URL=http://localhost:8000
```

### MONAD Testnet Setup
1. Add MONAD testnet to your wallet:
   - Network Name: MONAD Testnet
   - RPC URL: https://monad-testnet.drpc.org
   - Chain ID: 10143
   - Currency Symbol: MON
   - Explorer: https://testnet-explorer.monad.xyz

2. Get test MON tokens from the MONAD testnet faucet

## 🎯 Usage Guide

### For Artists
1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet
2. **Upload Music**: Use the Music Studio to upload tracks
3. **Start Broadcasting**: Begin live streams or play uploaded music
4. **Receive Tips**: Fans can tip you in real-time during playback
5. **Mint NFTs**: Convert playlists into collectible NFTs
6. **Track Earnings**: View your dashboard for earnings and analytics

### For Fans
1. **Browse Content**: Explore live streams and uploaded music
2. **Send Tips**: Support your favorite artists with crypto tips
3. **Chat**: Join public discussions or private conversations
4. **Collect NFTs**: Purchase unique music NFTs from artists

## 🎼 Audio Features

### Supported Formats
- **Upload**: MP3, WAV, OGG, M4A, AAC (max 50MB)
- **Playback**: WAV files for testing, MP3 for production
- **Quality**: High-quality audio with volume controls

### Real-time Integration
- **Live Tips**: Tips appear instantly during playback
- **Progress Tracking**: Real-time playback position
- **Volume Control**: Individual track volume adjustment

## 💰 Web3 Features

### Tipping System
- **Direct Payments**: Tips go directly to artist wallets
- **Real-time Notifications**: Instant tip alerts
- **Transaction History**: Complete tip tracking
- **Multiple Amounts**: Preset and custom tip amounts

### NFT Minting
- **ERC-1155 Standard**: Multi-edition NFTs
- **Custom Metadata**: Track information and artwork
- **Royalty Settings**: Configurable royalty percentages
- **Low Gas Fees**: Optimized for MONAD testnet

## 🛠️ Technical Stack

- **Frontend**: Next.js 15.3.2, React 19, TypeScript
- **Styling**: Tailwind CSS with custom color scheme
- **Web3**: Blink-Starter integration, ethers.js
- **Audio**: HTML5 Audio API with custom controls
- **Build**: Turbopack for fast development

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── live/               # Live streaming page
│   ├── music/              # Music studio page
│   ├── chat/               # Chat interface
│   ├── tip/                # Tipping interface
│   ├── nft/                # NFT minting page
│   └── dashboard/          # Artist dashboard
├── components/
│   ├── MusicPlayer.tsx     # Audio player with controls
│   ├── LiveStream.tsx      # Live streaming interface
│   ├── TipForm.tsx         # Web3 tipping form
│   ├── NFTMintForm.tsx     # NFT minting interface
│   ├── RealTimeTips.tsx    # Live tip notifications
│   └── ChatBox.tsx         # Chat interface
├── lib/
│   └── web3.ts            # Web3 integration utilities
└── public/
    └── demo-audio/        # Test audio files
```

## 🎨 Color Scheme

The platform uses a refined black-and-white color scheme that's easy on the eyes:

- **Light Mode**: Soft whites and light grays with dark text
- **Dark Mode**: Deep blacks and dark grays with light text
- **Accent Colors**: Subtle primary colors for interactive elements
- **High Contrast**: Ensures readability in all lighting conditions

## 🔗 Quick Links

- **Home**: http://localhost:8000
- **Live Streaming**: http://localhost:8000/live
- **Music Studio**: http://localhost:8000/music
- **Chat**: http://localhost:8000/chat
- **Tip Artists**: http://localhost:8000/tip
- **NFT Minting**: http://localhost:8000/nft
- **Dashboard**: http://localhost:8000/dashboard

## 🐛 Troubleshooting

### Music Not Playing
1. Ensure audio files exist in `/public/demo-audio/`
2. Check browser console for 404 errors
3. Verify audio format compatibility (WAV files provided)
4. Check browser audio permissions

### Web3 Connection Issues
1. Ensure MetaMask is installed
2. Switch to MONAD testnet (Chain ID: 10143)
3. Check network connectivity
4. Verify RPC endpoint: https://monad-testnet.drpc.org

### Development Issues
1. Clear browser cache
2. Restart development server
3. Check for port conflicts (default: 8000)
4. Verify all dependencies are installed

## 📊 Performance

- **Fast Loading**: Optimized with Turbopack
- **Smooth Animations**: 60fps transitions
- **Responsive Design**: Mobile-first approach
- **Web3 Optimized**: Minimal gas usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own streaming platform!

---

Built with ❤️ for the Web3 music community
