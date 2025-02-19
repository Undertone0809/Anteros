"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TradingInterface() {
  const [selectedPerson, setSelectedPerson] = useState("Altman")
  const [position, setPosition] = useState("long")
  const [amount, setAmount] = useState("")

  const handleTrade = () => {
    console.log(`Trading ${position} on ${selectedPerson} for ${amount}`)
    // Here you would integrate with your RLUSD settlement layer
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Take a Position</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="person">Select Person</Label>
          <Select onValueChange={setSelectedPerson} defaultValue={selectedPerson}>
            <SelectTrigger id="person">
              <SelectValue placeholder="Select person" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Altman">Altman</SelectItem>
              <SelectItem value="Musk">Musk</SelectItem>
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
        <Button onClick={handleTrade} className="w-full">
          Place Trade
        </Button>
      </div>
    </div>
  )
}

