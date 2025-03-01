import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { flowTestnet } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();
type Asset = {
  address: string;
  symbol: string;
  chainId: number;
};

const supportedFlowAssets: Record<string, Asset> = {
  WFLOW: {
    address: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e",
    symbol: "WFLOW",
    chainId: 747,
  },
  WETH: {
    address: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
    symbol: "WETH",
    chainId: 747,
  },
  cbBTC: {
    address: "0xA0197b2044D28b08Be34d98b23c9312158Ea9A18",
    symbol: "cbBTC",
    chainId: 747,
  },
};

async function main() {
  const PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY as Hex;
  const account = privateKeyToAccount(PRIVATE_KEY);

  console.log("Account Address");
  console.log(account.address);

  const publicClient = createPublicClient({
    chain: flowTestnet,
    transport: http(),
  });

  // const walletClient

  const FLOW_MAINNET_KITTY_ADDRESS = "";
  const FLOW_MAINNET_WRAPPED_FLOW = "";

  const { request } = await publicClient.simulateContract({
    account,
    address: FLOW_MAINNET_KITTY_ADDRESS as Hex,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "amountOutMin",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "path",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        name: "swapExactETHForTokens",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "swapExactETHForTokens",
  });
  const tx = await walletClient.writeContract(request);

  // // If the swap status is 'Success'
  // if (data.status === "Success") {
  //   const { tx } = data;
  //   // Simulate a call to the blockchain for the swap
  //   const callResult = await publicClient.call({
  //     account: tx.from,
  //     data: tx.data,
  //     to: tx.to,
  //     value: tx.value,
  //   });
  //   // Returns the simulated amount out
  //   console.log("Output: ", callResult);

  //   // Send a transaction
  //   const walletClient = createWalletClient({
  //     chain: rootstock,
  //     transport: http(),
  //   });

  //   const hash = await walletClient.sendTransaction({
  //     account,
  //     data: tx.data,
  //     to: tx.to,
  //     value: tx.value,
  //   });
  //   console.log("Tx: ", hash);
  // }
}
main();
