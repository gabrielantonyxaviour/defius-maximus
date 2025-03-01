const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Adding liquidity with account:", deployer.address);
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
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  ];

  // ERC20 interface
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function allowance(address owner, address spender) external view returns (uint256)",
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

  // Pairs to add liquidity to
  const tokenPairs = [
    { tokenA: "WBTC", tokenB: "USDT" },
    { tokenA: "WETH", tokenB: "USDT" },
    { tokenA: "WSOL", tokenB: "USDT" },
  ];

  // Add liquidity to pairs
  for (const pair of tokenPairs) {
    const tokenAAddress = tokens[pair.tokenA];
    const tokenBAddress = tokens[pair.tokenB];

    if (!tokenAAddress || !tokenBAddress) {
      console.error(`Missing address for ${pair.tokenA} or ${pair.tokenB}`);
      continue;
    }

    console.log(`\nAdding liquidity for ${pair.tokenA}-${pair.tokenB}...`);

    try {
      // Get token contracts
      const tokenA = new ethers.Contract(tokenAAddress, erc20Abi, deployer);
      const tokenB = new ethers.Contract(tokenBAddress, erc20Abi, deployer);

      // Get decimals
      const decimalsA = await tokenA.decimals();
      const decimalsB = await tokenB.decimals();

      console.log(`${pair.tokenA} decimals: ${decimalsA}`);
      console.log(`${pair.tokenB} decimals: ${decimalsB}`);

      // Set liquidity amounts based on token
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

      console.log(
        `Amount ${pair.tokenA}: ${ethers.formatUnits(amountA, decimalsA)}`
      );
      console.log(
        `Amount ${pair.tokenB}: ${ethers.formatUnits(amountB, decimalsB)}`
      );

      // Check token balances
      const balanceA = await tokenA.balanceOf(deployer.address);
      const balanceB = await tokenB.balanceOf(deployer.address);

      console.log(
        `${pair.tokenA} balance: ${ethers.formatUnits(balanceA, decimalsA)}`
      );
      console.log(
        `${pair.tokenB} balance: ${ethers.formatUnits(balanceB, decimalsB)}`
      );

      if (balanceA < amountA) {
        console.error(
          `Insufficient ${pair.tokenA} balance. Have ${ethers.formatUnits(
            balanceA,
            decimalsA
          )}, need ${ethers.formatUnits(amountA, decimalsA)}`
        );
        continue;
      }

      if (balanceB < amountB) {
        console.error(
          `Insufficient ${pair.tokenB} balance. Have ${ethers.formatUnits(
            balanceB,
            decimalsB
          )}, need ${ethers.formatUnits(amountB, decimalsB)}`
        );
        continue;
      }

      // Check allowances
      const allowanceA = await tokenA.allowance(
        deployer.address,
        routerAddress
      );
      const allowanceB = await tokenB.allowance(
        deployer.address,
        routerAddress
      );

      // Approve tokens for router if needed
      if (allowanceA < amountA) {
        console.log(`Approving ${pair.tokenA} for router...`);
        const approveTxA = await tokenA.approve(routerAddress, amountA);
        await approveTxA.wait();
        console.log(`${pair.tokenA} approved for router`);
      } else {
        console.log(`${pair.tokenA} already approved for router`);
      }

      if (allowanceB < amountB) {
        console.log(`Approving ${pair.tokenB} for router...`);
        const approveTxB = await tokenB.approve(routerAddress, amountB);
        await approveTxB.wait();
        console.log(`${pair.tokenB} approved for router`);
      } else {
        console.log(`${pair.tokenB} already approved for router`);
      }

      // Add liquidity
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      console.log(`Adding liquidity...`);
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

      console.log(`Transaction hash: ${addLiquidityTx.hash}`);
      const receipt = await addLiquidityTx.wait();
      console.log(`Liquidity added for ${pair.tokenA}-${pair.tokenB}`);
    } catch (error) {
      console.error(
        `Error adding liquidity for ${pair.tokenA}-${pair.tokenB}:`,
        error
      );
    }
  }

  console.log("\nLiquidity addition complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
