"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { PredictionMarketState } from "@/app/mocks/prediction-market-data"
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, AlertCircle } from "lucide-react"

interface UserPositionsProps {
  userBet?: PredictionMarketState['userBet']
  outcome?: PredictionMarketState['outcome']
  onClaim: () => void
}

export default function UserPositions({ userBet, outcome, onClaim }: UserPositionsProps) {
  const [pnl, setPnl] = useState<number>(0)
  const [pnlPercentage, setPnlPercentage] = useState<number>(0)

  useEffect(() => {
    if (userBet && outcome) {
      const initialValue = userBet.amount
      const finalValue = outcome.reward || 0
      const pnlValue = finalValue - initialValue
      setPnl(pnlValue)
      setPnlPercentage((pnlValue / initialValue) * 100)
    }
  }, [userBet, outcome])

  if (!userBet) return null

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Your Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant={userBet.position === "long" ? "default" : "destructive"}>
                  {userBet.position === "long" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {userBet.position.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {userBet.choice}
                </Badge>
                {userBet.leverage && userBet.leverage > 1 && (
                  <Badge variant="secondary">{userBet.leverage}x</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatTimestamp(userBet.timestamp)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Position Size</p>
                <p className="font-medium">
                  <DollarSign className="w-4 h-4 inline-block" />
                  {userBet.amount.toLocaleString()}
                </p>
              </div>
              {userBet.stopLoss && (
                <div>
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="font-medium text-red-500">
                    <Target className="w-4 h-4 inline-block" />
                    {userBet.stopLoss}
                  </p>
                </div>
              )}
              {userBet.takeProfit && (
                <div>
                  <p className="text-sm text-muted-foreground">Take Profit</p>
                  <p className="font-medium text-green-500">
                    <Target className="w-4 h-4 inline-block" />
                    {userBet.takeProfit}
                  </p>
                </div>
              )}
              {userBet.fees && (
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="font-medium">
                    <DollarSign className="w-4 h-4 inline-block" />
                    {(userBet.fees.trading + userBet.fees.liquidity + userBet.fees.protocol).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {outcome && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">P&L</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                {outcome.canClaim && (
                  <Button onClick={onClaim} className="w-full mt-2">
                    Claim ${outcome.reward?.toFixed(2)}
                  </Button>
                )}
              </div>
            )}
          </div>

          {userBet.leverage && userBet.leverage > 1 && (
            <div className="flex items-start gap-2 p-4 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
              <div className="text-sm text-yellow-500">
                <p className="font-medium">Leveraged Position</p>
                <p>Your position is leveraged {userBet.leverage}x. This increases both potential profits and losses.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

