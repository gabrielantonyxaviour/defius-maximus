const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Get network-specific configuration
  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  // Determine the correct WETH address based on the network
  let wrappedTokenAddress;
  let factoryAddress;
  let routerAddress;

  if (network === "zircuit") {
    wrappedTokenAddress = process.env.ZIRCUIT_WRAPPED;
    factoryAddress = process.env.ZIRCUIT_FACTORY_ADDRESS;
    routerAddress = process.env.ZIRCUIT_ROUTER_ADDRESS;
  } else if (network === "flowEvm") {
    wrappedTokenAddress = process.env.FLOW_WRAPPED;
    factoryAddress = process.env.FLOW_FACTORY_ADDRESS;
    routerAddress = process.env.FLOW_ROUTER_ADDRESS;
  } else {
    throw new Error(`Unsupported network: ${network}`);
  }

  if (!wrappedTokenAddress || !factoryAddress || !routerAddress) {
    throw new Error(
      `Missing configuration for ${network}. Please check your .env file.`
    );
  }

  console.log(`Using existing wrapped token at: ${wrappedTokenAddress}`);
  console.log(`Using UniswapV2 Factory at: ${factoryAddress}`);
  console.log(`Using UniswapV2 Router at: ${routerAddress}`);

  // Deploy TokenFactory
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(deployer.address);

  await tokenFactory.waitForDeployment();
  const tokenFactoryAddress = await tokenFactory.getAddress();

  console.log("TokenFactory deployed to:", tokenFactoryAddress);

  // Save deployment information
  const deploymentData = {
    network: network,
    tokenFactory: tokenFactoryAddress,
    weth: wrappedTokenAddress,
    router: routerAddress,
    factory: factoryAddress,
    deployer: deployer.address,
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${network}-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  // Verify TokenFactory contract
  console.log("Waiting for block confirmations...");
  await tokenFactory.deploymentTransaction().wait(5);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
