export interface PredictionMarketState {
  currentTime: string;
  endTime: string;
  poolSize: number;
  participants: number;
  options: {
    musk: {
      odds: number;
      totalBets: number;
      supporters: number;
    };
    zuck: {
      odds: number;
      totalBets: number;
      supporters: number;
    };
  };
  potentialReturns: {
    musk: number;
    zuck: number;
  };
  userBet?: {
    amount: number;
    choice: "musk" | "zuck";
    timestamp: string;
  };
  outcome?: {
    winner: "musk" | "zuck";
    canClaim: boolean;
    reward?: number;
  };
}

export const aiSummaries = {
  musk: [
    "Based on recent social media activity analysis",
    "Musk's engagement metrics show strong momentum",
    "Historical pattern suggests higher probability of success",
    "Market sentiment analysis indicates positive trajectory",
    "Technical indicators align with bullish prediction",
  ],
  zuck: [
    "Meta's recent performance metrics indicate",
    "Platform growth statistics show promising trends",
    "User engagement data suggests potential advantage",
    "Market positioning appears favorable",
    "Competitive analysis reveals strategic edge",
  ],
};

export const initialMarketState: PredictionMarketState = {
  currentTime: new Date().toISOString(),
  endTime: new Date(
    Date.now() + 23 * 60 * 60 * 1000 + 50 * 60 * 1000
  ).toISOString(),
  poolSize: 50000,
  participants: 234,
  options: {
    musk: {
      odds: 1.85,
      totalBets: 28000,
      supporters: 145,
    },
    zuck: {
      odds: 2.15,
      totalBets: 22000,
      supporters: 89,
    },
  },
  potentialReturns: {
    musk: 203.5, // Return for 110 bet
    zuck: 236.5,
  },
};

export const afterBetState: PredictionMarketState = {
  ...initialMarketState,
  userBet: {
    amount: 110,
    choice: "musk",
    timestamp: new Date().toISOString(),
  },
  options: {
    ...initialMarketState.options,
    musk: {
      ...initialMarketState.options.musk,
      totalBets: initialMarketState.options.musk.totalBets + 110,
      supporters: initialMarketState.options.musk.supporters + 1,
    },
  },
};

export const finalState: PredictionMarketState = {
  ...afterBetState,
  currentTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  outcome: {
    winner: "musk",
    canClaim: true,
    reward: 203.5,
  },
};

export const mockTimeProgression = [
  {
    timestamp: new Date().toISOString(),
    event: "BETTING_STARTED",
    message: "Placed 110 on Musk",
  },
  {
    timestamp: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    event: "TIME_UPDATE",
    message: "Market closing soon",
  },
  {
    timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    event: "MARKET_CLOSED",
    message: "Market closed - Musk wins!",
  },
];

export const streamingAISummary = {
  chunks: [
    "Analyzing recent market data and social indicators...",
    "Musk's recent product launches have shown strong market reception...",
    "Social sentiment analysis indicates positive momentum...",
    "Technical indicators suggest favorable conditions...",
    "Historical pattern analysis supports a bullish outlook...",
    "Prediction: 68% probability of positive outcome for Musk position",
  ],
  delay: 100, // ms between chunks
};

export interface ChartDataPoint {
  timestamp: string;
  musk: number;
  zuck: number;
}

export const mockChartData: ChartDataPoint[] = [
  { timestamp: "00:00", musk: 4.2, zuck: 4.0 },
  { timestamp: "02:00", musk: 4.3, zuck: 4.1 },
  { timestamp: "04:00", musk: 4.5, zuck: 4.0 },
  { timestamp: "06:00", musk: 4.8, zuck: 4.2 },
  { timestamp: "08:00", musk: 5.0, zuck: 4.3 },
  { timestamp: "10:00", musk: 5.2, zuck: 4.4 },
  { timestamp: "12:00", musk: 5.5, zuck: 4.5 },
  { timestamp: "14:00", musk: 5.8, zuck: 4.6 },
  { timestamp: "16:00", musk: 6.0, zuck: 4.7 },
  { timestamp: "18:00", musk: 6.2, zuck: 4.8 },
  { timestamp: "20:00", musk: 6.5, zuck: 4.9 },
  { timestamp: "22:00", musk: 6.8, zuck: 5.0 },
  { timestamp: "24:00", musk: 7.0, zuck: 5.1 },
];

// Function to get data points between start and end time
export const getChartDataForTimeRange = (
  startTime: string,
  endTime: string
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const totalHours = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  );

  // If we're at the end (showing final results)
  if (totalHours >= 24) {
    return mockChartData;
  }

  // Otherwise, only show data up to the current hour
  const currentHourIndex = Math.floor(totalHours / 2); // Every 2 hours we show a data point
  return mockChartData.slice(0, currentHourIndex + 1);
};
