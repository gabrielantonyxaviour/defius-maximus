import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { rootstock } from "viem/chains";
import dotenv from "dotenv";
import * as CCIP from '@chainlink/ccip-js'
dotenv.config();

async function main() {
  const PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY as Hex;
  const account = privateKeyToAccount(PRIVATE_KEY);

  console.log("Account Address");
  console.log(account.address);

  const ccipClient = CCIP.createClient()
  const publicClient = createPublicClient({
    chain: ,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: mainnet,
    transport: http(),
  })

  const { txHash, txReceipt } = await ccipClient.approveRouter({
    client: walletClient,
    routerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    tokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    amount: 1000000000000000000n,
    waitForReceipt: true,
  })
  
  console.log(`Transfer approved. Transaction hash: ${txHash}. Transaction receipt: ${txReceipt}`)
  
  // Get fee for the transfer
  const fee = await ccipClient.getFee({
    client: publicClient,
    routerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    tokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    amount: 1000000000000000000n,
    destinationAccount: '0x1234567890abcdef1234567890abcdef12345678',
    destinationChainSelector: '1234',
  })
  
  console.log(`Fee: ${fee.toLocaleString()}`)
  
  // Variant 1: Transfer via CCIP using native token fee
  const { txHash, messageId } = await client.transferTokens({
    client: walletClient,
    routerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    tokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    amount: 1000000000000000000n,
    destinationAccount: '0x1234567890abcdef1234567890abcdef12345678',
    destinationChainSelector: '1234',
  })
  
  console.log(`Transfer success. Transaction hash: ${txHash}. Message ID: ${messageId}`)
  
  // Variant 2: Transfer via CCIP using the provided supported token for fee payment
  const { txHash, messageId } = await client.transferTokens({
    client: walletClient,
    routerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    tokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    amount: 1000000000000000000n,
    destinationAccount: '0x1234567890abcdef1234567890abcdef12345678',
    destinationChainSelector: '1234',
    feeTokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
  })

}
main();
