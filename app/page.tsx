import Navigation from "@/components/Navigation"
import MusicPlayer from "@/components/MusicPlayer"
import MusicUploader from "@/components/MusicUploader"
import TipForm from "@/components/TipForm"
import NFTMintForm from "@/components/NFTMintForm"
import LiveStream from "@/components/LiveStream"
import ChatBox from "@/components/ChatBox"

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="border-b border-white py-12">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Minimalism<span className="text-gray-400">Stream</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">Decentralized music streaming platform on MONAD testnet</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 border border-white rounded">
              <span className="text-sm">🎵 Stream Music</span>
            </div>
            <div className="px-4 py-2 border border-white rounded">
              <span className="text-sm">💰 Tip Artists</span>
            </div>
            <div className="px-4 py-2 border border-white rounded">
              <span className="text-sm">🖼️ Mint NFTs</span>
            </div>
            <div className="px-4 py-2 border border-white rounded">
              <span className="text-sm">📡 Live Stream</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl p-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Music Player - Takes full width on mobile, 2 cols on larger screens */}
          <div className="md:col-span-2">
            <MusicPlayer />
          </div>

          {/* Chat Box */}
          <div>
            <ChatBox />
          </div>

          {/* Live Stream - Takes full width */}
          <div className="md:col-span-2 lg:col-span-3">
            <LiveStream />
          </div>

          {/* Music Uploader */}
          <div className="md:col-span-2">
            <MusicUploader onFiles={(files) => console.log("Files uploaded:", files)} />
          </div>

          {/* Tip Form */}
          <div>
            <TipForm />
          </div>

          {/* NFT Mint Form - Takes remaining space */}
          <div className="md:col-span-1 lg:col-span-2">
            <NFTMintForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white mt-12 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-gray-400">Built on MONAD Testnet • Decentralized Music Platform</p>
          <p className="text-sm text-gray-500 mt-2">Connect your wallet to start streaming and tipping artists</p>
        </div>
      </footer>
    </main>
  )
}
