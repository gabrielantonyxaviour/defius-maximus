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
): Promise<Record<number, bigint>> {
  const supportedChains = [arbitrumSepolia, baseSepolia, avalancheFuji];
  const laterChains = [flowTestnet, zircuitTestnet];

  const balances: Record<number, bigint> = {};
  for (const chain of supportedChains) {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });
    balances[chain.id] = await publicClient.getBalance({
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
