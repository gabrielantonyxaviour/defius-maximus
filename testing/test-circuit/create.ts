import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zircuitTestnet } from "viem/chains"; // You might need to define this if not available
import dotenv from "dotenv";
dotenv.config();

const erc20ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

// Token Factory ABI - Simplified for custom ERC20 deployment
const tokenFactoryABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "initialSupply", type: "uint256" },
      { name: "decimals", type: "uint8" },
    ],
    name: "createToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Uniswap V2 Factory ABI
const uniswapV2FactoryABI = [
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "createPair",
    outputs: [{ name: "pair", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "getPair",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

// Uniswap V2 Router ABI
const uniswapV2RouterABI = [
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "amountADesired", type: "uint256" },
      { name: "amountBDesired", type: "uint256" },
      { name: "amountAMin", type: "uint256" },
      { name: "amountBMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "liquidity", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Main Configuration
const config = {
  rpcUrl: "https://garfield-testnet.zircuit.com", // Replace with actual zircuitTestnet RPC URL
  privateKey: process.env.PRIVATE_KEY || "", // Replace with your private key (without 0x prefix)
  addresses: {
    router: "0x009F72E09A3D2c7EdaAAfB2887666f8d26B2341d", // Provided Uniswap V2 Router address
    factory: "0xae1Ba801bC874D903BA4A825370C31D72B98b499", // Need to find the factory address, often can be obtained from router
  },
  tokens: {
    USDT: { name: "Tether USD", symbol: "USDT", decimals: 6 },
    WETH: { name: "Wrapped Ether", symbol: "WETH", decimals: 18 },
    WBTC: { name: "Wrapped Bitcoin", symbol: "WBTC", decimals: 8 },
    WSOL: { name: "Wrapped Solana", symbol: "WSOL", decimals: 9 },
  },
};
const TOKEN_FACTORY_BYTECODE =
  "0x608060405234801561001057600080fd5b50611a8b806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063d8c87eef14610030575b600080fd5b61004a6004803603810190610045919061099d565b610060565b60405161005791906109f9565b60405180910390f35b600080866040518060400160405280888152602001878152602001508560ff166000805160206119cd833981519152308a89604051610099909190610a14565b6109a49291906109ee565b85805190602001be8780519060200190f3fe60806040526004361061009c5760003560e01c8063313ce56711610064578063313ce56714610166578063395093511461019157806370a082311461013395..."; // shortened for example - use actual bytecode

// ABI for the deployed TokenFactory
const TOKEN_FACTORY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "initialSupply", type: "uint256" },
      { name: "decimals", type: "uint8" },
    ],
    name: "createToken",
    outputs: [{ name: "tokenAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenAddress", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "symbol", type: "string" },
      { indexed: false, name: "decimals", type: "uint8" },
      { indexed: false, name: "initialSupply", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
    ],
    name: "TokenCreated",
    type: "event",
  },
];
// async function deployTokenFactory() {
//   console.log("Deploying TokenFactory contract...");

//   try {
//     // Deploy the contract
//     const hash = await walletClient.deployContract({
//       abi: TOKEN_FACTORY_ABI,
//       bytecode: TOKEN_FACTORY_BYTECODE as `0x${string}`,
//       account,
//     });

//     console.log(`Transaction hash: ${hash}`);

//     // Wait for the transaction to be mined
//     const receipt = await publicClient.waitForTransactionReceipt({ hash });

//     console.log(`TokenFactory deployed at address: ${receipt.contractAddress}`);
//     console.log("Deployment successful!");

//     return receipt.contractAddress;
//   } catch (error) {
//     console.error("Error deploying TokenFactory:", error);
//     throw error;
//   }
// }

// Initialize clients
const account = privateKeyToAccount(`0x${config.privateKey}`);

const publicClient = createPublicClient({
  chain: zircuitTestnet, // You may need to define this chain if not available in viem
  transport: http(config.rpcUrl),
});

const walletClient = createWalletClient({
  account,
  chain: zircuitTestnet,
  transport: http(config.rpcUrl),
});

// Helper to format units based on token decimals
const formatUnits = (value: bigint, decimals: number): string => {
  return (Number(value) / Math.pow(10, decimals)).toString();
};

// Helper to parse units based on token decimals
const parseUnits = (value: string, decimals: number): bigint => {
  return BigInt(Math.floor(Number(value) * Math.pow(10, decimals)));
};

// Function to create a token
async function createToken(
  name: string,
  symbol: string,
  decimals: number,
  tokenFactory: string
): Promise<string> {
  console.log(`Creating token ${name} (${symbol})...`);

  const initialSupply = parseUnits("1000000000", decimals); // 1 billion tokens

  const { request } = await publicClient.simulateContract({
    address: tokenFactory as `0x${string}`,
    abi: tokenFactoryABI,
    functionName: "createToken",
    args: [name, symbol, initialSupply, decimals],
    account,
  });

  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // For this example, we're assuming the token address is returned in the logs
  // In a real implementation, you'd need to parse the event logs
  // This is a simplified example
  const tokenAddress = "0x..."; // You would extract this from the logs

  console.log(`Token ${symbol} created at address: ${tokenAddress}`);
  return tokenAddress;
}

// Function to create tokens from config
async function createAllTokens() {
  const tokenFactory = "0xD4171D5a25B3A684d1952Dd8141fA27911004f12";

  const tokenAddresses: Record<string, string> = {};

  for (const [symbol, details] of Object.entries(config.tokens)) {
    tokenAddresses[symbol] = await createToken(
      details.name,
      details.symbol,
      details.decimals,
      tokenFactory as string
    );
  }

  return tokenAddresses;
}

// Function to create a trading pair
async function createTradingPair(
  tokenA: string,
  tokenB: string
): Promise<string> {
  console.log(`Creating trading pair for ${tokenA} - ${tokenB}...`);

  // Check if pair already exists
  const pairAddress = await publicClient.readContract({
    address: config.addresses.factory as `0x${string}`,
    abi: uniswapV2FactoryABI,
    functionName: "getPair",
    args: [tokenA, tokenB],
  });

  if (pairAddress !== "0x0000000000000000000000000000000000000000") {
    console.log(`Pair already exists at ${pairAddress}`);
    return pairAddress as string;
  }

  // Create the pair
  const { request } = await publicClient.simulateContract({
    address: config.addresses.factory as `0x${string}`,
    abi: uniswapV2FactoryABI,
    functionName: "createPair",
    args: [tokenA, tokenB],
    account,
  });

  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Get the new pair address
  const newPairAddress = await publicClient.readContract({
    address: config.addresses.factory as `0x${string}`,
    abi: uniswapV2FactoryABI,
    functionName: "getPair",
    args: [tokenA, tokenB],
  });

  console.log(`New trading pair created at ${newPairAddress}`);
  return newPairAddress as string;
}

// Function to approve tokens for the router
async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: bigint
): Promise<void> {
  console.log(
    `Approving ${amount} tokens at ${tokenAddress} for ${spenderAddress}...`
  );

  const { request } = await publicClient.simulateContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
    args: [spenderAddress, amount],
    account,
  });

  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });

  console.log(`Approval successful`);
}

