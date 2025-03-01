require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load environment variables
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZIRCUIT_RPC_URL = "https://rpc-testnet.zircuit.com";
const FLOW_EVM_RPC_URL = "https://evm-testnet.flow.org";
// const ZIRCUIT_API_KEY = process.env.ZIRCUIT_API_KEY || "";
// const FLOW_API_KEY = process.env.FLOW_API_KEY || "";

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
      chainId: 42000, // Placeholder - replace with actual Zircuit Testnet chainId
      gasPrice: 1000000000, // 1 gwei - adjust based on network
    },
    flowEvm: {
      url: FLOW_EVM_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 646, // Placeholder - replace with actual Flow EVM Testnet chainId
      gasPrice: 1000000000, // 1 gwei - adjust based on network
    },
  },
  etherscan: {
    // apiKey: {
    //   zircuit: ZIRCUIT_API_KEY,
    //   flowEvm: FLOW_API_KEY,
    // },
    // customChains: [
    //   {
    //     network: "zircuit",
    //     chainId: 42000, // Placeholder - replace with actual Zircuit Testnet chainId
    //     urls: {
    //       apiURL: "https://api.zircuit.com/api",
    //       browserURL: "https://explorer.zircuit.com",
    //     },
    //   },
    //   {
    //     network: "flowEvm",
    //     chainId: 646, // Placeholder - replace with actual Flow EVM Testnet chainId
    //     urls: {
    //       apiURL: "https://evm-explorer.testnet.flow.com/api",
    //       browserURL: "https://evm-explorer.testnet.flow.com",
    //     },
    //   },
    // ],
  },
};
