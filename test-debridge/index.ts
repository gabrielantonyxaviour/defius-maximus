import {
  createPublicClient,
  createWalletClient,
  Hex,
  http,
  zeroAddress,
} from "viem";
import { privateKeyToAccount, privateKeyToAddress } from "viem/accounts";
import { base } from "viem/chains";
import dotenv from "dotenv";
import { DEBRIDGE_GATE_ABI } from "./config";
dotenv.config();

async function main() {
  console.log("Starting deBridge transfer process...");
  const DEFIUS_PRIVATE_KEY = process.env.PRIVATE_KEY || "";

  const defiusAddress = privateKeyToAddress(
    DEFIUS_PRIVATE_KEY as `0x${string}`
  );
  console.log(defiusAddress);
  try {
    // Load private key and create account
    console.log("Creating wallet account...");
    const account = privateKeyToAccount(
      process.env.MAINNET_PRIVATE_KEY as `0x${string}`
    );
    console.log(`Account address: ${account.address}`);

    // Initialize wallet client
    console.log("Initializing wallet client on Base network...");
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(
        "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
      ),
    });

    // // Initialize public client
    console.log("Initializing public client...");
    const publicClient = createPublicClient({
      chain: base,
      transport: http(
        "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
      ),
    });

    // // Set receiver address (destination address on Arbitrum)
    const receiver = "0x91DdF5c1684905702Ef33459Dd2806f10cac78C1";
    console.log(`Receiver address: ${receiver}`);
    console.log(`Destination chain ID: 42161 (Arbitrum)`);

    // // Native token amount to transfer (in wei)
    const transferAmount = "10000000000000"; // 0.0001 ETH
    console.log(
      `Amount to transfer: ${transferAmount} wei (${
        Number(transferAmount) / 1e18
      } ETH)`
    );

    const sourceChain = "8453";
    const destinationChain = "42161";
    const amount = "1000000000000000"; // 0.001

    const dlnSwapEndpoint = `https://dln.debridge.finance/v1.0/dln/order/create-tx?srcChainId=${sourceChain}&srcChainTokenIn=${zeroAddress}&srcChainTokenInAmount=${amount}&dstChainId=${destinationChain}&dstChainTokenOut=${zeroAddress}&dstChainTokenOutAmount=auto&dstChainTokenOutRecipient=${account.address}&senderAddress=${account.address}&srcChainOrderAuthorityAddress=${account.address}&affiliateFeePercent=0&dstChainOrderAuthorityAddress=${account.address}&prependOperatingExpenses=false&skipSolanaRecipientValidation=false`;

    console.log(dlnSwapEndpoint);
    const response = await fetch(dlnSwapEndpoint);
    const responseData = await response.json();
    const tx: {
      to: Hex;
      data: Hex;
      value: string;
    } = responseData.tx;
    console.log("RECIVED TX");
    console.log(tx);

    const txHash = await walletClient.sendTransaction({
      to: tx.to,
      data: tx.data,
      value: BigInt(tx.value),
    });

    console.log(txHash);
  } catch (error) {
    console.error("Error in deBridge transfer:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("Process completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Process failed:", error);
    process.exit(1);
  });
