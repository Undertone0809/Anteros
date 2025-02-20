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

// Fixed timestamp for consistent rendering
const FIXED_START_TIME = "2025-02-21T09:44:38.000Z";
const FIXED_END_TIME = "2025-02-22T09:44:38.000Z";

export const initialMarketState: PredictionMarketState = {
  currentTime: FIXED_START_TIME,
  endTime: FIXED_END_TIME,
  poolSize: 124876.52,
  participants: 892,
  options: {
    altman: {
      odds: 1.85,
      totalBets: 47892.31,
      supporters: 312,
    },
    musk: {
      odds: 2.45,
      totalBets: 41765.84,
      supporters: 285,
    },
    trump: {
      odds: 3.15,
      totalBets: 35218.37,
      supporters: 295,
    },
  },
  potentialReturns: {
    altman: 185.0,
    musk: 245.0,
    trump: 315.0,
  },
};

export const afterBetState: PredictionMarketState = {
  ...initialMarketState,
  userBet: {
    amount: 110.5,
    choice: "altman",
    timestamp: FIXED_START_TIME,
  },
  options: {
    ...initialMarketState.options,
    altman: {
      ...initialMarketState.options.altman,
      totalBets: initialMarketState.options.altman.totalBets + 110.5,
      supporters: initialMarketState.options.altman.supporters + 1,
    },
  },
};

export const finalState: PredictionMarketState = {
  ...afterBetState,
  currentTime: FIXED_START_TIME,
  endTime: FIXED_END_TIME,
  outcome: {
    winner: "altman",
    canClaim: true,
    reward: 185.0,
  },
};

export const mockTimeProgression = [
  {
    timestamp: FIXED_START_TIME,
    event: "BETTING_STARTED",
    message: "Placed 110.50 on Altman",
  },
  {
    timestamp: "2025-02-21T09:54:38.000Z", // FIXED_START_TIME + 10 minutes
    event: "TIME_UPDATE",
    message: "Market closing soon",
  },
  {
    timestamp: FIXED_END_TIME,
    event: "MARKET_CLOSED",
    message: "Market closed - Altman wins!",
  },
];
export const streamingAISummary = {
  chunks: [
    "Analyzing market data and social indicators...",
    "Clear competitive dynamics between Altman and Musk, market divergence increasing...",
    "Social media sentiment analysis shows escalating tensions between supporter groups...",
    "Technical indicators show increasing market volatility...",
    "Historical pattern analysis shows win probability distribution: Altman 40%, Musk 35%, Trump 25%",
    "Prediction: Market will maintain highly competitive dynamics, recommend monitoring real-time data changes",
  ],
  delay: 100,
};

export interface ChartDataPoint {
  timestamp: string;
  altman: number;
  musk: number;
  trump: number;
}

export const mockChartData: ChartDataPoint[] = [
  { timestamp: "00:00", altman: 5.2, musk: 4.8, trump: 4.1 },
  { timestamp: "02:00", altman: 5.0, musk: 5.1, trump: 4.0 },
  { timestamp: "04:00", altman: 4.7, musk: 5.4, trump: 4.2 },
  { timestamp: "06:00", altman: 4.5, musk: 5.6, trump: 4.5 },
  { timestamp: "08:00", altman: 4.8, musk: 5.3, trump: 4.8 },
  { timestamp: "10:00", altman: 5.2, musk: 5.0, trump: 4.6 },
  { timestamp: "12:00", altman: 5.5, musk: 4.7, trump: 4.3 },
  { timestamp: "14:00", altman: 5.3, musk: 4.9, trump: 4.5 },
  { timestamp: "16:00", altman: 5.0, musk: 5.2, trump: 4.8 },
  { timestamp: "18:00", altman: 4.8, musk: 5.5, trump: 4.6 },
  { timestamp: "20:00", altman: 5.1, musk: 5.3, trump: 4.4 },
  { timestamp: "22:00", altman: 5.4, musk: 5.0, trump: 4.7 },
  { timestamp: "24:00", altman: 5.2, musk: 5.2, trump: 4.5 },
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
