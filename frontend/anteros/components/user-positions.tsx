"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Bet {
  prediction: string
  amount: number
  duration: string
  timestamp: number
  status: "active" | "won" | "lost"
  reward?: number
}

export default function UserPositions() {
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

  if (!currentBet) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Active Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Prediction</p>
              <p className="font-medium">{currentBet.prediction} will grow fastest</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{currentBet.amount} RLUSD</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Settlement Period</p>
              <p className="font-medium">{currentBet.duration === "1d" ? "24 Hours" : "Perpetual"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{currentBet.status}</p>
            </div>
          </div>

          {currentBet.status === "won" && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Available to Claim</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-green-600">{currentBet.reward} RLUSD</p>
                <Button onClick={handleClaim}>Claim Rewards</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

