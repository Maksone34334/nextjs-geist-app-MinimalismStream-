"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { mintPlaylistNFT } from "@/lib/web3"
import { Palette, Upload, Coins } from "lucide-react"

export default function NFTMintForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    supply: "100",
    price: "0.1",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsLoading(true)
    try {
      await mintPlaylistNFT()
      alert("NFT Minted Successfully! (This is a demo)")
      setFormData({ name: "", description: "", supply: "100", price: "0.1" })
      setCoverImage(null)
    } catch (error) {
      console.error("Minting error:", error)
      alert("Minting failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={20} />
          Mint Playlist NFT
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              {coverImage ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(coverImage) || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-20 h-20 object-cover rounded mx-auto"
                  />
                  <p className="text-xs text-gray-400">{coverImage.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={32} className="mx-auto text-gray-400" />
                  <p className="text-sm text-gray-400">Upload cover image</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cover-upload" />
              <label htmlFor="cover-upload">
                <Button variant="outline" size="sm" className="mt-2 cursor-pointer bg-transparent">
                  Choose Image
                </Button>
              </label>
            </div>
          </div>

          {/* NFT Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">NFT Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded border border-white bg-black px-3 py-2 text-white placeholder-gray-400"
              placeholder="My Awesome Playlist"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded border border-white bg-black px-3 py-2 text-white placeholder-gray-400 h-20 resize-none"
              placeholder="Describe your playlist..."
            />
          </div>

          {/* Supply */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Supply (ERC-1155)</label>
            <input
              type="number"
              value={formData.supply}
              onChange={(e) => setFormData((prev) => ({ ...prev, supply: e.target.value }))}
              className="w-full rounded border border-white bg-black px-3 py-2 text-white"
              min="1"
              max="10000"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Price (MONAD)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded border border-white bg-black px-3 py-2 pr-16 text-white"
                min="0"
              />
              <div className="absolute right-3 top-2 flex items-center gap-1 text-gray-400">
                <Coins size={16} />
                <span className="text-sm">MONAD</span>
              </div>
            </div>
          </div>

          {/* Mint Button */}
          <Button type="submit" disabled={isLoading || !formData.name.trim()} className="w-full">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Minting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Palette size={16} />
                Mint NFT
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">This will create an ERC-1155 NFT on MONAD testnet</p>
        </form>
      </CardContent>
    </Card>
  )
}
