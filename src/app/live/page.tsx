import LiveStream from '@/components/LiveStream';

export default function LivePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Live Streaming</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start broadcasting live to your audience. Share your music, interact with fans, 
          and receive real-time tips through Web3 integration.
        </p>
      </div>
      
      <LiveStream />
    </div>
  );
}
