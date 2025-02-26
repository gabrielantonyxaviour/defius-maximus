import { Chain, createPublicClient, http } from "viem";
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  flowTestnet,
  zircuitTestnet,
} from "viem/chains";

export async function getMultichainBalance(
  address: `0x${string}`
): Promise<Record<string, bigint>> {
  const supportedChains = [arbitrumSepolia, baseSepolia, avalancheFuji];
  const laterChains = [flowTestnet, zircuitTestnet];

  const balances: Record<string, bigint> = {};
  for (const chain of supportedChains) {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });
    balances[
      chain.id == arbitrumSepolia.id
        ? "arb"
        : chain.id == baseSepolia.id
        ? "base"
        : "avax"
    ] = await publicClient.getBalance({
      address,
    });
  }

  return balances;
}

export async function getChainBalance(
  chain: Chain,
  address: `0x${string}`
): Promise<bigint> {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  return await publicClient.getBalance({
    address,
  });
}

export async function getPrice(): Promise<{
  ethPrice: string;
  avaxPrice: string;
}> {
  const response = await fetch("/api/alchemy/prices");
  const repsonseData = await response.json();
  return repsonseData;
}
