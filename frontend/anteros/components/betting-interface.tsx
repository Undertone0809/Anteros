"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { PredictionMarketState } from "@/app/mocks/prediction-market-data"

interface BettingInterfaceProps {
  marketState: PredictionMarketState
  onBet: (amount: number, choice: "musk" | "zuck") => void
}

export default function BettingInterface({ marketState, onBet }: BettingInterfaceProps) {
  const [amount, setAmount] = useState(110)
  const [selectedChoice, setSelectedChoice] = useState<"musk" | "zuck" | null>(null)

  const handleBet = () => {
    if (selectedChoice && amount > 0) {
      onBet(amount, selectedChoice)
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
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedChoice("altman")}
              className={`p-4 rounded-lg border ${selectedChoice === "altman" ? "border-primary bg-primary/10" : "border-border"
                }`}
            >
              <p className="font-medium">Altman</p>
              <p className="text-sm text-muted-foreground">Odds: {marketState.options.altman.odds}x</p>
            </button>
            <button
              onClick={() => setSelectedChoice("musk")}
              className={`p-4 rounded-lg border ${selectedChoice === "musk" ? "border-primary bg-primary/10" : "border-border"
                }`}
            >
              <p className="font-medium">Musk</p>
              <p className="text-sm text-muted-foreground">Odds: {marketState.options.musk.odds}x</p>
            </button>
            <button
              onClick={() => setSelectedChoice("trump")}
              className={`p-4 rounded-lg border ${selectedChoice === "trump" ? "border-primary bg-primary/10" : "border-border"
                }`}
            >
              <p className="font-medium">Trump</p>
              <p className="text-sm text-muted-foreground">Odds: {marketState.options.trump.odds}x</p>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Bet Amount (RLUSD)</Label>
          <Input
            id="amount"
            type="number"
            min="0.1"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">Minimum bet: 0.1 RLUSD</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Potential Return</p>
          <p className="font-medium">
            {selectedChoice ? marketState.potentialReturns[selectedChoice] : "-"}
          </p>
        </div>

        <Button onClick={handleBet} className="w-full" disabled={!selectedChoice || amount <= 0}>
          Place Bet
        </Button>
      </CardContent>
    </Card>
  )
}

