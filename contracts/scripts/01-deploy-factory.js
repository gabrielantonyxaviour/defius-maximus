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

  // Deploy TokenFactory
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(deployer.address);

  await tokenFactory.waitForDeployment();
  const tokenFactoryAddress = await tokenFactory.getAddress();

  console.log("TokenFactory deployed to:", tokenFactoryAddress);

  // Deploy WETH
  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();
  await weth.waitForDeployment();
  const wethAddress = await weth.getAddress();

  console.log("WETH deployed to:", wethAddress);

  // Save deployment information
  const deploymentData = {
    network: hre.network.name,
    tokenFactory: tokenFactoryAddress,
    weth: wethAddress,
    deployer: deployer.address,
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${hre.network.name}-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  // Verify contracts on etherscan
  console.log("Waiting for block confirmations...");
  await tokenFactory.deploymentTransaction().wait(5);
  await weth.deploymentTransaction().wait(5);

  console.log("Verifying TokenFactory...");
  try {
    await hre.run("verify:verify", {
      address: tokenFactoryAddress,
      constructorArguments: [deployer.address],
    });
  } catch (error) {
    console.error("TokenFactory verification failed:", error);
  }

  console.log("Verifying WETH...");
  try {
    await hre.run("verify:verify", {
      address: wethAddress,
      constructorArguments: [],
    });
  } catch (error) {
    console.error("WETH verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
