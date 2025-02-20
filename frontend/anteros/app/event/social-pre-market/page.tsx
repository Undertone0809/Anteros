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
  Activity
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
              <Badge variant="outline" className="px-4 py-1.5">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(marketState.endTime)}
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5">
                <Users className="w-4 h-4 mr-2" />
                {marketState.participants} Participants
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5">
                <DollarSign className="w-4 h-4 mr-2" />
                ${marketState.poolSize.toLocaleString()} Pool
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-12">
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
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                        <Badge variant={data.odds > 2 ? "destructive" : "default"}>
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
                          <span className="text-muted-foreground">Supporters</span>
                          <span className="font-medium">{data.supporters}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Potential Return</span>
                          <span className="font-medium text-green-600">
                            {marketState.potentialReturns[name as keyof typeof marketState.potentialReturns]}%
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
                  <TabsTrigger value="betting">Betting</TabsTrigger>
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
                          <span className="font-medium">${(marketState.poolSize * 0.4).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BarChart2 className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Market Depth</span>
                          </div>
                          <span className="font-medium">${marketState.poolSize.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm text-muted-foreground">Highest Odds</span>
                          </div>
                          <span className="font-medium text-green-500">2.35x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                            <span className="text-sm text-muted-foreground">Lowest Odds</span>
                          </div>
                          <span className="font-medium text-red-500">1.95x</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
