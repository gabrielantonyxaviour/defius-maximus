const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying tokens with the account:", deployer.address);

  // Load deployment data
  const deploymentPath = path.join(
    __dirname,
    "../deployments",
    `${hre.network.name}-deployment.json`
  );
  const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  // Get token factory contract
  const tokenFactoryAddress = deploymentData.tokenFactory;
  const tokenFactory = await ethers.getContractAt(
    "TokenFactory",
    tokenFactoryAddress
  );

  // Token parameters
  const tokens = [
    { name: "Wrapped BTC", symbol: "WBTC", decimals: 8, initialSupply: 100 }, // 100 WBTC
    { name: "Wrapped SOL", symbol: "WSOL", decimals: 9, initialSupply: 10000 }, // 10,000 WSOL
    {
      name: "USD Tether",
      symbol: "USDT",
      decimals: 6,
      initialSupply: 10000000,
    }, // 10,000,000 USDT
  ];

  const addresses = {};

  // Deploy each token
  for (const token of tokens) {
    console.log(`Creating ${token.name}...`);

    const tx = await tokenFactory.createToken(
      token.name,
      token.symbol,
      token.decimals,
      token.initialSupply
    );

    const receipt = await tx.wait();

    // Find token created event
    const event = receipt.logs
      .filter((log) => log.fragment && log.fragment.name === "TokenCreated")
      .map((log) => tokenFactory.interface.parseLog(log))[0];

    if (!event) {
      throw new Error(`Failed to find TokenCreated event for ${token.symbol}`);
    }

    const tokenAddress = event.args[0];
    addresses[token.symbol] = tokenAddress;

    console.log(`${token.symbol} deployed to:`, tokenAddress);

    // Verify the token contract
    console.log(`Verifying ${token.symbol}...`);
    try {
      await hre.run("verify:verify", {
        address: tokenAddress,
        constructorArguments: [
          token.name,
          token.symbol,
          token.decimals,
          token.initialSupply,
          deployer.address,
        ],
      });
    } catch (error) {
      console.error(`${token.symbol} verification failed:`, error);
    }
  }

  // Get WETH from previous deployment
  addresses["WETH"] = deploymentData.weth;

  // Save token addresses
  deploymentData.tokens = addresses;

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));

  console.log("All tokens deployed and saved to deployment file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
