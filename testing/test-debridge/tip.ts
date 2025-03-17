import { uploadJsonToPinata } from "./pinata";
import { createHash } from "crypto";
import {
  IpMetadata,
  LicenseTerms,
  StoryClient,
  StoryConfig,
  WIP_TOKEN_ADDRESS,
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

  const payRoyalty = await client.royalty.payRoyaltyOnBehalf({
    receiverIpId: "0x8F7a0fe18D747399E623ca0F92Bd0159148c5776", // the ip you're paying
    payerIpId: zeroAddress,
    token: WIP_TOKEN_ADDRESS,
    amount: 2,
    txOptions: { encodedTxDataOnly: true },
  });
  console.log(payRoyalty.encodedTxData);
};

main();
