"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { sendTipTransaction } from "@/lib/web3"
import { Coins, Heart, Zap, Gift } from "lucide-react"

const QUICK_AMOUNTS = [0.1, 0.5, 1.0, 5.0]

export default function TipForm() {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recipient] = useState("0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsLoading(true)
    try {
      await sendTipTransaction(Number.parseFloat(amount))
      alert(`Tip of ${amount} MONAD sent successfully! (Demo)`)
      setAmount("")
      setMessage("")
    } catch (error) {
      console.error("Tip error:", error)
      alert("Failed to send tip. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart size={20} className="text-red-500" />
          Tip the Artist
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Recipient</label>
            <div className="p-2 bg-gray-800 rounded border text-xs text-gray-300 font-mono break-all">{recipient}</div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Quick Amounts</label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className={amount === quickAmount.toString() ? "bg-white text-black" : ""}
                >
                  {quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Custom Amount (MONAD)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded border border-white bg-black px-3 py-2 pr-16 text-white placeholder-gray-400"
                placeholder="0.00"
                min="0"
                required
              />
              <div className="absolute right-3 top-2 flex items-center gap-1 text-gray-400">
                <Coins size={16} />
                <span className="text-sm">MONAD</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded border border-white bg-black px-3 py-2 text-white placeholder-gray-400 h-20 resize-none"
              placeholder="Leave a message for the artist..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
          </div>

          {/* Send Button */}
          <Button type="submit" disabled={isLoading || !amount || Number.parseFloat(amount) <= 0} className="w-full">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap size={16} />
                Send Tip
              </div>
            )}
          </Button>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-gray-800 rounded text-xs">
            <Gift size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-gray-300">
              <p className="font-medium mb-1">Support your favorite artists!</p>
              <p>Tips are sent directly to the artist's wallet on MONAD testnet.</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
