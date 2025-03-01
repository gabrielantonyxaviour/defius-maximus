import { getSwap, ChainId } from "sushi";
import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
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
    chain: base,
    transport: http(
      "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
    ),
  });

  const data = await getSwap({
    chainId: ChainId.BASE, // ethereum chain id
    tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Hex,
    tokenOut: tokenOut as Hex,
    to: account.address,
    amount: BigInt(amount), // 0.00005 rbtc
    maxSlippage: 0.005, // 0.05% max slippage
    includeTransaction: true, // include transaction in response
  });
  console.log(data);

  if (data.status === "Success") {
    const { tx } = data;
    const callResult = await publicClient.call({
      account: tx.from,
      data: tx.data,
      to: tx.to,
      value: tx.value,
    });
    console.log("Output: ", callResult);

    const walletClient = createWalletClient({
      chain: base,
      transport: http(
        "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
      ),
    });

    const hash = await walletClient.sendTransaction({
      chain: base,
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
