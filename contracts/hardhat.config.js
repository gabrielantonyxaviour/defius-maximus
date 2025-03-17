require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load environment variables
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000000";

// Zircuit Testnet
const ZIRCUIT_RPC_URL = "https://zircuit1-testnet.p2pify.com";
const ZIRCUIT_API_KEY = process.env.ZIRCUIT_API_KEY || "";
const ZIRCUIT_FACTORY_ADDRESS = process.env.ZIRCUIT_FACTORY_ADDRESS;
const ZIRCUIT_ROUTER_ADDRESS = process.env.ZIRCUIT_ROUTER_ADDRESS;
const ZIRCUIT_WRAPPED = process.env.ZIRCUIT_WRAPPED;

// Flow EVM Testnet
const FLOW_EVM_RPC_URL =
  "https://flow-testnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY;
const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_FACTORY_ADDRESS = process.env.FLOW_FACTORY_ADDRESS;
const FLOW_ROUTER_ADDRESS = process.env.FLOW_ROUTER_ADDRESS;
const FLOW_WRAPPED = process.env.FLOW_WRAPPED;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    zircuit: {
      url: ZIRCUIT_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 48899, // Update with actual Zircuit Testnet chainId if different
      gasPrice: 1000000000, // 1 gwei - adjust based on network
    },
    flowEvm: {
      url: FLOW_EVM_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 545, // Update with actual Flow EVM Testnet chainId if different
      gasPrice: 1000000000, // 1 gwei - adjust based on network
    },
    story: {
      url: "https://mainnet.storyrpc.io",
      accounts: [MAINNET_PRIVATE_KEY],
      chainId: 1514,
    },
  },
  etherscan: {
    apiKey: {
      story: "TESTINGS",
    },
    customChains: [
      {
        network: "story",
        chainId: 1514,
        urls: {
          apiURL: "https://www.storyscan.xyz/api",
          browserURL: "https://www.storyscan.xyz",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
