import { evm } from "@debridge-finance/desdk";
import { Flags } from "@debridge-finance/desdk/lib/evm";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import dotenv from "dotenv";
import { DEBRIDGE_GATE_ABI } from "./config";
dotenv.config();

async function main() {
  console.log("Starting deBridge transfer process...");

  try {
    // Load private key and create account
    // console.log("Creating wallet account...");
    // const account = privateKeyToAccount(
    //   process.env.MAINNET_PRIVATE_KEY as `0x${string}`
    // );
    // console.log(`Account address: ${account.address}`);

    // // Initialize wallet client
    // console.log("Initializing wallet client on Base network...");
    // const walletClient = createWalletClient({
    //   account,
    //   chain: base,
    //   transport: http(
    //     "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
    //   ),
    // });

    // // Initialize public client
    // console.log("Initializing public client...");
    // const publicClient = createPublicClient({
    //   chain: base,
    //   transport: http(
    //     "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY
    //   ),
    // });

    // // Set receiver address (destination address on Arbitrum)
    // const receiver = "0x91DdF5c1684905702Ef33459Dd2806f10cac78C1";
    // console.log(`Receiver address: ${receiver}`);
    // console.log(`Destination chain ID: 42161 (Arbitrum)`);

    // // Native token amount to transfer (in wei)
    // const transferAmount = "10000000000000"; // 0.0001 ETH
    // console.log(
    //   `Amount to transfer: ${transferAmount} wei (${
    //     Number(transferAmount) / 1e18
    //   } ETH)`
    // );

    // // Create message object
    // console.log("Creating deBridge message...");
    // const message = new evm.Message({
    //   tokenAddress: "0x0000000000000000000000000000000000000000", // Native token (ETH)
    //   amount: transferAmount,
    //   chainIdTo: "42161", // Arbitrum
    //   receiver,
    //   autoParams: new evm.SendAutoParams({
    //     executionFee: "0",
    //     fallbackAddress: receiver,
    //     flags: new Flags(),
    //     data: "0x", // No additional call data
    //   }),
    // });

    // // Get encoded arguments for the send function
    // console.log("Encoding message arguments...");
    // const argsForSend = message.getEncodedArgs();
    // console.log("Args encoded successfully");

    // // Get the fixed native fee required by deBridge
    // console.log("Fetching deBridge protocol fee...");
    // const fee = await publicClient.readContract({
    //   address: "0xc1656B63D9EEBa6d114f6bE19565177893e5bCBF", // deBridge Gate on Base
    //   abi: DEBRIDGE_GATE_ABI,
    //   functionName: "globalFixedNativeFee",
    // });
    // console.log(`deBridge protocol fee: ${fee} wei`);

    // // Calculate total value to send (transfer amount + fee)
    // const totalValue = BigInt(transferAmount) + (fee as bigint);
    // console.log(
    //   `Total transaction value: ${totalValue} wei (${
    //     Number(totalValue) / 1e18
    //   } ETH)`
    // );

    // // Simulate contract call
    // console.log("Simulating contract call...");
    // const { request } = await publicClient.simulateContract({
    //   account,
    //   address: "0xc1656B63D9EEBa6d114f6bE19565177893e5bCBF", // deBridge Gate on Base
    //   abi: DEBRIDGE_GATE_ABI,
    //   functionName: "send",
    //   args: argsForSend,
    //   value: totalValue,
    // });
    // console.log("Contract simulation successful");

    // // Execute the transaction
    // console.log("Sending transaction...");
    // const tx = await walletClient.writeContract(request);
    // console.log(`Transaction sent! Hash: ${tx}`);
    // console.log(`View on explorer: https://basescan.org/tx/${tx}`);

    const evmOriginContext: evm.Context = {
      // provide a URL to the RPC node of the 🛫origin chain
      provider:
        "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
    };

    const evmDestinationContext: evm.Context = {
      // provide a URL to the RPC node of the 🛬destination chain
      provider:
        "https://arb-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
    };

    const submissions = await evm.Submission.findAll(
      "0xf982851e97ffbed7dc906676738567ef08966d71f618a8c343fb250ab05f7381",
      evmOriginContext
    );

    const [submission] = submissions;

    // check if submission if confirmed: validator nodes wait a specific block
    // confirmations before sign the message. Currently, 12 blocks is expected
    // for most supported EVM chains (256 for Polygon).
    const isConfirmed = await submission.hasRequiredBlockConfirmations();

    // there is also a bunch of useful properties that describe the submission, e.g.
    console.log("cross-chain asset ID transferred: ", submission.debridgeId);
    console.log(
      "amount transferred to",
      submission.amount,
      submission.receiver
    );

    if (isConfirmed) {
      const claim = await submission.toEVMClaim(evmDestinationContext);

      // check if claim has been signed by enough validators
      const isSigned = await claim.isSigned();

      // check if this claim has been already executed
      const isExecuted = await claim.isExecuted();

      console.log("Claim is signed: ", isSigned);
      console.log("Claim is executed: ", isExecuted);
      // get claim args
      if (isSigned && !isExecuted) {
        // the resulting tuple of args to be then passed to the deBridgeGate.claim() method
        const claimArgs = await claim.getEncodedArgs();

        // e.g. using ethers.js:
        // await deBridgeGate.claim(...claimArgs, { gasLimit: 8_000_000 });
      }
    }

    // return tx;
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
