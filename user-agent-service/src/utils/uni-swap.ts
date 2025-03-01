import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  parseEther,
  formatEther,
  formatUnits,
  parseUnits,
  Address,
  PublicClient,
  WalletClient,
  TransactionReceipt,
  Chain,
  Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { zircuitTestnet, flowTestnet } from "viem/chains";

const deployments = {
  [flowTestnet.id]: {
    network: "flowEvm",
    tokenFactory: "0xF1D62f668340323a6533307Bb0e44600783BE5CA",
    weth: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e",
    router: "0xeD53235cC3E9d2d464E9c408B95948836648870B",
    factory: "0x0f6C2EF40FA42B2F0E0a9f5987b2f3F8Af3C173f",
    deployer: "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
    tokens: {
      WBTC: "0x7e4Fbf6Ff02C955b73C90154a60D6a88CA849A8A",
      WSOL: "0xf789e57Ff25C65280B96E43d5d152bf3Ff00B7e6",
      USDT: "0x02d055524613D23e10c17998C12B9427ba565DB5",
      WFLOW: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e",
    },
    pairs: {
      "WBTC-USDT": "0xF79BEae8138142FFDFEDb5602Dd439938269CbC2",
      "WFLOW-USDT": "0x0d7E1aEf255f161CfDb52FA3555d3b10E3f7c4c8",
      "WSOL-USDT": "0x0715ceF5a21d21D42B205Dd634aa8a5099E31aF5",
    },
  },
  [zircuitTestnet.id]: {
    network: "zircuit",
    tokenFactory: "0x34EC9c9291dB51Cc763AbF2DF45d0a67CBa7244f",
    weth: "0x4200000000000000000000000000000000000006",
    router: "0x009F72E09A3D2c7EdaAAfB2887666f8d26B2341d",
    factory: "0xae1Ba801bC874D903BA4A825370C31D72B98b499",
    deployer: "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
    tokens: {
      WBTC: "0xf8755ce313eD86FAE7EB495616e40A030ab1dF2B",
      WSOL: "0x39E2f5cDca1558EeC341d72cD1ECa817235F3918",
      USDT: "0xAE9e73353e43A99F08b9B96596cEbf77371800d8",
      WETH: "0x4200000000000000000000000000000000000006",
    },
    pairs: {
      "WBTC-USDT": "0xf343EbEeeB2128E1ecDC0c17c00C3D8e5Fc765a2",
      "WETH-USDT": "0x8bf2896F01cD458FC9384FCDd571783dB76077f0",
      "WSOL-USDT": "0xB85C6a59fBd5C5D4D1f3e17a50351af465474444",
    },
  },
};

export async function swapNativeToToken(
  chain: Chain,
  pKey: string,
  assetTo: string,
  amountToSwap: string
) {
  const rpcUrl =
    chain === zircuitTestnet
      ? "https://rpc.testnet.zircuit.com"
      : "https://flow-testnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY;
  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const chainDeployments = deployments[chain.id];
  const account = privateKeyToAccount(("0x" + pKey) as Hex);
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });
  const targetTokenAddress =
    chainDeployments.tokens[assetTo != "WBTC" ? "WSOL" : "WBTC"];

  try {
    const routerAbi = parseAbi([
      "function WETH() external pure returns (address)",
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    ]);

    // ERC20 ABI for reading token info
    const erc20Abi = parseAbi([
      "function symbol() external view returns (string)",
      "function decimals() external view returns (uint8)",
      "function balanceOf(address owner) external view returns (uint256)",
    ]);

    const decimals = await publicClient.readContract({
      address: targetTokenAddress,
      abi: erc20Abi,
      functionName: "decimals",
    });

    console.log(`Swapping to ${assetTo} with ${decimals} decimals`);

    // Convert amount to wei
    const amountIn = parseEther(amountToSwap);
    console.log(
      `Swapping ${amountToSwap} native currency (${formatEther(amountIn)} wei)`
    );

    // Set up the path: wrapped native -> target token
    const path = [chainDeployments.weth, targetTokenAddress];

    // Get expected output amount
    const amounts = (await publicClient.readContract({
      address: chainDeployments.router,
      abi: routerAbi,
      functionName: "getAmountsOut",
      args: [amountIn, path],
    })) as bigint[];

    const expectedOutputAmount = amounts[1];
    console.log(
      `Expected output: ${formatUnits(
        expectedOutputAmount,
        decimals
      )} ${assetTo}`
    );

    // Calculate minimum output amount with slippage tolerance
    const slippageFactor = 0.99;
    const minOutputAmount = parseUnits(
      (
        Number(formatUnits(expectedOutputAmount, decimals)) * slippageFactor
      ).toFixed(Number(decimals)),
      decimals
    );
    console.log(
      `Minimum output with ${1}% slippage: ${formatUnits(
        minOutputAmount,
        decimals
      )} ${assetTo}`
    );

    // Set deadline to 20 minutes from now
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

    // Perform the swap
    console.log("Executing swap...");
    const { request } = await publicClient.simulateContract({
      address: chainDeployments.router,
      abi: routerAbi,
      functionName: "swapExactETHForTokens",
      args: [minOutputAmount, path, account.address, deadline],
      value: amountIn,
      chain,
    });
    const hash = await walletClient.writeContract(request);

    console.log(`Transaction hash: ${hash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Position created");
    console.log(chain.blockExplorers.default.url + "/tx/" + hash);
  } catch (error) {
    console.error("Error in swap:", error);
    throw error;
  }
}
