"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Music, Radio, Coins, Palette } from "lucide-react"

export default function Navigation() {
  return (
    <header className="border-b border-white bg-black px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Minimalism<span className="text-gray-400">Stream</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/music" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Music size={18} />
            Music
          </Link>
          <Link href="/live" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Radio size={18} />
            Live
          </Link>
          <Link href="/tip" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Coins size={18} />
            Tips
          </Link>
          <Link href="/nft" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Palette size={18} />
            NFT
          </Link>

          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </nav>
      </div>
    </header>
  )
}
