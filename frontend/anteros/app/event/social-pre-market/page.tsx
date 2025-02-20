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
        <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">
            Social Prediction Market
          </h1>
          <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4 md:space-y-6">
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <GrowthRateChart marketState={marketState} />
              </div>
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <button
                  onClick={streamAISummary}
                  className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Generate AI Prediction
                </button>
                {aiSummaryVisible && (
                  <div className="prose dark:prose-invert">
                    <p className="text-sm leading-relaxed">
                      {aiSummaryText || "Generating..."}
                    </p>
                  </div>
                )}
              </div>
              <UserPositions
                userBet={marketState.userBet}
                outcome={marketState.outcome}
                onClaim={handleClaim}
              />
            </div>
            <div className="lg:sticky lg:top-6 h-fit">
              <BettingInterface marketState={marketState} onBet={handleBet} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
