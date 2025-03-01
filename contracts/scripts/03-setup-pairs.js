const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Setting up pairs with the account:", deployer.address);

  // Load deployment data
  const deploymentPath = path.join(
    __dirname,
    "../deployments",
    `${hre.network.name}-deployment.json`
  );
  const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const tokens = deploymentData.tokens;

  // UniswapV2 interfaces
  const factoryAbi = [
    "function createPair(address tokenA, address tokenB) external returns (address pair)",
    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
  ];

  const routerAbi = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  ];

  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
  ];

  // Get factory and router addresses from environment variables or hardcode them
  const factoryAddress = process.env.UNISWAP_FACTORY_ADDRESS || "0x"; // Replace with actual factory address
  const routerAddress = process.env.UNISWAP_ROUTER_ADDRESS || "0x"; // Replace with actual router address

  console.log("Using UniswapV2 Factory:", factoryAddress);
  console.log("Using UniswapV2 Router:", routerAddress);

  // Get contract instances
  const factory = new ethers.Contract(factoryAddress, factoryAbi, deployer);
  const router = new ethers.Contract(routerAddress, routerAbi, deployer);

  // Tokens we want to create pairs with
  const tokenPairs = [
    { tokenA: "WBTC", tokenB: "USDT" },
    { tokenA: "WETH", tokenB: "USDT" },
    { tokenA: "WSOL", tokenB: "USDT" },
  ];

  // Create pairs and add liquidity
  for (const pair of tokenPairs) {
    const tokenAAddress = tokens[pair.tokenA];
    const tokenBAddress = tokens[pair.tokenB];

    if (!tokenAAddress || !tokenBAddress) {
      console.error(`Missing address for ${pair.tokenA} or ${pair.tokenB}`);
      continue;
    }

    const tokenA = new ethers.Contract(tokenAAddress, erc20Abi, deployer);
    const tokenB = new ethers.Contract(tokenBAddress, erc20Abi, deployer);

    // Get decimals
    const decimalsA = await tokenA.decimals();
    const decimalsB = await tokenB.decimals();

    console.log(`Creating pair ${pair.tokenA}-${pair.tokenB}...`);

    // Check if pair already exists
    let pairAddress;
    try {
      pairAddress = await factory.getPair(tokenAAddress, tokenBAddress);

      if (pairAddress !== ethers.ZeroAddress) {
        console.log(
          `Pair ${pair.tokenA}-${pair.tokenB} already exists at ${pairAddress}`
        );
      } else {
        // Create the pair
        const tx = await factory.createPair(tokenAAddress, tokenBAddress);
        await tx.wait();

        // Get the pair address
        pairAddress = await factory.getPair(tokenAAddress, tokenBAddress);
        console.log(
          `Pair ${pair.tokenA}-${pair.tokenB} created at ${pairAddress}`
        );
      }
    } catch (error) {
      console.error(
        `Error creating pair ${pair.tokenA}-${pair.tokenB}:`,
        error
      );
      continue;
    }

    console.log(`Adding liquidity for ${pair.tokenA}-${pair.tokenB}...`);

    try {
      // Determine amounts to add as liquidity
      let amountA, amountB;

      if (pair.tokenA === "WBTC") {
        amountA = ethers.parseUnits("1", decimalsA); // 1 WBTC
        amountB = ethers.parseUnits("20000", decimalsB); // 20,000 USDT
      } else if (pair.tokenA === "WETH") {
        amountA = ethers.parseUnits("10", decimalsA); // 10 WETH
        amountB = ethers.parseUnits("15000", decimalsB); // 15,000 USDT
      } else if (pair.tokenA === "WSOL") {
        amountA = ethers.parseUnits("100", decimalsA); // 100 WSOL
        amountB = ethers.parseUnits("5000", decimalsB); // 5,000 USDT
      }

      // Approve tokens for router
      const approveTxA = await tokenA.approve(routerAddress, amountA);
      await approveTxA.wait();
      console.log(`Approved ${pair.tokenA} for router`);

      const approveTxB = await tokenB.approve(routerAddress, amountB);
      await approveTxB.wait();
      console.log(`Approved ${pair.tokenB} for router`);

      // Add liquidity
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      const addLiquidityTx = await router.addLiquidity(
        tokenAAddress,
        tokenBAddress,
        amountA,
        amountB,
        0, // amountAMin - accept any amount
        0, // amountBMin - accept any amount
        deployer.address,
        deadline
      );

      const receipt = await addLiquidityTx.wait();
      console.log(`Added liquidity for ${pair.tokenA}-${pair.tokenB}`);

      // Save pair address to deployment data
      if (!deploymentData.pairs) {
        deploymentData.pairs = {};
      }

      deploymentData.pairs[`${pair.tokenA}-${pair.tokenB}`] = pairAddress;
    } catch (error) {
      console.error(
        `Error adding liquidity for ${pair.tokenA}-${pair.tokenB}:`,
        error
      );
    }
  }

  // Perform a test swap
  console.log("Performing a test swap (0.1 WBTC -> USDT)...");

  try {
    const wbtcAddress = tokens["WBTC"];
    const usdtAddress = tokens["USDT"];
    const wbtc = new ethers.Contract(wbtcAddress, erc20Abi, deployer);

    // Amount to swap
    const wbtcDecimals = await wbtc.decimals();
    const swapAmount = ethers.parseUnits("0.1", wbtcDecimals);

    // Approve router to spend tokens
    const approveTx = await wbtc.approve(routerAddress, swapAmount);
    await approveTx.wait();

    // Swap tokens
    const path = [wbtcAddress, usdtAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    const swapTx = await router.swapExactTokensForTokens(
      swapAmount,
      0, // amountOutMin - accept any amount
      path,
      deployer.address,
      deadline
    );

    const receipt = await swapTx.wait();
    console.log("Swap completed successfully");
  } catch (error) {
    console.error("Error performing test swap:", error);
  }

  // Save updated deployment data
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));

  console.log("Pair setup complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
