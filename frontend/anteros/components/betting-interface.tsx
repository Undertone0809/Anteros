"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function BettingInterface() {
  const [prediction, setPrediction] = useState("")
  const [amount, setAmount] = useState("0.1")
  const [duration, setDuration] = useState("1d")

  const handleBet = () => {
    if (!prediction) {
      toast.error("Please select who you think will grow fastest")
      return
    }

    if (Number.parseFloat(amount) < 0.1) {
      toast.error("Minimum bet amount is 0.1 RLUSD")
      return
    }

    // Mock successful bet
    toast.success(`Bet placed successfully! You bet ${amount} RLUSD on ${prediction}`)

    // Store bet in localStorage for demo
    const bet = {
      prediction,
      amount: Number.parseFloat(amount),
      duration,
      timestamp: Date.now(),
      status: "active",
    }

    localStorage.setItem("currentBet", JSON.stringify(bet))

    // For demo purposes, if betting on Musk, simulate a win after 5 seconds
    if (prediction === "Musk") {
      setTimeout(() => {
        const bet = JSON.parse(localStorage.getItem("currentBet") || "{}")
        bet.status = "won"
        bet.reward = (Number.parseFloat(amount) * 2).toFixed(2)
        localStorage.setItem("currentBet", JSON.stringify(bet))
        toast.success("Congratulations! Your prediction was correct!")
      }, 5000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Your Prediction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Who will grow fastest?</Label>
          <RadioGroup onValueChange={setPrediction} className="grid grid-cols-3 gap-4">
            <Label
              htmlFor="musk"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
                prediction === "Musk" ? "border-primary" : ""
              }`}
            >
              <RadioGroupItem value="Musk" id="musk" className="sr-only" />
              Musk
            </Label>
            <Label
              htmlFor="altman"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
                prediction === "Altman" ? "border-primary" : ""
              }`}
            >
              <RadioGroupItem value="Altman" id="altman" className="sr-only" />
              Altman
            </Label>
            <Label
              htmlFor="trump"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
                prediction === "Trump" ? "border-primary" : ""
              }`}
            >
              <RadioGroupItem value="Trump" id="trump" className="sr-only" />
              Trump
            </Label>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Settlement Period</Label>
          <Select onValueChange={setDuration} defaultValue="1d">
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 Hours</SelectItem>
              <SelectItem value="perpetual">Perpetual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Bet Amount (RLUSD)</Label>
          <Input
            id="amount"
            type="number"
            min="0.1"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Minimum bet: 0.1 RLUSD</p>
        </div>

        <Button onClick={handleBet} className="w-full">
          Place Bet
        </Button>
      </CardContent>
    </Card>
  )
}

