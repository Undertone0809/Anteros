/**
 * Mock Contract Service
 *
 * This file provides mock implementations of blockchain contract functions.
 * These will be replaced with actual implementations using @aptos-labs/ts-sdk later.
 */

// Mock data for trending keywords
const KEYWORDS = ["altman", "musk", "trump"];

// Mock price data for each keyword
const PRICE_DATA = {
  altman: 2.45,
  musk: 3.15,
  trump: 1.85,
};

// Mock funding rate data (as percentage)
const FUNDING_RATE_DATA = {
  altman: 0.01, // 1%
  musk: 0.0125, // 1.25%
  trump: 0.015, // 1.5%
};

// Price volatility to simulate price changes
const PRICE_VOLATILITY = 0.02; // 2%

/**
 * Mock implementation of Aptos client initialization
 * This will be replaced with actual implementation later
 */
export const initializeClient = () => {
  console.log("Mock Aptos client initialized");
  return {
    isInitialized: true,
  };
};

/**
 * Get spot price for a given keyword
 * @param keyword The trending keyword to get price for
 * @returns A promise that resolves to the current spot price
 */
export const getSpotPrice = async (keyword: string): Promise<number> => {
  // Validate keyword
  if (!KEYWORDS.includes(keyword)) {
    throw new Error(`Invalid keyword: ${keyword}`);
  }

  // Add some randomness to simulate price movements
  const basePrice = PRICE_DATA[keyword as keyof typeof PRICE_DATA];
  const randomFactor = 1 + (Math.random() - 0.5) * PRICE_VOLATILITY;
  return parseFloat((basePrice * randomFactor).toFixed(2));
};

/**
 * Get funding rate for a given keyword
 * @param keyword The trending keyword to get funding rate for
 * @returns A promise that resolves to the current funding rate
 */
export const getFundingRate = async (keyword: string): Promise<number> => {
  // Validate keyword
  if (!KEYWORDS.includes(keyword)) {
    throw new Error(`Invalid keyword: ${keyword}`);
  }

  return FUNDING_RATE_DATA[keyword as keyof typeof FUNDING_RATE_DATA];
};

/**
 * Open a position (long or short) for a given keyword
 * @param keyword The trending keyword to trade
 * @param size The size of the position
 * @param isLong Whether this is a long (true) or short (false) position
 * @returns A promise that resolves to a transaction hash
 */
export const openPosition = async (
  keyword: string,
  size: number,
  isLong: boolean
): Promise<string> => {
  // Validate keyword
  if (!KEYWORDS.includes(keyword)) {
    throw new Error(`Invalid keyword: ${keyword}`);
  }

  // Validate size
  if (size <= 0) {
    throw new Error("Position size must be greater than 0");
  }

  // Mock transaction hash
  const txHash = `0x${Math.random().toString(16).substring(2, 42)}`;

  console.log(
    `Mock transaction: Opening ${
      isLong ? "LONG" : "SHORT"
    } position for ${keyword} with size ${size}`
  );

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return txHash;
};

/**
 * Close a position
 * @param keyword The trending keyword
 * @param positionId The ID of the position to close
 * @returns A promise that resolves to a transaction hash
 */
export const closePosition = async (
  keyword: string,
  positionId: string
): Promise<string> => {
  // Validate keyword
  if (!KEYWORDS.includes(keyword)) {
    throw new Error(`Invalid keyword: ${keyword}`);
  }

  // Mock transaction hash
  const txHash = `0x${Math.random().toString(16).substring(2, 42)}`;

  console.log(
    `Mock transaction: Closing position ${positionId} for ${keyword}`
  );

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return txHash;
};

/**
 * Get user positions
 * @returns A promise that resolves to an array of user positions
 */
export const getUserPositions = async (): Promise<any[]> => {
  // Mock user positions
  const positions = [
    {
      id: "0x123",
      keyword: "altman",
      size: 100,
      isLong: true,
      entryPrice: 2.35,
      currentPrice: 2.45,
      pnl: 4.25,
      timestamp: new Date().toISOString(),
    },
    {
      id: "0x456",
      keyword: "musk",
      size: 50,
      isLong: false,
      entryPrice: 3.25,
      currentPrice: 3.15,
      pnl: 1.54,
      timestamp: new Date().toISOString(),
    },
  ];

  return positions;
};
