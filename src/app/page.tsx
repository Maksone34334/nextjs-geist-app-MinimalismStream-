import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-tight">
          Minimalist Streaming
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A clean, black-and-white streaming platform with Web3 integration. 
          Stream live, share music, chat with fans, and earn through crypto tips.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        <FeatureCard
          title="Live Streaming"
          description="Start broadcasting live to your audience with high-quality video streaming"
          href="/live"
        />
        <FeatureCard
          title="Music Broadcast"
          description="Upload and share your music with fans around the world"
          href="/music"
        />
        <FeatureCard
          title="Real-time Chat"
          description="Connect with your audience through public and private messaging"
          href="/chat"
        />
        <FeatureCard
          title="Web3 Tipping"
          description="Receive crypto tips from fans using MONAD testnet integration"
          href="/tip"
        />
        <FeatureCard
          title="NFT Minting"
          description="Convert your playlists into unique ERC-1155 NFT collections"
          href="/nft"
        />
        <FeatureCard
          title="Artist Dashboard"
          description="Track your earnings and manage your content in one place"
          href="/dashboard"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ title, description, href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <div className="p-6 border border-border rounded-lg hover:border-primary transition-all duration-200 hover:shadow-lg bg-card">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
