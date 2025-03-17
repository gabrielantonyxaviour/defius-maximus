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
  // const newCollection = await client.nftClient.createNFTCollection({
  //   name: "Test NFTs",
  //   symbol: "TEST",
  //   isPublicMinting: true,
  //   mintOpen: true,
  //   mintFeeRecipient: zeroAddress,
  //   contractURI: "",
  //   txOptions: { waitForTransaction: true },
  // });

  // console.log("New collection created:", {
  //   "SPG NFT Contract Address": newCollection.spgNftContract,
  //   "Transaction Hash": newCollection.txHash,
  // });
  // console.log(newCollection.txHash);

  const spgNftContract = "0x942D98Ac9B9c4922A1Bcf9663050Ab602affEe3C";
  const ipMetadata: IpMetadata = {
    title: "Midnight Marriage",
    description: "This is a house-style song generated on suno.",
    createdAt: "1740005219",
    creators: [
      {
        name: "Jacob Tucker",
        address: "0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112",
        contributionPercent: 100,
      },
    ],
    image:
      "https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg",
    imageHash:
      "0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc",
    mediaUrl: "https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3",
    mediaHash:
      "0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee",
    mediaType: "audio/mpeg",
  };
  const nftMetadata = {
    name: "Midnight Marriage",
    description:
      "This is a house-style song generated on suno. This NFT represents ownership of the IP Asset.",
    image:
      "https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg",
    animation_url:
      "https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3",
    attributes: [
      {
        key: "Suno Artist",
        value: "amazedneurofunk956",
      },
      {
        key: "Artist ID",
        value: "4123743b-8ba6-4028-a965-75b79a3ad424",
      },
      {
        key: "Source",
        value: "Suno.com",
      },
    ],
  };

  const ipIpfsHash = await uploadJsonToPinata(ipMetadata);
  const ipHash = createHash("sha256")
    .update(JSON.stringify(ipMetadata))
    .digest("hex");
  const nftIpfsHash = await uploadJsonToPinata(nftMetadata);
  const nftHash = createHash("sha256")
    .update(JSON.stringify(nftMetadata))
    .digest("hex");
  const commercialRemixTerms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E", // RoyaltyPolicyLAP address from https://docs.story.foundation/docs/deployed-smart-contracts
    defaultMintingFee: BigInt("0"),
    expiration: BigInt("0"),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: 50, // can claim 50% of derivative revenue
    commercialRevCeiling: BigInt("0"),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt("0"),
    currency: "0x1514000000000000000000000000000000000000", // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
    uri: "",
  };

  const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
    spgNftContract: spgNftContract,
    licenseTermsData: [
      {
        terms: commercialRemixTerms,
        licensingConfig: {
          isSet: false,
          mintingFee: BigInt("0"),
          licensingHook: zeroAddress,
          hookData: zeroAddress,
          commercialRevShare: 0,
          disabled: false,
          expectMinimumGroupRewardShare: 0,
          expectGroupRewardPool: zeroAddress,
        },
      },
    ],
    ipMetadata: {
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    },
    txOptions: { waitForTransaction: true },
    allowDuplicates: true,
  });

  console.log("Root IPA created:", {
    "Transaction Hash": response.txHash,
    "IPA ID": response.ipId,
  });

  console.log(
    `View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`
  );
};

main();
