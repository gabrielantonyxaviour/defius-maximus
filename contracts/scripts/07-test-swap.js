const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Testing swaps with account:", deployer.address);
  console.log("Network:", hre.network.name);

  // Load deployment data
  const network = hre.network.name;
  const deploymentPath = path.join(
    __dirname,
    "../deployments",
    `${network}-deployment.json`
  );

  if (!fs.existsSync(deploymentPath)) {
    console.error(
      `No deployment found for network ${network}. Please run deployment scripts first.`
    );
    return;
  }

  const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  // Get router address based on network
  let routerAddress;
  if (network === "zircuit") {
    routerAddress = process.env.ZIRCUIT_ROUTER_ADDRESS;
  } else if (network === "flowEvm") {
    routerAddress = process.env.FLOW_ROUTER_ADDRESS;
  } else {
    throw new Error(`Unsupported network: ${network}`);
  }

  if (!routerAddress) {
    throw new Error(
      `Missing router address for ${network}. Please check your .env file.`
    );
  }

  console.log("Using UniswapV2 Router:", routerAddress);

  // UniswapV2 Router interface
  const routerAbi = [
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  ];

  // ERC20 interface
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
    "function transfer(address to, uint256 amount) external returns (bool)",
  ];

  // Get the router contract
  const router = new ethers.Contract(routerAddress, routerAbi, deployer);

  // Get token addresses
  const tokens = deploymentData.tokens || {};
  // Add WETH address if not already included
  if (!tokens["WETH"]) {
    tokens["WETH"] =
      network === "zircuit"
        ? process.env.ZIRCUIT_WRAPPED
        : process.env.FLOW_WRAPPED;
  }

  // Test swaps for each pair
  const swapTests = [
    { from: "WBTC", to: "USDT", amount: "0.1" },
    { from: "USDT", to: "WBTC", amount: "2000" },
    { from: "WETH", to: "USDT", amount: "1" },
    { from: "USDT", to: "WETH", amount: "1500" },
    { from: "WSOL", to: "USDT", amount: "10" },
    { from: "USDT", to: "WSOL", amount: "500" },
  ];

  // Perform swaps
  for (const swap of swapTests) {
    const fromAddress = tokens[swap.from];
    const toAddress = tokens[swap.to];

    if (!fromAddress || !toAddress) {
      console.error(`Missing address for ${swap.from} or ${swap.to}`);
      continue;
    }

    console.log(`\nTesting swap: ${swap.amount} ${swap.from} -> ${swap.to}`);

    try {
      // Get token contracts
      const fromToken = new ethers.Contract(fromAddress, erc20Abi, deployer);
      const toToken = new ethers.Contract(toAddress, erc20Abi, deployer);

      // Get decimals
      const fromDecimals = await fromToken.decimals();
      const toDecimals = await toToken.decimals();

      // Calculate input amount
      const amountIn = ethers.parseUnits(swap.amount, fromDecimals);

      // Check balance
      const fromBalance = await fromToken.balanceOf(deployer.address);

      console.log(
        `${swap.from} balance: ${ethers.formatUnits(fromBalance, fromDecimals)}`
      );

      if (fromBalance < amountIn) {
        console.error(
          `Insufficient ${swap.from} balance. Have ${ethers.formatUnits(
            fromBalance,
            fromDecimals
          )}, need ${swap.amount}`
        );
        continue;
      }

      // Get expected output amount
      console.log("Getting expected output amount...");
      const path = [fromAddress, toAddress];
      const amounts = await router.getAmountsOut(amountIn, path);
      const expectedOut = amounts[1];

      console.log(
        `Expected output: ${ethers.formatUnits(expectedOut, toDecimals)} ${
          swap.to
        }`
      );

      // Get initial balance of destination token
      const initialToBalance = await toToken.balanceOf(deployer.address);

      // Approve router to spend tokens if needed
      const allowance = await fromToken.allowance(
        deployer.address,
        routerAddress
      );

      if (allowance < amountIn) {
        console.log(`Approving ${swap.from} for router...`);
        const approveTx = await fromToken.approve(routerAddress, amountIn);
        await approveTx.wait();
        console.log(`${swap.from} approved for router`);
      } else {
        console.log(`${swap.from} already approved for router`);
      }

      // Execute swap
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      console.log(`Executing swap...`);
      const swapTx = await router.swapExactTokensForTokens(
        amountIn,
        0, // amountOutMin - accept any amount for testing
        path,
        deployer.address,
        deadline
      );

      console.log(`Transaction hash: ${swapTx.hash}`);
      await swapTx.wait();

      // Get final balance
      const finalToBalance = await toToken.balanceOf(deployer.address);
      const received = finalToBalance - initialToBalance;

      console.log(
        `Swap complete! Received: ${ethers.formatUnits(received, toDecimals)} ${
          swap.to
        }`
      );
    } catch (error) {
      console.error(`Error swapping ${swap.from} to ${swap.to}:`, error);
    }
  }

  console.log("\nAll swap tests completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
