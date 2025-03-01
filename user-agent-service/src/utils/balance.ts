import { Chain, createPublicClient, formatEther, Hex, http } from "viem";
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  flowTestnet,
  zircuitTestnet,
} from "viem/chains";
export default async function getBalances(
  address: Hex,
  chains: Chain[]
): Promise<Record<number, string>> {
  const balances: Record<number, string> = {};
  for (const chain of chains) {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });
    balances[chain.id] = formatEther(
      await publicClient.getBalance({
        address,
      })
    );
  }

  return balances;
}
