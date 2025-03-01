import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  formatUnits,
  Hex,
  http,
  zeroAddress,
} from "viem";
import { privateKeyToAccount, privateKeyToAddress } from "viem/accounts";
import { base, story } from "viem/chains";
import dotenv from "dotenv";
import { DEBRIDGE_GATE_ABI } from "./config";
dotenv.config();

const WIP_TOKEN_ADDRESS = "0x1514000000000000000000000000000000000000"; // Story WIP token
const ROYALTY_CONTRACT = "0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086";
const CHECK_INTERVAL = 10000;
async function main(traderIp: string, caller_p_key: string) {
  console.log(
    "Royalty Payment Simulation from Base Mainnet to Story Mainnet via deBridge"
  );
  const DEFIUS_PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  const defiusAccount = privateKeyToAccount(
    DEFIUS_PRIVATE_KEY as `0x${string}`
  );
  const callerAccount = privateKeyToAccount(caller_p_key as `0x${string}`);

  console.log("Accounts initialized!");

  try {
    console.log("Initializing Base Clients...");
    const baseWalletClient = createWalletClient({
      account: callerAccount,
      chain: base,
      transport: http(
        "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
      ),
    });

    const basePublicClient = createPublicClient({
      chain: base,
      transport: http(
        "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
      ),
    });

    console.log("Initializing Story Clients...");
    const storyWalletClient = createWalletClient({
      account: defiusAccount,
      chain: story,
      transport: http("https://mainnet.storyrpc.io"),
    });

    const storyPublicClient = createPublicClient({
      chain: story,
      transport: http("https://mainnet.storyrpc.io"),
    });

    const receiver = defiusAccount.address;
    console.log(`Receiver address: ${receiver}`);
    console.log(`Destination chain : 100000013 (Story)`);

    const amount = "1000000000000000"; // 0.001
    console.log(
      `Amount to transfer: ${amount} wei (${Number(amount) / 1e18} ETH)`
    );

    const sourceChain = "8453";
    const destinationChain = "100000013";
    const dlnSwapEndpoint = `https://dln.debridge.finance/v1.0/dln/order/create-tx?srcChainId=${sourceChain}&srcChainTokenIn=${zeroAddress}&srcChainTokenInAmount=${amount}&dstChainId=${destinationChain}&dstChainTokenOut=${WIP_TOKEN_ADDRESS}&dstChainTokenOutAmount=auto&dstChainTokenOutRecipient=${defiusAccount.address}&senderAddress=${defiusAccount.address}&srcChainOrderAuthorityAddress=${defiusAccount.address}&affiliateFeePercent=0&dstChainOrderAuthorityAddress=${defiusAccount.address}&prependOperatingExpenses=false&skipSolanaRecipientValidation=false`;

    console.log(dlnSwapEndpoint);
    const response = await fetch(dlnSwapEndpoint);
    const responseData = await response.json();
    const tx: {
      to: Hex;
      data: Hex;
      value: string;
    } = responseData.tx;
    console.log("Received Serialized TX");
    console.log(tx);

    console.log("Sending tx to bridge Base ETH to Story WIP");

    const txHash = await baseWalletClient.sendTransaction({
      to: tx.to,
      data: tx.data,
      value: BigInt(tx.value),
    });
    console.log("Recived Tx Hash");
    console.log(txHash);
    await basePublicClient.getTransactionReceipt({
      hash: txHash,
    });
    console.log("Tx Confirmed on Base Mainnet");
    console.log("https://base.blockscout.com/tx/" + txHash);

    console.log("Waiting for the transfer to be confirmed on Story Mainnet...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    while (true) {
      try {
        // Check WIP balance
        const balance = await storyPublicClient.readContract({
          address: WIP_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [defiusAccount.address],
        });

        console.log(`Current WIP balance: ${formatUnits(balance, 18)} WIP`);

        if (balance > BigInt("0")) {
          console.log(
            "Balance detected! Proceeding with approval and function call..."
          );

          console.log("Approving WIP tokens to the royalty contract...");
          const { request: approveRequest } =
            await storyPublicClient.simulateContract({
              address: WIP_TOKEN_ADDRESS,
              abi: erc20Abi,
              functionName: "approve",
              args: [ROYALTY_CONTRACT, balance],
            });
          const approvalHash = await storyWalletClient.writeContract(
            approveRequest
          );
          console.log(`Approval transaction hash: ${approvalHash}`);
          console.log("Waiting for approval transaction to be confirmed...");
          await storyPublicClient.waitForTransactionReceipt({
            hash: approvalHash,
          });
          console.log("Approval confirmed!");

          console.log("Calling payRoyaltyOnBehalf function...");
          const { request } = await storyPublicClient.simulateContract({
            address: ROYALTY_CONTRACT,
            abi: [
              {
                name: "payRoyaltyOnBehalf",
                type: "function",
                stateMutability: "nonpayable",
                inputs: [
                  { name: "receiverIpId", type: "address" },
                  { name: "payerIpId", type: "address" },
                  { name: "token", type: "address" },
                  { name: "amount", type: "uint256" },
                ],
                outputs: [],
              },
            ],
            functionName: "payRoyaltyOnBehalf",
            args: [
              traderIp as Hex,
              traderIp as Hex,
              WIP_TOKEN_ADDRESS,
              balance,
            ],
          });
          const payRoyaltyHash = await storyWalletClient.writeContract(request);
          console.log(`payRoyaltyOnBehalf transaction hash: ${payRoyaltyHash}`);
          console.log("Waiting for transaction to be confirmed...");
          await storyPublicClient.waitForTransactionReceipt({
            hash: payRoyaltyHash,
          });

          console.log(
            "Transaction confirmed! payRoyaltyOnBehalf executed successfully!"
          );
          break;
        }
        console.log(`No WIP balance yet. Checking again in 10 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
        console.log("Retrying Balance Check...");
      } catch (error) {
        console.error("Error occurred:", error);
        console.log("Retrying in 10 seconds...");
        await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
      }
    }
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
