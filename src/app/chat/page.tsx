'use client';

import { useState } from 'react';
import ChatBox from '@/components/ChatBox';

export default function ChatPage() {
  const [mode, setMode] = useState<'public' | 'private'>('public');

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Community Chat</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with artists and fans in real-time. Join public discussions or have private conversations 
          with your favorite creators.
        </p>
      </div>

      {/* Chat Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setMode('public')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === 'public'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Public Chat
          </button>
          <button
            onClick={() => setMode('private')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === 'private'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Private Messages
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto">
        <ChatBox mode={mode} />
      </div>

      {/* Chat Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-3">Real-time Messaging</h3>
          <p className="text-muted-foreground text-sm">
            Instant messaging with live updates. Connect with the community 
            and share your thoughts about the music.
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-3">Private Conversations</h3>
          <p className="text-muted-foreground text-sm">
            Direct messaging with artists and other fans. Build meaningful 
            connections in a private setting.
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-3">Tip Integration</h3>
          <p className="text-muted-foreground text-sm">
            Send crypto tips directly through chat messages. Support your 
            favorite artists while chatting.
          </p>
        </div>
      </div>

      {/* Chat Guidelines */}
      <div className="max-w-4xl mx-auto border border-border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>• Be respectful to all community members</p>
            <p>• Keep conversations relevant to music and art</p>
            <p>• No spam or excessive self-promotion</p>
          </div>
          <div className="space-y-2">
            <p>• Support artists through tips and positive feedback</p>
            <p>• Report inappropriate behavior to moderators</p>
            <p>• Enjoy the music and make new connections!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
