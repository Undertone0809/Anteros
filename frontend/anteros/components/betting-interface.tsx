"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { PredictionMarketState } from "@/app/mocks/prediction-market-data"
import { TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react"

interface BettingInterfaceProps {
  marketState: PredictionMarketState
  onBet: (amount: number, choice: "altman" | "musk" | "trump") => void
}

export default function BettingInterface({ marketState, onBet }: BettingInterfaceProps) {
  const [amount, setAmount] = useState(110)
  const [selectedChoice, setSelectedChoice] = useState<"altman" | "musk" | "trump" | null>(null)
  const [position, setPosition] = useState<"long" | "short">("long")
  const [leverage, setLeverage] = useState(1)
  const [useAdvancedFeatures, setUseAdvancedFeatures] = useState(false)
  const [stopLoss, setStopLoss] = useState<number | null>(null)
  const [takeProfit, setTakeProfit] = useState<number | null>(null)

  const calculatePotentialReturn = () => {
    if (!selectedChoice || amount <= 0) return 0;
    const odds = marketState.options[selectedChoice].odds;
    const multiplier = position === "long" ? odds : 2 - odds;
    return amount * multiplier * leverage;
  }

  const calculateMaxLoss = () => {
    if (!selectedChoice || amount <= 0) return 0;
    return position === "long" ? amount * leverage : amount * leverage * (marketState.options[selectedChoice].odds - 1);
  }

  const handleBet = () => {
    if (selectedChoice && amount > 0) {
      // Validate advanced features
      if (useAdvancedFeatures) {
        if (leverage > 3) {
          toast.error("Maximum leverage is 3x");
          return;
        }
        if (stopLoss && stopLoss >= marketState.options[selectedChoice].odds) {
          toast.error("Stop loss must be below current odds");
          return;
        }
        if (takeProfit && takeProfit <= marketState.options[selectedChoice].odds) {
          toast.error("Take profit must be above current odds");
          return;
        }
      }

      onBet(amount, selectedChoice);
      toast.success("Position opened successfully!");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Place Your Prediction</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={useAdvancedFeatures}
              onCheckedChange={setUseAdvancedFeatures}
            />
            <span className="text-sm">Advanced Trading</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Position Type</Label>
            <RadioGroup
              defaultValue="long"
              onValueChange={(value) => setPosition(value as "long" | "short")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long" className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  Long
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short" className="flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                  Short
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Label>Select Prediction Target</Label>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(marketState.options).map(([name, data]) => (
              <button
                key={name}
                onClick={() => setSelectedChoice(name as "altman" | "musk" | "trump")}
                className={`p-4 rounded-lg border ${selectedChoice === name ? "border-primary bg-primary/10" : "border-border"
                  }`}
              >
                <p className="font-medium capitalize">{name}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground flex justify-between">
                    <span>Odds</span>
                    <span className="font-medium">{data.odds}x</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex justify-between">
                    <span>24h Change</span>
                    <span className={data.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                      {(data.priceChange24h * 100).toFixed(2)}%
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground flex justify-between">
                    <span>Volume</span>
                    <span>${data.volume24h.toLocaleString()}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Bet Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
            <p className="text-sm text-muted-foreground">
              Minimum bet: 0.1 RLUSD
            </p>
          </div>

          {useAdvancedFeatures && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Leverage (1-3x)</Label>
                  <span className="text-sm font-medium">{leverage}x</span>
                </div>
                <Slider
                  value={[leverage]}
                  onValueChange={([value]) => setLeverage(value)}
                  min={1}
                  max={3}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>Stop Loss (Optional)</Label>
                <Input
                  type="number"
                  value={stopLoss || ""}
                  onChange={(e) => setStopLoss(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Enter stop loss price"
                />
              </div>

              <div className="space-y-2">
                <Label>Take Profit (Optional)</Label>
                <Input
                  type="number"
                  value={takeProfit || ""}
                  onChange={(e) => setTakeProfit(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Enter take profit price"
                />
              </div>
            </>
          )}

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Potential Return</span>
              <span className="font-medium">${calculatePotentialReturn().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Max Loss</span>
              <span className="font-medium text-red-500">${calculateMaxLoss().toFixed(2)}</span>
            </div>
            {useAdvancedFeatures && leverage > 1 && (
              <div className="flex items-start gap-2 mt-2 text-xs text-yellow-500">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Trading with leverage increases both potential profits and losses. Please ensure you understand the risks.
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleBet}
          className="w-full"
          disabled={!selectedChoice || amount <= 0}
        >
          Place Bet
        </Button>
      </CardContent>
    </Card>
  )
}

