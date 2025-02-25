import { ethers } from "ethers";
import {
  assets,
  orderVaultDeployments,
  exchangeRouterAbi as exchangeRouterABI,
} from "./constants";
import dotenv from "dotenv";
import { zeroAddress } from "viem";
import dataStore from "./abis/data-store.json";
import exchangeRouter from "./abis/exchange-router.json";
import {
  convertEthToAsset,
  expandDecimals,
  getMarketTokenAddress,
  OrderParams,
} from "./helpers/utils";

dotenv.config();
type TakeProfit = {
  price: number;
  percent: number;
};

type StopLoss = {
  price: number;
  percent: number;
};

export async function placeTrade(
  pKey: string,
  native: string,
  asset: string,
  chain: string,
  amount: string,
  leverage: string,
  positionSizeInNative: string,
  takeProfit: TakeProfit[],
  stopLoss: StopLoss[],
  isLong: boolean
) {
  const dataStoreAbi = dataStore.abi;
  const rpcUrl =
    chain == "421614"
      ? "https://arb-sepolia.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
      : "https://avax-fuji.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY;

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pKey, provider);
  const exchangeRouterAbi = exchangeRouterABI[chain];
  const addresses = {
    wnt: assets[chain == "421614" ? "ETH" : "AVAX"][chain],
    token: assets[asset][chain],
    usdc: assets["USDC"][chain],
    exchangeRouter: exchangeRouter[chain],
    dataStore: dataStore[chain],
  };

  const executionFee =
    chain == "421614" ? expandDecimals(5, 14) : expandDecimals(1, 16);
}
