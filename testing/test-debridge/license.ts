import { uploadJsonToPinata } from "./pinata";
import { createHash } from "crypto";
import {
  IpMetadata,
  LicenseTerms,
  StoryClient,
  StoryConfig,
} from "@story-protocol/core-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { Hex, http, zeroAddress } from "viem";
import dotenv from "dotenv";
dotenv.config();

const main = async function () {
  const privateKey = process.env.MAINNET_PRIVATE_KEY || "";
  const callerAccount = privateKeyToAccount(privateKey as `0x${string}`);
  const config: StoryConfig = {
    account: callerAccount, // the account object from above
    transport: http("https://evm-rpc-story.j-node.net"),
    chainId: "mainnet",
  };
  const client = StoryClient.newClient(config);

  const response = await client.license.mintLicenseTokens({
    licenseTermsId: "1534",
    licensorIpId: "0x8F7a0fe18D747399E623ca0F92Bd0159148c5776",
    receiver: "0xeE5C50573A8AF1B8Ee2D89CB9eB27dc298c5f75D", // optional. if not provided, it will go to the tx sender
    amount: 2,
    maxMintingFee: BigInt(0), // disabled
    maxRevenueShare: 100, // default
    txOptions: { waitForTransaction: true },
  });
  console.log(response);
};

main();
