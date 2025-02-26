// Types for our analysis system

import { ProcessedCandle, ProcessedMarketData, RawCandle } from "../types.js";

function calculateVolatility(priceChanges: number[]): number {
  const mean =
    priceChanges.reduce((sum, val) => sum + val, 0) / priceChanges.length;
  const squaredDiffs = priceChanges.map((val) => Math.pow(val - mean, 2));
  return Math.sqrt(
    squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length
  );
}

function analyzeTrend(
  candles: ProcessedCandle[]
): ProcessedMarketData["trendMetrics"] {
  const prices = candles.map((c) => c.close);
  const priceChange = (prices[prices.length - 1] - prices[0]) / prices[0];

  // Simple trend direction determination
  const direction =
    priceChange > 0.02
      ? "bullish"
      : priceChange < -0.02
        ? "bearish"
        : "sideways";

  // Calculate trend strength using price consistency
  const strength = Math.min(Math.abs(priceChange) * 100, 100);

  return {
    direction,
    strength,
    keyLevels: {
      support: [Math.min(...candles.map((c) => c.low))],
      resistance: [Math.max(...candles.map((c) => c.high))],
    },
  };
}

async function processCandles(
  trade_type: string,
  asset: string,
  chain: string
): Promise<ProcessedMarketData> {
  const url = `https://${chain == "arb" ? "arbitrum" : "avalanche"}-api.gmxinfra.io/prices/candles?tokenSymbol=${trade_type == "spot" ? "ETH" : asset}&period=1d`;
  console.log("Fetching candles data from:", url);
  const response = await fetch(url);
  const { candles: rawCandles }: { period: string; candles: RawCandle[] } =
    (await response.json()) as { period: string; candles: RawCandle[] };
  const candles = rawCandles.map(([timestamp, open, high, low, close]) => ({
    timestamp,
    open,
    high,
    low,
    close,
  }));

  // Calculate price changes
  const priceChanges = candles
    .map((candle, i) =>
      i > 0 ? (candle.close - candles[i - 1].close) / candles[i - 1].close : 0
    )
    .slice(1);

  // Calculate volatility (using Exponential Moving Average of price changes)
  const volatility = calculateVolatility(priceChanges);

  // Identify trend
  const trendMetrics = analyzeTrend(candles);

  // Find volume profile
  const volumeProfile = {
    averageVolume: 0, // You'll need to add volume data to calculate this
    volumeSpikes: [], // Timestamps of significant volume increases
  };

  return {
    currentPrice: candles[candles.length - 1].close,
    priceChange24h:
      (candles[candles.length - 1].close - candles[0].close) / candles[0].close,
    volatility24h: volatility,
    volumeProfile,
    trendMetrics,
  };
}

export { processCandles };
