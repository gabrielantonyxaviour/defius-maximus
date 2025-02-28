import { ethers } from "ethers";
export const OrderType = {
  MarketSwap: 0,
  LimitSwap: 1,
  MarketIncrease: 2,
  LimitIncrease: 3,
  MarketDecrease: 4,
  LimitDecrease: 5,
  StopLossDecrease: 6,
  Liquidation: 7,
  StopIncrease: 8,
};
export const DecreasePositionSwapType = {
  NoSwap: 0,
  SwapPnlTokenToCollateralToken: 1,
  SwapCollateralTokenToPnlToken: 2,
};

export interface TPPoint {
  price: number;
  percent: number;
}

export interface SLPoint {
  price: number;
  percent: number;
}

export interface OrderParams {
  rpcUrl: string;
  chain: string;
  native: string;
  assetName: string;
  takeProfit: TPPoint[];
  stopLoss: SLPoint[];
  leverage: number;
  slippage: number;
  positionSizeInETH: number;
  isLong: boolean;
  executionFee: bigint;
}

export interface MarketSaltParams {
  indexToken: string;
  longToken: string;
  shortToken: string;
  marketType: string;
}

/**
 * Generates the initial market salt
 * @param params Market parameters
 * @returns bytes32 salt as a hex string
 */
export function getMarketSalt(params: MarketSaltParams): string {
  const { indexToken, longToken, shortToken, marketType } = params;

  const encoded = ethers.utils.defaultAbiCoder.encode(
    ["string", "address", "address", "address", "bytes32"],
    ["GMX_MARKET", indexToken, longToken, shortToken, marketType]
  );

  return ethers.utils.keccak256(encoded);
}

/**
 * Calculates the final market salt hash
 * @param salt Initial salt generated from getMarketSalt
 * @returns bytes32 hash as a hex string
 */
export function getMarketSaltHash(salt: string): string {
  const MARKET_SALT = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["string"], ["MARKET_SALT"])
  );

  const encoded = ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32"],
    [MARKET_SALT, salt]
  );

  return ethers.utils.keccak256(encoded);
}

export async function convertEthToAsset(
  chain: string,
  native: string,
  asset: string,
  amount: number
): Promise<{
  amountInETH: bigint;
  amountInUSD: bigint;
  assetPriceInUSD: bigint;
}> {
  const pricesResponse = await fetch(
    chain == "43113" || chain == "43114"
      ? "https://avalanche-api.gmxinfra.io/signed_prices/latest"
      : "https://arbitrum-api.gmxinfra.io/signed_prices/latest"
  );
  const { signedPrices } = await pricesResponse.json();
  const ethPriceData = signedPrices.find(
    (price: any) => price.tokenSymbol === native
  );
  const assetPriceData = signedPrices.find(
    (price: any) => price.tokenSymbol === asset
  );
  const avgEthPrice =
    (BigInt(ethPriceData.minPriceFull) + BigInt(ethPriceData.maxPriceFull)) /
    BigInt(2);
  console.log("ETH Price");
  console.log(avgEthPrice);
  const avgAssetPrice =
    (BigInt(assetPriceData.minPriceFull) +
      BigInt(assetPriceData.maxPriceFull)) /
    BigInt(2);
  console.log("Asset Price");
  console.log(avgAssetPrice);
  const usdAmount = BigInt(amount * 10 ** 12) * avgEthPrice;

  return {
    assetPriceInUSD:
      avgAssetPrice * 10n ** (asset == "SOL" || asset == "SUI" ? 9n : 10n),
    amountInUSD: usdAmount * 10n ** 6n,
    amountInETH: expandDecimals(amount * 10 ** 6, 12),
  };
}

export function expandDecimals(n: number, decimals: number) {
  return BigInt(n) * BigInt(10) ** BigInt(decimals);
}

export function decimalToFloat(value: number, decimals = 0) {
  return expandDecimals(value, 30 - decimals);
}

export async function getMarketTokenAddress(
  dataStore: ethers.Contract,
  indexToken: string,
  longToken: string,
  shortToken: string,
  marketType: string
) {
  const marketSaltHash = getMarketSaltHash(
    getMarketSalt({
      indexToken,
      longToken,
      shortToken,
      marketType,
    })
  );
  console.log("Market Salt Hash");
  console.log(marketSaltHash);
  return await dataStore["getAddress(bytes32)"](marketSaltHash);
}
