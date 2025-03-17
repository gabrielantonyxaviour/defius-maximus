import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  Hex,
  http,
  zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, story } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();
async function main() {
  const privateKey = process.env.MAINNET_PRIVATE_KEY || "";
  const callerAccount = privateKeyToAccount(privateKey as `0x${string}`);
  const ipId = "0xf78938029dF78D307D4288BC6B11B7385F8f98d9";
  const WIP_TOKEN_ADDRESS = "0x1514000000000000000000000000000000000000";
  const ROYALTY_MODULE = "0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086";
  const MULTICALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";
  const LICENSING_MODULE = "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f";
  const storyPublicClient = createPublicClient({
    chain: story,
    transport: http("https://evm-rpc-story.j-node.net"),
  });

  const storyWalletClient = createWalletClient({
    account: callerAccount,
    chain: story,
    transport: http("https://evm-rpc-story.j-node.net"),
  });

  // const mintLicenseTokensTxData = encodeFunctionData({
  //   abi: [
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "licensorIpId",
  //           type: "address",
  //         },
  //         {
  //           internalType: "address",
  //           name: "licenseTemplate",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "licenseTermsId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "amount",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "address",
  //           name: "receiver",
  //           type: "address",
  //         },
  //         {
  //           internalType: "bytes",
  //           name: "royaltyContext",
  //           type: "bytes",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "maxMintingFee",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint32",
  //           name: "maxRevenueShare",
  //           type: "uint32",
  //         },
  //       ],
  //       name: "mintLicenseTokens",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "startLicenseTokenId",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //   ],
  //   functionName: "mintLicenseTokens",
  //   args: [
  //     ipId as Hex,
  //     "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316" as Hex,
  //     BigInt("1"),
  //     BigInt("1"),
  //     "0xeE5C50573A8AF1B8Ee2D89CB9eB27dc298c5f75D" as Hex,
  //     "0x0000000000000000000000000000000000000000",
  //     BigInt("0"),
  //     100000000,
  //   ],
  // });

  // const tx = await storyWalletClient.sendTransaction({
  //   to: LICENSING_MODULE as Hex,
  //   data: mintLicenseTokensTxData,
  // });
  // console.log(`Mint License Tokens transaction hash: ${tx}`);
  // await storyPublicClient.waitForTransactionReceipt({
  //   hash: tx,
  // });
  // console.log("Mint License Tokens transaction confirmed!");
  // console.log("View on explorer");
  // console.log(`https://www.storyscan.xyz/tx/${tx}`);

  //   const approveTxData = encodeFunctionData({
  //     abi: erc20Abi,
  //     functionName: "approve",
  //     args: [ROYALTY_MODULE, BigInt("1000000000000000")],
  //   });
  //   const tx = await storyWalletClient.sendTransaction({
  //     to: WIP_TOKEN_ADDRESS as Hex,
  //     data: approveTxData,
  //   });
  //   console.log(`Approve transaction hash: ${tx}`);
  //   await storyPublicClient.waitForTransactionReceipt({
  //     hash: tx,
  //   });
  //   console.log("Approve transaction confirmed!");
  //   console.log("View on explorer");
  //   console.log(`https://www.storyscan.xyz/tx/${tx}`);

  // const payRoyaltyOnBehalfOfTxData = encodeFunctionData({
  //   abi: [
  //     {
  //       name: "payRoyaltyOnBehalf",
  //       type: "function",
  //       stateMutability: "nonpayable",
  //       inputs: [
  //         { name: "receiverIpId", type: "address" },
  //         { name: "payerIpId", type: "address" },
  //         { name: "token", type: "address" },
  //         { name: "amount", type: "uint256" },
  //       ],
  //       outputs: [],
  //     },
  //   ],
  //   functionName: "payRoyaltyOnBehalf",
  //   args: [
  //     ipId as Hex,
  //     zeroAddress as Hex,
  //     WIP_TOKEN_ADDRESS,
  //     BigInt("100000000000000"),
  //   ],
  // });
  // console.log([
  //   ipId as Hex,
  //   zeroAddress as Hex,
  //   WIP_TOKEN_ADDRESS,
  //   BigInt("100000000000000"),
  // ]);
  // const payTx = await storyWalletClient.sendTransaction({
  //   to: WIP_TOKEN_ADDRESS as Hex,
  //   data: payRoyaltyOnBehalfOfTxData,
  // });
  // console.log(`Pay Royalty transaction hash: ${payTx}`);
  // await storyPublicClient.waitForTransactionReceipt({
  //   hash: payTx,
  // });
  // console.log("Pay Royalty transaction confirmed!");
  // console.log("View on explorer");
  // console.log(`https://www.storyscan.xyz/tx/${payTx}`);
  //   const txData = [
  //     { target: WIP_TOKEN_ADDRESS as Hex, callData: approveTxData },
  //     { target: ROYALTY_MODULE as Hex, callData: payRoyaltyOnBehalfOfTxData },
  //   ];

  //   const { request } = await storyPublicClient.simulateContract({
  //     address: MULTICALL_ADDRESS,
  //     abi: [
  //       {
  //         inputs: [
  //           {
  //             components: [
  //               { internalType: "address", name: "target", type: "address" },
  //               { internalType: "bytes", name: "callData", type: "bytes" },
  //             ],
  //             internalType: "struct Multicall3.Call[]",
  //             name: "calls",
  //             type: "tuple[]",
  //           },
  //         ],
  //         name: "aggregate",
  //         outputs: [
  //           { internalType: "uint256", name: "blockNumber", type: "uint256" },
  //           { internalType: "bytes[]", name: "returnData", type: "bytes[]" },
  //         ],
  //         stateMutability: "payable",
  //         type: "function",
  //       },
  //     ],
  //     functionName: "aggregate",
  //     args: [txData],
  //   });

  //   const txHash = await storyWalletClient.writeContract(request);

  //   console.log(`Transaction hash: ${txHash}`);
  //   console.log("Waiting for transaction to be confirmed...");
  //   await storyPublicClient.waitForTransactionReceipt({
  //     hash: txHash,
  //   });
  //   console.log("Transaction confirmed!");
  //   console.log("View on explorer");
  //   console.log(`https://www.storyscan.xyz/tx/${txHash}`);
}

main();
