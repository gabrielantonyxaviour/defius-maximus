import { getSwap, ChainId } from "sushi";
import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

async function main() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  // Get a swap from the API
  const data = await getSwap({
    chainId: ChainId.BASE, // ethereum chain id
    tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // eth token
    tokenOut: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // usdc token
    to: "0x", // replace with your own address
    amount: BigInt("1000000000000000000"), // 1 eth
    maxSlippage: 0.005, // 0.05% max slippage
    includeTransaction: true, // include transaction in response
  });
  console.log(data);

  // If the swap status is 'Success'
  if (data.status === "Success") {
    const { tx } = data;
    // Simulate a call to the blockchain for the swap
    const callResult = await publicClient.call({
      account: tx.from,
      data: tx.data,
      to: tx.to,
      value: tx.value,
    });
    // Returns the simulated amount out
    console.log("Output: ", callResult);

    // Send a transaction
    const PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY as Hex;
    const walletClient = createWalletClient({
      chain: base,
      transport: http(),
    });
    const hash = await walletClient.sendTransaction({
      account: privateKeyToAccount(PRIVATE_KEY),
      data: tx.data,
      to: tx.to,
      value: tx.value,
    });
    console.log("Tx: ", hash);
  }
}
main();
