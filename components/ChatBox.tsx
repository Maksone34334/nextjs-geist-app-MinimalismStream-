"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Send } from "lucide-react"

export default function ChatBox() {
  const [messages, setMessages] = useState<Array<{ id: number; user: string; text: string }>>([
    { id: 1, user: "Artist", text: "Welcome to the stream!" },
    { id: 2, user: "Fan123", text: "Great music!" },
  ])
  const [text, setText] = useState("")

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        text: text.trim(),
      },
    ])
    setText("")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Live Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 overflow-y-auto space-y-2 border border-white rounded p-3">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-semibold text-white">{msg.user}:</span>
              <span className="ml-2 text-gray-300">{msg.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded border border-white bg-black px-3 py-2 text-sm text-white placeholder-gray-400"
            placeholder="Type a message..."
          />
          <Button size="sm" type="submit">
            <Send size={16} />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
