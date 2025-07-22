import NFTMintForm from '@/components/NFTMintForm';

export default function NFTPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Mint Playlist NFTs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your music playlists into unique ERC-1155 NFT collections. 
          Create collectible music experiences for your fans on MONAD testnet.
        </p>
      </div>
      
      <NFTMintForm />
    </div>
  );
}
