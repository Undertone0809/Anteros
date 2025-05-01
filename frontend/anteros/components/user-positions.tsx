"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { PredictionMarketState } from "@/app/mocks/prediction-market-data"
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, AlertCircle } from "lucide-react"
import { getUserPositions, closePosition } from "@/app/services/contractService"

interface UserPosition {
  id: string
  keyword: string
  size: number
  isLong: boolean
  entryPrice: number
  currentPrice: number
  pnl: number
  timestamp: string
  leverage?: number
  stopLoss?: number
  takeProfit?: number
}

interface UserPositionsProps {
  userBet?: PredictionMarketState['userBet']
  outcome?: PredictionMarketState['outcome']
  onClaim: () => void
}

export default function UserPositions({ userBet, outcome, onClaim }: UserPositionsProps) {
  const [pnl, setPnl] = useState<number>(0)
  const [pnlPercentage, setPnlPercentage] = useState<number>(0)
  const [userPositions, setUserPositions] = useState<UserPosition[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load user positions from contract service
  useEffect(() => {
    const loadUserPositions = async () => {
      try {
        const positions = await getUserPositions()
        setUserPositions(positions)
      } catch (error) {
        console.error("Error loading user positions:", error)
        toast.error("Failed to load your positions")
      }
    }

    loadUserPositions()

    // Refresh positions every 15 seconds
    const interval = setInterval(loadUserPositions, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (userBet && outcome) {
      const initialValue = userBet.amount
      const finalValue = outcome.reward || 0
      const pnlValue = finalValue - initialValue
      setPnl(pnlValue)
      setPnlPercentage((pnlValue / initialValue) * 100)
    }
  }, [userBet, outcome])

  const handleClosePosition = async (positionId: string, keyword: string) => {
    try {
      setIsLoading(true)
      const txHash = await closePosition(keyword, positionId)
      console.log("Close position transaction hash:", txHash)

      // Remove position from list
      setUserPositions(positions => positions.filter(p => p.id !== positionId))

      toast.success("Position closed successfully")
    } catch (error) {
      console.error("Error closing position:", error)
      toast.error("Failed to close position")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    try {
      setIsLoading(true)
      // Use the original onClaim function
      onClaim()
      toast.success("Rewards claimed successfully")
    } catch (error) {
      console.error("Error claiming rewards:", error)
      toast.error("Failed to claim rewards")
    } finally {
      setIsLoading(false)
    }
  }

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

  // If no user positions or bets, show a message
  if (userPositions.length === 0 && !userBet) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            You don't have any open positions yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Your Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Show positions from contract service */}
          {userPositions.map(position => (
            <div key={position.id} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant={position.isLong ? "default" : "destructive"}>
                    {position.isLong ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {position.isLong ? "LONG" : "SHORT"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {position.keyword}
                  </Badge>
                  {position.leverage && position.leverage > 1 && (
                    <Badge variant="secondary">{position.leverage}x</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(position.timestamp)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position Size</p>
                  <p className="font-medium">
                    <DollarSign className="w-4 h-4 inline-block" />
                    {position.size.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entry Price</p>
                  <p className="font-medium">
                    {position.entryPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="font-medium">
                    {position.currentPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <p className={`font-medium ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {position.pnl >= 0 ? "+" : ""}{position.pnl.toFixed(2)}
                    ({((position.pnl / position.size) * 100).toFixed(2)}%)
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleClosePosition(position.id, position.keyword)}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Close Position"}
              </Button>
            </div>
          ))}

          {/* Show user bet from prediction market if exists */}
          {userBet && (
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
                    <Button
                      onClick={handleClaim}
                      className="w-full mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : `Claim $${outcome.reward?.toFixed(2)}`}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Warning for leveraged positions */}
          {(userBet?.leverage && userBet.leverage > 1) ||
            userPositions.some(p => p.leverage && p.leverage > 1) ? (
            <div className="flex items-start gap-2 p-4 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
              <div className="text-sm text-yellow-500">
                <p className="font-medium">Leveraged Position</p>
                <p>Your position is leveraged. This increases both potential profits and losses.</p>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

