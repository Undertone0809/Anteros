export interface PredictionMarketState {
  currentTime: string;
  endTime: string;
  poolSize: number;
  participants: number;
  timeframe: "24h" | "7d" | "30d" | "90d" | "1y";
  marketStatus: "open" | "closing" | "closed" | "settled";
  liquidityPool: {
    total: number;
    distribution: {
      altman: number;
      musk: number;
      trump: number;
    };
  };
  options: {
    altman: {
      odds: number;
      totalBets: number;
      supporters: number;
      volume24h: number;
      priceChange24h: number;
      liquidityDepth: number;
      historicalOdds?: {
        timestamp: string;
        odds: number;
        volume: number;
        liquidity: number;
      }[];
    };
    musk: {
      odds: number;
      totalBets: number;
      supporters: number;
      volume24h: number;
      priceChange24h: number;
      liquidityDepth: number;
      historicalOdds?: {
        timestamp: string;
        odds: number;
        volume: number;
        liquidity: number;
      }[];
    };
    trump: {
      odds: number;
      totalBets: number;
      supporters: number;
      volume24h: number;
      priceChange24h: number;
      liquidityDepth: number;
      historicalOdds?: {
        timestamp: string;
        odds: number;
        volume: number;
        liquidity: number;
      }[];
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
    position: "long" | "short";
    leverage?: number;
    stopLoss?: number;
    takeProfit?: number;
    fees?: {
      trading: number;
      liquidity: number;
      protocol: number;
    };
  };
  outcome?: {
    winner: "altman" | "musk" | "trump";
    canClaim: boolean;
    reward?: number;
    settlementPrice: number;
    settlementTime: string;
  };
  marketMetrics: {
    totalVolume24h: number;
    totalValueLocked: number;
    impliedProbabilities: {
      altman: number;
      musk: number;
      trump: number;
    };
    volatility24h: number;
    marketEfficiency: number;
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

// Market events that affect odds
const marketEvents = [
  {
    date: "2024-02-21",
    event: "OpenAI announces GPT-5",
    impact: { altman: 0.3, musk: -0.15, trump: -0.05 },
  },
  {
    date: "2024-03-15",
    event: "Tesla's AI Day",
    impact: { altman: -0.1, musk: 0.25, trump: 0 },
  },
  {
    date: "2024-04-01",
    event: "Major social media policy changes",
    impact: { altman: 0.05, musk: 0.2, trump: 0.15 },
  },
  {
    date: "2024-05-10",
    event: "AI regulation announcement",
    impact: { altman: -0.15, musk: -0.1, trump: 0.2 },
  },
];

// Utility function to add noise to the trend
const addNoise = (baseValue: number, volatility: number = 0.05) => {
  const noise = (Math.random() - 0.5) * volatility;
  return baseValue * (1 + noise);
};

// Generate realistic trend with momentum
const generateTrend = (
  days: number,
  initialValue: number,
  momentum: number = 0.7
) => {
  const trend: number[] = [];
  let currentValue = initialValue;
  let direction = Math.random() > 0.5 ? 1 : -1;
  let momentumCounter = Math.floor(Math.random() * 5) + 3; // 3-7 days momentum

  for (let i = 0; i < days; i++) {
    // Change direction with momentum
    if (momentumCounter <= 0) {
      direction = Math.random() > 0.5 ? 1 : -1;
      momentumCounter = Math.floor(Math.random() * 5) + 3;
    }

    // Add trend with momentum and noise
    currentValue = addNoise(currentValue * (1 + direction * 0.01 * momentum));

    // Ensure odds don't go below 1.1 or above 5.0
    currentValue = Math.max(1.1, Math.min(5.0, currentValue));

    trend.push(currentValue);
    momentumCounter--;
  }

  return trend;
};

// Generate historical data points with proper granularity
const generateHistoricalOdds = (
  baseOdds: number,
  personality: "altman" | "musk" | "trump"
) => {
  const points: {
    timestamp: string;
    odds: number;
    volume: number;
    liquidity: number;
  }[] = [];
  const now = new Date();
  const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Generate daily trend for a year
  const trend = generateTrend(
    365,
    baseOdds,
    personality === "trump" ? 0.9 : 0.7
  );

  // Apply market events impact
  const eventImpacts = new Map<string, number>();
  marketEvents.forEach((event) => {
    eventImpacts.set(event.date, event.impact[personality]);
  });

  // Generate data points with different granularity
  for (let i = 0; i < 365; i++) {
    const date = new Date(yearAgo);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Apply event impact if exists
    let odds = trend[i];
    if (eventImpacts.has(dateStr)) {
      odds *= 1 + eventImpacts.get(dateStr)!;
    }

    // Generate mock volume and liquidity data with more realistic base values
    const baseVolume =
      personality === "altman"
        ? 12437.89
        : personality === "musk"
        ? 9876.54
        : 7654.32;
    const baseLiquidity =
      personality === "altman"
        ? 28743.21
        : personality === "musk"
        ? 23156.78
        : 19876.43;

    // Add some natural variation to the numbers
    const volumeVariation = 0.15 + Math.random() * 0.1; // 15-25% variation
    const liquidityVariation = 0.08 + Math.random() * 0.07; // 8-15% variation

    const volume = baseVolume * (1 + (Math.random() - 0.5) * volumeVariation);
    const liquidity =
      baseLiquidity * (1 + (Math.random() - 0.5) * liquidityVariation);

    // For recent data (last 24h), generate hourly data points
    if (i === 364) {
      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(date);
        hourDate.setHours(hour);
        const hourlyVolume = (volume / 24) * (0.85 + Math.random() * 0.3); // 85-115% of average hourly volume
        const hourlyLiquidity = liquidity * (0.95 + Math.random() * 0.1); // 95-105% of daily liquidity

        points.push({
          timestamp: hourDate.toISOString(),
          odds: addNoise(odds, 0.02),
          volume: hourlyVolume,
          liquidity: hourlyLiquidity,
        });
      }
    } else {
      points.push({
        timestamp: date.toISOString(),
        odds: odds,
        volume: volume,
        liquidity: liquidity,
      });
    }
  }

  return points;
};

// Generate mock chart data with realistic patterns
const generateMockChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const baseValues = {
    altman: 5.2,
    musk: 4.8,
    trump: 4.1,
  };

  for (let hour = 0; hour < 25; hour++) {
    const timestamp = hour.toString().padStart(2, "0") + ":00";
    const volatility = 0.03; // 3% volatility

    data.push({
      timestamp,
      altman: addNoise(baseValues.altman, volatility),
      musk: addNoise(baseValues.musk, volatility),
      trump: addNoise(baseValues.trump, volatility),
    });
  }

  return data;
};

export const mockChartData = generateMockChartData();

export const initialMarketState: PredictionMarketState = {
  currentTime: FIXED_START_TIME,
  endTime: FIXED_END_TIME,
  poolSize: 124876.52,
  participants: 892,
  timeframe: "24h",
  marketStatus: "open",
  liquidityPool: {
    total: 287432.18,
    distribution: {
      altman: 143716.09,
      musk: 86229.65,
      trump: 57486.44,
    },
  },
  options: {
    altman: {
      odds: 1.85,
      totalBets: 47892.31,
      supporters: 312,
      volume24h: 12437.89,
      priceChange24h: 0.0234,
      liquidityDepth: 28743.21,
      historicalOdds: generateHistoricalOdds(1.85, "altman"),
    },
    musk: {
      odds: 2.45,
      totalBets: 41765.84,
      supporters: 285,
      volume24h: 9876.54,
      priceChange24h: 0.0312,
      liquidityDepth: 23156.78,
      historicalOdds: generateHistoricalOdds(2.45, "musk"),
    },
    trump: {
      odds: 3.15,
      totalBets: 35218.37,
      supporters: 295,
      volume24h: 7654.32,
      priceChange24h: 0.0423,
      liquidityDepth: 19876.43,
      historicalOdds: generateHistoricalOdds(3.15, "trump"),
    },
  },
  potentialReturns: {
    altman: 185.0,
    musk: 245.0,
    trump: 315.0,
  },
  marketMetrics: {
    totalVolume24h: 29968.75,
    totalValueLocked: 287432.18,
    impliedProbabilities: {
      altman: 0.4532,
      musk: 0.3487,
      trump: 0.1981,
    },
    volatility24h: 0.1423,
    marketEfficiency: 0.9187,
  },
};

export const afterBetState: PredictionMarketState = {
  ...initialMarketState,
  userBet: {
    amount: 110.5,
    choice: "altman",
    timestamp: FIXED_START_TIME,
    position: "long",
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
    settlementPrice: 1.85,
    settlementTime: FIXED_START_TIME,
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

// Function to get historical data points for a specific timeframe
export const getHistoricalDataForTimeframe = (
  timeframe: PredictionMarketState["timeframe"],
  historicalOdds: { timestamp: string; odds: number }[]
) => {
  const now = new Date();
  let startDate: Date;

  switch (timeframe) {
    case "24h":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  return historicalOdds.filter(
    (point) => new Date(point.timestamp) >= startDate
  );
};
