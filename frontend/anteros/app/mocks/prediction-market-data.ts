export interface PredictionMarketState {
  currentTime: string;
  endTime: string;
  poolSize: number;
  participants: number;
  options: {
    altman: {
      odds: number;
      totalBets: number;
      supporters: number;
    };
    musk: {
      odds: number;
      totalBets: number;
      supporters: number;
    };
    trump: {
      odds: number;
      totalBets: number;
      supporters: number;
    };
  };
  potentialReturns: {
    altman: number;
    musk: number;
    trump: number;
  };
  userBet?: {
    amount: number;
    choice: "altman" | "musk" | "trump";
    timestamp: string;
  };
  outcome?: {
    winner: "altman" | "musk" | "trump";
    canClaim: boolean;
    reward?: number;
  };
}

export const aiSummaries = {
  altman: [
    "OpenAI's strategic positioning shows promise",
    "Recent AI developments indicate strong momentum",
    "Market leadership in AI sector suggests advantage",
    "Technical innovations align with positive trajectory",
    "Industry partnerships reveal strategic strength",
  ],
  musk: [
    "Tesla and X platform performance metrics",
    "Multi-company synergy shows potential",
    "Market influence remains strong",
    "Technical innovations across ventures",
    "Strategic positioning in AI and automotive",
  ],
  trump: [
    "Political momentum analysis indicates",
    "Social media engagement metrics show trends",
    "Historical pattern analysis suggests",
    "Public sentiment data reveals",
    "Campaign performance metrics indicate",
  ],
};

export const initialMarketState: PredictionMarketState = {
  currentTime: new Date().toISOString(),
  endTime: new Date(
    Date.now() + 23 * 60 * 60 * 1000 + 50 * 60 * 1000
  ).toISOString(),
  poolSize: 75000,
  participants: 345,
  options: {
    altman: {
      odds: 2.15,
      totalBets: 25000,
      supporters: 115,
    },
    musk: {
      odds: 1.95,
      totalBets: 28000,
      supporters: 145,
    },
    trump: {
      odds: 2.35,
      totalBets: 22000,
      supporters: 85,
    },
  },
  potentialReturns: {
    altman: 236.5,
    musk: 214.5,
    trump: 258.5,
  },
};

export const afterBetState: PredictionMarketState = {
  ...initialMarketState,
  userBet: {
    amount: 110,
    choice: "altman",
    timestamp: new Date().toISOString(),
  },
  options: {
    ...initialMarketState.options,
    altman: {
      ...initialMarketState.options.altman,
      totalBets: initialMarketState.options.altman.totalBets + 110,
      supporters: initialMarketState.options.altman.supporters + 1,
    },
  },
};

export const finalState: PredictionMarketState = {
  ...afterBetState,
  currentTime: initialMarketState.currentTime,
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  outcome: {
    winner: "altman",
    canClaim: true,
    reward: 236.5,
  },
};

export const mockTimeProgression = [
  {
    timestamp: new Date().toISOString(),
    event: "BETTING_STARTED",
    message: "Placed 110 on Altman",
  },
  {
    timestamp: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    event: "TIME_UPDATE",
    message: "Market closing soon",
  },
  {
    timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    event: "MARKET_CLOSED",
    message: "Market closed - Altman wins!",
  },
];

export const streamingAISummary = {
  chunks: [
    "Analyzing recent market data and social indicators...",
    "Altman's recent product launches have shown strong market reception...",
    "Social sentiment analysis indicates positive momentum...",
    "Technical indicators suggest favorable conditions...",
    "Historical pattern analysis supports a bullish outlook...",
    "Prediction: 68% probability of positive outcome for Altman position",
  ],
  delay: 100, // ms between chunks
};

export interface ChartDataPoint {
  timestamp: string;
  altman: number;
  musk: number;
  trump: number;
}

export const mockChartData: ChartDataPoint[] = [
  { timestamp: "00:00", altman: 4.0, musk: 4.2, trump: 3.8 },
  { timestamp: "02:00", altman: 4.1, musk: 4.0, trump: 3.7 },
  { timestamp: "04:00", altman: 4.4, musk: 4.3, trump: 3.9 },
  { timestamp: "06:00", altman: 4.3, musk: 4.5, trump: 3.8 },
  { timestamp: "08:00", altman: 4.7, musk: 4.4, trump: 4.0 },
  { timestamp: "10:00", altman: 5.1, musk: 4.8, trump: 4.1 },
  { timestamp: "12:00", altman: 4.9, musk: 5.2, trump: 4.0 },
  { timestamp: "14:00", altman: 5.4, musk: 5.0, trump: 4.2 },
  { timestamp: "16:00", altman: 5.8, musk: 5.3, trump: 4.3 },
  { timestamp: "18:00", altman: 5.6, musk: 5.7, trump: 4.5 },
  { timestamp: "20:00", altman: 6.2, musk: 5.9, trump: 4.4 },
  { timestamp: "22:00", altman: 6.8, musk: 6.2, trump: 4.7 },
  { timestamp: "24:00", altman: 7.2, musk: 6.5, trump: 4.8 },
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

  // Calculate how many data points to show based on elapsed time
  // We show a data point every 2 hours, so divide by 2
  const dataPointsToShow = Math.max(
    1,
    Math.min(Math.ceil(totalHours / 2), mockChartData.length)
  );
  return mockChartData.slice(0, dataPointsToShow);
};
