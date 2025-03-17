const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying DebridgeRoyaltyRelayer with the account:",
    deployer.address
  );
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  const DebridgeRoyaltyRelayer = await ethers.getContractFactory(
    "DebridgeRoyaltyRelayer"
  );
  const debridgeRoyaltyRelayer = await DebridgeRoyaltyRelayer.deploy();

  await debridgeRoyaltyRelayer.waitForDeployment();
  const debridgeRoyaltyRelayerAddress =
    await debridgeRoyaltyRelayer.getAddress();

  console.log(
    "DebridgeRoyaltyRelayer deployed to:",
    debridgeRoyaltyRelayerAddress
  );

  // Save deployment information
  const deploymentData = {
    network: network,
    relayer: debridgeRoyaltyRelayer,
  };

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${network}-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  // Verify DebridgeRoyaltyRelayer contract
  console.log("Waiting for block confirmations...");
  await debridgeRoyaltyRelayer.deploymentTransaction().wait(5);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
