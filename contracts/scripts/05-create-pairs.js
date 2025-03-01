const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Creating trading pairs with account:", deployer.address);
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

  // Get factory address based on network
  let factoryAddress;
  if (network === "zircuit") {
    factoryAddress = process.env.ZIRCUIT_FACTORY_ADDRESS;
  } else if (network === "flowEvm") {
    factoryAddress = process.env.FLOW_FACTORY_ADDRESS;
  } else {
    throw new Error(`Unsupported network: ${network}`);
  }

  if (!factoryAddress) {
    throw new Error(
      `Missing factory address for ${network}. Please check your .env file.`
    );
  }

  console.log("Using UniswapV2 Factory:", factoryAddress);

  // UniswapV2 Factory interface
  const factoryAbi = [
    "function createPair(address tokenA, address tokenB) external returns (address pair)",
    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
  ];

  // Get the factory contract
  const factory = new ethers.Contract(factoryAddress, factoryAbi, deployer);

  // Get token addresses
  const tokens = deploymentData.tokens || {};
  // Add WETH address if not already included
  if (!tokens["WETH"]) {
    tokens["WETH"] =
      network === "zircuit"
        ? process.env.ZIRCUIT_WRAPPED
        : process.env.FLOW_WRAPPED;
  }

  console.log("Available tokens:", Object.keys(tokens));

  // Tokens to create pairs with
  const tokenPairs = [
    { tokenA: "WBTC", tokenB: "USDT" },
    { tokenA: "WETH", tokenB: "USDT" },
    { tokenA: "WSOL", tokenB: "USDT" },
  ];

  // Create pairs
  const createdPairs = {};

  for (const pair of tokenPairs) {
    const tokenAAddress = tokens[pair.tokenA];
    const tokenBAddress = tokens[pair.tokenB];

    if (!tokenAAddress || !tokenBAddress) {
      console.error(`Missing address for ${pair.tokenA} or ${pair.tokenB}`);
      continue;
    }

    console.log(`Creating pair for ${pair.tokenA}-${pair.tokenB}...`);
    console.log(`Token A (${pair.tokenA}): ${tokenAAddress}`);
    console.log(`Token B (${pair.tokenB}): ${tokenBAddress}`);

    // Check if pair already exists
    try {
      const existingPair = await factory.getPair(tokenAAddress, tokenBAddress);

      if (existingPair !== ethers.ZeroAddress) {
        console.log(
          `Pair ${pair.tokenA}-${pair.tokenB} already exists at: ${existingPair}`
        );
        createdPairs[`${pair.tokenA}-${pair.tokenB}`] = existingPair;
        continue;
      }

      // Create new pair
      console.log(`Creating new pair for ${pair.tokenA}-${pair.tokenB}...`);
      const tx = await factory.createPair(tokenAAddress, tokenBAddress);
      console.log(`Transaction hash: ${tx.hash}`);

      await tx.wait();
      console.log(`Pair creation transaction confirmed`);

      // Get the new pair address
      const newPairAddress = await factory.getPair(
        tokenAAddress,
        tokenBAddress
      );
      console.log(
        `Pair ${pair.tokenA}-${pair.tokenB} created at: ${newPairAddress}`
      );

      createdPairs[`${pair.tokenA}-${pair.tokenB}`] = newPairAddress;
    } catch (error) {
      console.error(
        `Error creating pair ${pair.tokenA}-${pair.tokenB}:`,
        error
      );
    }
  }

  // Save pair addresses to deployment data
  if (!deploymentData.pairs) {
    deploymentData.pairs = {};
  }

  Object.assign(deploymentData.pairs, createdPairs);

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));

  console.log("Pair creation complete");
  console.log("Created pairs:", Object.keys(createdPairs));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
