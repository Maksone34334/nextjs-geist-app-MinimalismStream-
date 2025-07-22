import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex justify-center space-x-8 p-6 border-b border-border bg-background">
      <Link 
        href="/" 
        className="text-lg font-medium hover:text-primary transition-colors duration-200"
      >
        Home
      </Link>
      <Link 
        href="/live" 
        className="text-lg font-medium hover:text-primary transition-colors duration-200"
      >
        Live
      </Link>
      <Link 
        href="/music" 
        className="text-lg font-medium hover:text-primary transition-colors duration-200"
      >
        Music
      </Link>
      <Link 
        href="/chat" 
        className="text-lg font-medium hover:text-primary transition-colors duration-200"
      >
        Chat
      </Link>
      <Link 
        href="/tip" 
        className="text-lg font-medium hover:text-primary transition-colors duration-200"
      >
        Tip Artists
      </Link>
      <Link 
        href="/nft" 
        className="text-lg font-medium hover:text-primary transition-colors duration-200"
      >
        NFT Mint
      </Link>
    </nav>
  );
}
