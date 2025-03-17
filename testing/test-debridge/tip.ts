import { privateKeyToAccount } from "viem/accounts";
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  formatEther,
  http,
  parseEther,
  zeroAddress,
} from "viem";
import dotenv from "dotenv";
import { base } from "viem/chains";
dotenv.config();

const main = async function () {
  const privateKey = process.env.MAINNET_PRIVATE_KEY || "";
  const callerAccount = privateKeyToAccount(privateKey as `0x${string}`);
  // const basePublicClient = createPublicClient({
  //   chain: base,
  //   transport: http(),
  // });
  const baseWalletClient = createWalletClient({
    account: callerAccount,
    chain: base,
    transport: http(),
  });

  const RECEIVER_IP = "0x8F7a0fe18D747399E623ca0F92Bd0159148c5776";

  const amount = "100000000000000";

  const settleRoyaltiesTxData = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "address", name: "receiverIpId", type: "address" },
          { internalType: "address", name: "payerIpId", type: "address" },
        ],
        name: "settleRoyalties",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      { stateMutability: "payable", type: "receive" },
    ],
    functionName: "settleRoyalties",
    args: [RECEIVER_IP, zeroAddress],
  });
  console.log(settleRoyaltiesTxData);

  const srcChainId = 8453;
  const debridgeRoyaltyRelayer = "0xa4b83a29904e61A50C5fE5eCA42a61A23CFa36e1";
  const requestUrl = `https://dln.debridge.finance/v1.0/dln/order/create-tx?srcChainId=${srcChainId}&srcChainTokenIn=0x0000000000000000000000000000000000000000&srcChainTokenInAmount=${amount}&dstChainId=100000013&dstChainTokenOut=0x0000000000000000000000000000000000000000&dstChainTokenOutAmount=auto&dstChainTokenOutRecipient=${debridgeRoyaltyRelayer}&senderAddress=${callerAccount.address}&srcChainOrderAuthorityAddress=${callerAccount.address}&affiliateFeePercent=0&dstChainOrderAuthorityAddress=${callerAccount.address}&enableEstimate=true&dlnHook=%7B%22type%22%3A%22evm_transaction_call%22%2C%22data%22%3A%7B%22to%22%3A%22${debridgeRoyaltyRelayer}%22%2C%22calldata%22%3A%22${settleRoyaltiesTxData}%22%7D%7D&prependOperatingExpenses=false&skipSolanaRecipientValidation=false`;
  const response = await fetch(requestUrl);
  const { errorMessage, tx } = await response.json();

  if (errorMessage) {
    console.log(errorMessage);
    return;
  } else {
    console.log("Transaction:", {
      to: tx.to,
      value: tx.value,
      gas: tx.gasLimit,
    });
    const hash = await baseWalletClient.sendTransaction({
      to: tx.to,
      data: tx.data,
      value: BigInt(tx.value),
    });

    console.log(`Transaction hash: ${hash}`);
  }
};

main();
