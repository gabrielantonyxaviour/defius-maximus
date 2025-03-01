const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Minting additional tokens with the account:", deployer.address);

  // Load deployment data
  const network = hre.network.name;
  const deploymentPath = path.join(
    __dirname,
    "../deployments",
    `${network}-deployment.json`
  );
  const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const tokens = deploymentData.tokens;

  // Token ABI for minting
  const tokenAbi = [
    "function mint(address to, uint256 amount) public",
    "function decimals() public view returns (uint8)",
    "function balanceOf(address account) public view returns (uint256)",
  ];

  // Mint additional tokens
  for (const [symbol, address] of Object.entries(tokens)) {
    // Skip WETH since it's the native wrapped token
    // and might not have a standard mint function
    if (symbol === "WETH") {
      console.log(
        `Skipping minting for ${symbol} as it's the native wrapped token`
      );
      continue;
    }

    try {
      const token = await ethers.getContractAt("TestToken", address);

      // Get token decimals
      const decimals = await token.decimals();

      let mintAmount;
      if (symbol === "WBTC") {
        mintAmount = ethers.parseUnits("10", decimals); // Mint 10 more WBTC
      } else if (symbol === "WETH") {
        mintAmount = ethers.parseUnits("100", decimals); // Mint 100 more WETH
      } else if (symbol === "WSOL") {
        mintAmount = ethers.parseUnits("1000", decimals); // Mint 1000 more WSOL
      } else if (symbol === "USDT") {
        mintAmount = ethers.parseUnits("1000000", decimals); // Mint 1,000,000 more USDT
      }

      console.log(
        `Minting ${ethers.formatUnits(mintAmount, decimals)} ${symbol} to ${
          deployer.address
        }`
      );

      // Mint tokens
      const tx = await token.mint(deployer.address, mintAmount);
      await tx.wait();

      // Check new balance
      const balance = await token.balanceOf(deployer.address);
      console.log(
        `New ${symbol} balance: ${ethers.formatUnits(balance, decimals)}`
      );
    } catch (error) {
      console.error(`Error minting ${symbol}:`, error);
    }
  }

  console.log("Token minting complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
