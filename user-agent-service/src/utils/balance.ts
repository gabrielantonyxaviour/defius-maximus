import { Chain, createPublicClient, formatEther, Hex, http } from "viem";
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  flowTestnet,
  zircuitTestnet,
} from "viem/chains";
export default async function getBalances(
  address: Hex
): Promise<Record<string, string>> {
  const supportedChains = [arbitrumSepolia, baseSepolia, avalancheFuji];
  const laterChains = [flowTestnet, zircuitTestnet];

  const balances: Record<string, string> = {};
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
    ] = formatEther(
      await publicClient.getBalance({
        address,
      })
    );
  }

  return balances;
}
