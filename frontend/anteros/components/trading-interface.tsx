"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { openPosition } from "@/app/services/contractService"

export default function TradingInterface() {
  const [selectedKeyword, setSelectedKeyword] = useState("altman")
  const [position, setPosition] = useState("long")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    try {
      const txHash = await openPosition(
        selectedKeyword,
        parseFloat(amount),
        position === "long"
      )

      console.log(`Transaction hash: ${txHash}`)
      toast.success(`Position opened successfully!`)
    } catch (error) {
      console.error("Error opening position:", error)
      toast.error("Failed to open position")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Take a Position</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="keyword">Select Keyword</Label>
          <Select onValueChange={setSelectedKeyword} defaultValue={selectedKeyword}>
            <SelectTrigger id="keyword">
              <SelectValue placeholder="Select keyword" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="altman">Altman</SelectItem>
              <SelectItem value="musk">Musk</SelectItem>
              <SelectItem value="trump">Trump</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Select onValueChange={setPosition} defaultValue={position}>
            <SelectTrigger id="position">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button onClick={handleTrade} className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : "Place Trade"}
        </Button>
      </div>
    </div>
  )
}

