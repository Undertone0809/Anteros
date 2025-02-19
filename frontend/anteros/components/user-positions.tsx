"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { PredictionMarketState } from "@/app/mocks/prediction-market-data"

interface Bet {
  prediction: string
  amount: number
  duration: string
  timestamp: number
  status: "active" | "won" | "lost"
  reward?: number
}

interface UserPositionsProps {
  userBet?: PredictionMarketState['userBet']
  outcome?: PredictionMarketState['outcome']
  onClaim: () => void
}

export default function UserPositions({ userBet, outcome, onClaim }: UserPositionsProps) {
  const [currentBet, setCurrentBet] = useState<Bet | null>(null)

  useEffect(() => {
    const storedBet = localStorage.getItem("currentBet")
    if (storedBet) {
      setCurrentBet(JSON.parse(storedBet))
    }

    // Poll for updates
    const interval = setInterval(() => {
      const latestBet = localStorage.getItem("currentBet")
      if (latestBet) {
        setCurrentBet(JSON.parse(latestBet))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleClaim = () => {
    if (currentBet?.status === "won") {
      toast.success(`Claimed ${currentBet.reward} RLUSD!`)
      localStorage.removeItem("currentBet")
      setCurrentBet(null)
    }
  }

  if (!userBet) {
    return (
      <div className="rounded-xl border bg-card p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
        <p className="text-muted-foreground">No active positions</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Bet on {userBet.choice}</p>
            <p className="text-sm text-muted-foreground">Amount: {userBet.amount}</p>
          </div>
          {outcome && outcome.canClaim && (
            <button
              onClick={onClaim}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Claim {outcome.reward}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

