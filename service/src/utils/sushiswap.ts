import { getSwap, ChainId } from "sushi";
import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { rootstock } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

export async function performSwap({
  pKey,
  tokenOut,
  amount,
}: {
  pKey: string;
  tokenOut: string;
  amount: string;
}) {
  const PRIVATE_KEY = pKey as Hex;
  const account = privateKeyToAccount(PRIVATE_KEY);

  console.log("Account Address");
  console.log(account.address);

  const publicClient = createPublicClient({
    chain: rootstock,
    transport: http(
      "https://rootstock-mainnet.g.alchemy.com/v2/" +
        process.env.ALCHMEY_API_KEY
    ),
  });

  // Get a swap from the API
  const data = await getSwap({
    chainId: ChainId.ROOTSTOCK, // ethereum chain id
    tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Hex,
    tokenOut: tokenOut as Hex,
    to: account.address,
    amount: BigInt(amount), // 0.00005 rbtc
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
    const walletClient = createWalletClient({
      chain: rootstock,
      transport: http(
        "https://rootstock-mainnet.g.alchemy.com/v2/" +
          process.env.ALCHMEY_API_KEY
      ),
    });

    const hash = await walletClient.sendTransaction({
      chain: rootstock,
      account,
      data: tx.data,
      to: tx.to,
      value: tx.value,
      kzg: undefined,
    });
    console.log("Tx: ", hash);
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log("Receipt: ", receipt);
    return hash;
  }
}