// Function to add liquidity to a pair
async function addLiquidity(
  tokenA: string,
  tokenB: string,
  amountA: bigint,
  amountB: bigint
): Promise<void> {
  console.log(
    `Adding liquidity: ${amountA} of ${tokenA} and ${amountB} of ${tokenB}...`
  );

  // First approve both tokens
  await approveToken(tokenA, config.addresses.router, amountA);
  await approveToken(tokenB, config.addresses.router, amountB);

  // Calculate minimum amounts (5% slippage)
  const amountAMin = (amountA * BigInt(95)) / BigInt(100);
  const amountBMin = (amountB * BigInt(95)) / BigInt(100);

  // Set deadline 20 minutes from now
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

  // Add liquidity
  const { request } = await publicClient.simulateContract({
    address: config.addresses.router as `0x${string}`,
    abi: uniswapV2RouterABI,
    functionName: "addLiquidity",
    args: [
      tokenA,
      tokenB,
      amountA,
      amountB,
      amountAMin,
      amountBMin,
      account.address,
      deadline,
    ],
    account,
  });

  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });

  console.log(`Liquidity added successfully`);
}

// Function to swap tokens
async function swapTokens(
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  minAmountOut: bigint
): Promise<void> {
  console.log(
    `Swapping ${amountIn} of ${tokenIn} for at least ${minAmountOut} of ${tokenOut}...`
  );

  // First approve the token to be spent
  await approveToken(tokenIn, config.addresses.router, amountIn);

  // Set deadline 20 minutes from now
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

  // Create the token path
  const path = [tokenIn, tokenOut];

  // Execute the swap
  const { request } = await publicClient.simulateContract({
    address: config.addresses.router as `0x${string}`,
    abi: uniswapV2RouterABI,
    functionName: "swapExactTokensForTokens",
    args: [amountIn, minAmountOut, path, account.address, deadline],
    account,
  });

  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log(`Swap executed successfully`);
}

// Main function to execute everything
async function main() {
  try {
    // 1. Create all tokens
    console.log("Step 1: Creating tokens...");
    const tokenAddresses = await createAllTokens();
    console.log("All tokens created:", tokenAddresses);

    // 2. Create trading pairs
    console.log("\nStep 2: Creating trading pairs...");

    const pairs = {
      "WETH/USDT": await createTradingPair(
        tokenAddresses.WETH,
        tokenAddresses.USDT
      ),
      "WBTC/USDT": await createTradingPair(
        tokenAddresses.WBTC,
        tokenAddresses.USDT
      ),
      "WSOL/USDT": await createTradingPair(
        tokenAddresses.WSOL,
        tokenAddresses.USDT
      ),
    };

    console.log("Trading pairs created:", pairs);

    // 3. Add liquidity to each pair
    console.log("\nStep 3: Adding liquidity to pairs...");

    // WETH/USDT pair (1 ETH = 2000 USDT)
    await addLiquidity(
      tokenAddresses.WETH,
      tokenAddresses.USDT,
      parseUnits("10", 18), // 10 ETH
      parseUnits("20000", 6) // 20,000 USDT
    );

    // WBTC/USDT pair (1 BTC = 30000 USDT)
    await addLiquidity(
      tokenAddresses.WBTC,
      tokenAddresses.USDT,
      parseUnits("1", 8), // 1 BTC
      parseUnits("30000", 6) // 30,000 USDT
    );

    // WSOL/USDT pair (1 SOL = 100 USDT)
    await addLiquidity(
      tokenAddresses.WSOL,
      tokenAddresses.USDT,
      parseUnits("100", 9), // 100 SOL
      parseUnits("10000", 6) // 10,000 USDT
    );

    console.log("Liquidity added to all pairs");

    // 4. Execute a test swap
    console.log("\nStep 4: Executing a test swap...");

    // Swap 0.1 ETH for USDT
    await swapTokens(
      tokenAddresses.WETH,
      tokenAddresses.USDT,
      parseUnits("0.1", 18), // 0.1 ETH
      parseUnits("190", 6) // Minimum 190 USDT (expecting ~200, accounting for slippage)
    );

    console.log("Test swap completed successfully");

    console.log("\nAll steps completed successfully!");
  } catch (error) {
    console.error("Error in main execution:", error);
  }
}

// Execute the main function
main().catch(console.error);
