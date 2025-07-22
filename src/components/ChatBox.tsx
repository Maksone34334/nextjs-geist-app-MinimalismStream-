'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'tip' | 'system';
  amount?: number;
}

interface ChatBoxProps {
  mode: 'public' | 'private';
}

// Mock users for demonstration
const MOCK_USERS = [
  'MusicLover42', 'BeatDropper', 'SynthWave88', 'VibeChecker', 'RhythmSeeker',
  'MelodyMaster', 'BassHunter', 'TrebleClef', 'AudioPhile', 'SoundWave'
];

export default function ChatBox({ mode }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate connection and initial messages
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      setOnlineUsers(MOCK_USERS.slice(0, Math.floor(Math.random() * 5) + 3));
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        user: 'System',
        content: `Connected to ${mode} chat`,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages([welcomeMessage]);

      // Simulate some initial activity for public chat
      if (mode === 'public') {
        const initialMessages: Message[] = [
          {
            id: (Date.now() + 1).toString(),
            user: 'MusicLover42',
            content: 'Great stream! Love this track 🎵',
            timestamp: new Date(Date.now() - 120000),
            type: 'text'
          },
          {
            id: (Date.now() + 2).toString(),
            user: 'BeatDropper',
            content: 'Just sent a tip! Keep the music coming!',
            timestamp: new Date(Date.now() - 60000),
            type: 'tip',
            amount: 2.5
          }
        ];
        setMessages(prev => [...prev, ...initialMessages]);
      }
    }, 1000);

    return () => clearTimeout(connectTimeout);
  }, [mode]);

  // Simulate random messages for public chat
  useEffect(() => {
    if (!isConnected || mode !== 'public') return;

    const messageInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const randomMessages = [
          'This is amazing! 🔥',
          'Can you play that last track again?',
          'Love the vibe tonight',
          'Greetings from Tokyo! 🇯🇵',
          'This beat is incredible',
          'Just followed you!',
          'When is your next stream?',
          'Perfect music for coding',
          'This is my new favorite artist',
          'The sound quality is perfect'
        ];
        
        const newMessage: Message = {
          id: Date.now().toString(),
          user: randomUser,
          content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, newMessage]);
      }
    }, 10000);

    return () => clearInterval(messageInterval);
  }, [isConnected, mode]);

  const sendMessage = () => {
    if (!input.trim() || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'You',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate response in private chat
    if (mode === 'private' && selectedUser) {
      setTimeout(() => {
        const responses = [
          'Thanks for the message!',
          'Great to hear from you!',
          'I appreciate your support!',
          'Hope you\'re enjoying the music!',
          'Thanks for being part of the community!'
        ];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          user: selectedUser,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 2000 + Math.random() * 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'tip': return '💰';
      case 'system': return '🔔';
      default: return '💬';
    }
  };

  const getMessageStyle = (type: Message['type'], user: string) => {
    if (type === 'system') return 'bg-blue-50 border-blue-200 text-blue-800';
    if (type === 'tip') return 'bg-green-50 border-green-200 text-green-800';
    if (user === 'You') return 'bg-primary/10 border-primary/20';
    return 'bg-muted/50 border-border';
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h3 className="font-semibold capitalize">{mode} Chat</h3>
            {mode === 'public' && (
              <span className="text-sm text-muted-foreground">
                {onlineUsers.length} online
              </span>
            )}
          </div>
          
          {mode === 'private' && (
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-1 border border-border rounded bg-background text-sm"
            >
              <option value="">Select user to chat with</option>
              {onlineUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {!isConnected ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p>Connecting to chat...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg border ${getMessageStyle(message.type, message.user)}`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-sm">{getMessageIcon(message.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{message.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.amount && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        +{message.amount} MON
                      </span>
                    )}
                  </div>
                  <p className="text-sm break-words">{message.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-muted/30">
        {mode === 'private' && !selectedUser ? (
          <p className="text-sm text-muted-foreground text-center">
            Select a user to start a private conversation
          </p>
        ) : (
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type a ${mode} message...`}
              disabled={!isConnected}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              maxLength={500}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !isConnected}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        )}
        
        {input.length > 400 && (
          <p className="text-xs text-muted-foreground mt-1">
            {500 - input.length} characters remaining
          </p>
        )}
      </div>

      {/* Online Users (for public chat) */}
      {mode === 'public' && onlineUsers.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Online Users</h4>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.slice(0, 8).map(user => (
              <span
                key={user}
                className="px-2 py-1 bg-background border border-border rounded text-xs"
              >
                {user}
              </span>
            ))}
            {onlineUsers.length > 8 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{onlineUsers.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
