"use client";

import { useState, useEffect } from "react";
import GrowthRateChart from "@/components/growth-rate-chart";
import BettingInterface from "@/components/betting-interface";
import UserPositions from "@/components/user-positions";
import SiteHeader from "@/components/site-header";
import {
  initialMarketState,
  PredictionMarketState,
  afterBetState,
  finalState,
  streamingAISummary,
} from "@/app/mocks/prediction-market-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  BarChart2,
  Activity,
  Lock,
  Percent,
  LineChart,
  AlertTriangle,
} from "lucide-react";

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export default function SocialPreMarket() {
  const [marketState, setMarketState] =
    useState<PredictionMarketState>(initialMarketState);
  const [aiSummaryVisible, setAiSummaryVisible] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");

  // Format date on client side only
  useEffect(() => {
    setFormattedEndTime(formatDate(marketState.endTime));
  }, [marketState.endTime]);

  // Simulate time progression and state changes
  useEffect(() => {
    if (marketState.userBet) {
      const timer = setTimeout(() => {
        setMarketState(finalState);
      }, 5000); // 5 seconds in real time to simulate 10 minutes
      return () => clearTimeout(timer);
    }
  }, [marketState.userBet]);

  // Simulate AI summary streaming
  const streamAISummary = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAiSummaryVisible(true);
    setAiSummaryText("");

    for (const chunk of streamingAISummary.chunks) {
      await new Promise((resolve) =>
        setTimeout(resolve, streamingAISummary.delay)
      );
      setAiSummaryText((prev) => prev + chunk + " ");
    }
  };

  const handleBet = (amount: number, choice: "altman" | "musk" | "trump") => {
    setMarketState({
      ...afterBetState,
      userBet: {
        amount,
        choice,
        timestamp: new Date().toISOString(),
        position: "long",
      },
    });
  };

  const handleClaim = () => {
    if (marketState.outcome?.canClaim) {
      // Handle claiming logic
      setMarketState((prev) => ({
        ...prev,
        outcome: {
          ...prev.outcome!,
          canClaim: false,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-[1800px] mx-auto px-4 py-6 md:py-8">
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Social Prediction Market</h1>
              <p className="text-muted-foreground">Predict the social influence trajectory of tech leaders</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={marketState.marketStatus === "open" ? "default" : "secondary"} className="px-4 py-1.5">
                <Clock className="w-4 h-4 mr-2" />
                {marketState.marketStatus.toUpperCase()} • {formattedEndTime}
              </Badge>
              <Badge className="px-4 py-1.5">
                <Users className="w-4 h-4 mr-2" />
                {marketState.participants} Participants
              </Badge>
              <Badge className="px-4 py-1.5">
                <DollarSign className="w-4 h-4 mr-2" />
                ${marketState.poolSize.toLocaleString()} Pool
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-12">
            {/* Market Overview - 12 columns */}
            <div className="col-span-12 grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="text-2xl font-bold">${marketState.marketMetrics.totalVolume24h.toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Value Locked</p>
                      <p className="text-2xl font-bold">${marketState.marketMetrics.totalValueLocked.toLocaleString()}</p>
                    </div>
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">24h Volatility</p>
                      <p className="text-2xl font-bold">{(marketState.marketMetrics.volatility24h * 100).toFixed(2)}%</p>
                    </div>
                    <Percent className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Market Efficiency</p>
                      <p className="text-2xl font-bold">{(marketState.marketMetrics.marketEfficiency * 100).toFixed(2)}%</p>
                    </div>
                    <LineChart className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Chart Section - 8 columns */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <GrowthRateChart marketState={marketState} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(marketState.options).map(([name, data]) => (
                  <Card key={name}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="capitalize">{name}</span>
                        <Badge>
                          {data.odds.toFixed(2)}x
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Bets</span>
                          <span className="font-medium">${data.totalBets.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">24h Volume</span>
                          <span className="font-medium">${data.volume24h.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">24h Change</span>
                          <span className={`font-medium ${data.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {(data.priceChange24h * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Liquidity Depth</span>
                          <span className="font-medium">${data.liquidityDepth.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Implied Prob.</span>
                          <span className="font-medium">
                            {(marketState.marketMetrics.impliedProbabilities[name as keyof typeof marketState.marketMetrics.impliedProbabilities] * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar - 4 columns */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <Tabs defaultValue="betting" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="betting">Trading</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="betting">
                  <BettingInterface marketState={marketState} onBet={handleBet} />
                  <UserPositions
                    userBet={marketState.userBet}
                    outcome={marketState.outcome}
                    onClaim={handleClaim}
                  />
                </TabsContent>
                <TabsContent value="analysis">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <button
                        onClick={streamAISummary}
                        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 w-full"
                      >
                        Generate AI Prediction
                      </button>
                      {aiSummaryVisible && (
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                          <div className="prose dark:prose-invert">
                            <p className="text-sm leading-relaxed">
                              {aiSummaryText || "Generating..."}
                            </p>
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Market Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">24h Volume</span>
                          </div>
                          <span className="font-medium">${marketState.marketMetrics.totalVolume24h.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BarChart2 className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Market Depth</span>
                          </div>
                          <span className="font-medium">${marketState.marketMetrics.totalValueLocked.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm text-muted-foreground">Highest Odds</span>
                          </div>
                          <span className="font-medium text-green-500">3.15x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                            <span className="text-sm text-muted-foreground">Lowest Odds</span>
                          </div>
                          <span className="font-medium text-red-500">1.85x</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {marketState.marketStatus === "closing" && (
                    <Card className="mt-4 border-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="font-medium text-yellow-500">Market Closing Soon</p>
                            <p className="text-sm text-muted-foreground">
                              This market will close in {formatDate(marketState.endTime)}. Make sure to place your final trades before the deadline.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
