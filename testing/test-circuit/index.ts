import { getSwap, ChainId } from "sushi";
import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { rootstock } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY as Hex;
  const account = privateKeyToAccount(PRIVATE_KEY);

  console.log("Account Address");
  console.log(account.address);

  const publicClient = createPublicClient({
    chain: rootstock,
    transport: http(),
  });

  // Get a swap from the API
  const data = await getSwap({
    chainId: ChainId.ROOTSTOCK, // ethereum chain id
    tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // native token
    tokenOut: "0x2AcC95758f8b5F583470ba265EB685a8F45fC9D5", // rif token
    to: "0xeE5C50573A8AF1B8Ee2D89CB9eB27dc298c5f75D", // replace with your own address
    amount: BigInt("50000000000000"), // 0.00005 rbtc
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
      transport: http(),
    });

    const hash = await walletClient.sendTransaction({
      account,
      data: tx.data,
      to: tx.to,
      value: tx.value,
    });
    console.log("Tx: ", hash);
  }
}
main();
