import TipForm from '@/components/TipForm';

export default function TipPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Tip Artists</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Support your favorite artists with crypto tips using Web3 wallets on MONAD testnet. 
          Fast, secure, and direct payments to creators.
        </p>
      </div>
      
      <TipForm />
    </div>
  );
}
