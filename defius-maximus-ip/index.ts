import {
  CreateNFTCollectionResponse,
  LicenseTerms,
  RegisterIpResponse,
  StoryClient,
  StoryConfig,
} from "@story-protocol/core-sdk";
import {
  createWalletClient,
  custom,
  Hex,
  http,
  WalletClient,
  zeroAddress,
  zeroHash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { story } from "viem/chains";
import { createHash } from "crypto";

export async function setupStoryClient(
  wallet: WalletClient
): Promise<StoryClient> {
  const config = {
    wallet: wallet,
    transport: custom(wallet!.transport),
    chainId: "1514" as any,
  };
  const client = StoryClient.newClientUseWallet(config);
  return client;
}

export async function createSpgNftCollection(
  client: StoryClient,
  name: string,
  symbol: string,
  contractURI: string,
  owner: string
): Promise<string> {
  const response = await client.nftClient.createNFTCollection({
    name: name,
    symbol: symbol,
    isPublicMinting: true,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI,
    owner: owner as Hex,
    txOptions: { waitForTransaction: true },
  });
  console.log(
    `SPG NFT Collection created at tx hash ${response.txHash}, contract address: ${response.spgNftContract}`
  );

  return response.spgNftContract || "";
}

export type IPMetadata = {
  ipMetadataUri: string;
  ipMetadataHash: Hex;
  nftMetadataURI: string;
  nftMetadataHash: Hex;
};

type MintIpInputParams = {
  nftAddress: `0x${string}`;
  ipMetadata: IPMetadata;
};

export function createCommercialRemixTerms(terms: {
  commercialRevShare: number;
  defaultMintingFee: number;
}): LicenseTerms {
  return {
    transferable: true,
    royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
    defaultMintingFee: BigInt(terms.defaultMintingFee),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: terms.commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: "0x1514000000000000000000000000000000000000",
    uri: "",
  };
}

async function mintAndRegisterIp(
  client: StoryClient,
  params: MintIpInputParams
): Promise<RegisterIpResponse> {
  const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
    spgNftContract: params.nftAddress,
    allowDuplicates: true,
    licenseTermsData: [
      {
        terms: createCommercialRemixTerms({
          commercialRevShare: 5,
          defaultMintingFee: 0,
        }),
        licensingConfig: {
          isSet: false,
          mintingFee: BigInt(0),
          licensingHook: zeroAddress,
          hookData: zeroHash,
          commercialRevShare: 0,
          disabled: false,
          expectMinimumGroupRewardShare: 0,
          expectGroupRewardPool: zeroAddress,
        },
      },
    ],
    ipMetadata: params.ipMetadata,
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
  console.log(
    `View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`
  );
  return response;
}

async function main() {
  const account = privateKeyToAccount(
    process.env.MAINNET_PRIVATE_KEY as `0x${string}`
  );
  console.log(account.address);
  const wallet = createWalletClient({
    chain: story,
    transport: http("https://mainnet.storyrpc.io"),
    account: account,
  });
  const client = await setupStoryClient(wallet);

  //   const nftAddress = await createSpgNftCollection(
  //     client,
  //     "Defius Maximus",
  //     "DMX",
  //     "",
  //     account.address
  //   );

  const nftAddress = "0xDe2832A5EA36014a339D37AAa187204FB3c403cC";

  const ipMetadataUri =
    "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/bafkreigja7h7lj6xd7rocyo52k3ru3p6b5hkcuhhnigwmsi6rljjevh3ma?pinataGatewayToken=CUMCxB7dqGB8wEEQqGSGd9u1edmJpWmR9b0Oiuewyt5gs633nKmTogRoKZMrG4Vk";
  const nftMetadataUri =
    "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/bafkreigjr2vvm3gqwozufzcamlwfvsmaipiy2dmbwxt52dvuqhx7ompesm?pinataGatewayToken=CUMCxB7dqGB8wEEQqGSGd9u1edmJpWmR9b0Oiuewyt5gs633nKmTogRoKZMrG4Vk";

  const ipMetadata = {
    title: "Defius Maximus Agent",
    description:
      "A personalised leverage trading agent that increases your win rate with AI.",
    image:
      "https://pbs.twimg.com/profile_images/1893269519977848834/loEs9o9G_400x400.jpg",
    imageHash:
      "0x7ae7b2ee644897adfa5f01fb0647a08050816d440e9d670f038fa1f7a3690a22",
    mediaUrl:
      "https://pbs.twimg.com/profile_images/1893269519977848834/loEs9o9G_400x400.jpg",
    mediaHash:
      "0x7ae7b2ee644897adfa5f01fb0647a08050816d440e9d670f038fa1f7a3690a22",
    mediaType: "image/png",
    creators: [
      {
        name: "Gabriel Antony Xaviour",
        address: "0xeE5C50573A8AF1B8Ee2D89CB9eB27dc298c5f75D",
        description: "Founder of Defius Maximus",
        contributionPercent: 100,
        socialMedia: [
          {
            platform: "Twitter",
            url: "http://x.com/gabrielaxyeth",
          },
        ],
      },
    ],
  };

  const nftMetadata = {
    name: "Defius Maximus",
    description:
      "A personalised leverage trading agent that increases your win rate with AI.",
    image:
      "https://pbs.twimg.com/profile_images/1893269519977848834/loEs9o9G_400x400.jpg",
    external_url: "https://x.com/defiusmaximus",
    attributes: [
      {
        trait_type: "Creator",
        value: "Gabriel Antony Xaviour",
      },
      {
        trait_type: "Creator Address",
        value: "0xeE5C50573A8AF1B8Ee2D89CB9eB27dc298c5f75D",
      },
      {
        trait_type: "Creator X",
        value: "http://x.com/gabrielaxyeth",
      },
    ],
  };
  const ipMetadataHash =
    "0x" +
    createHash("sha256").update(JSON.stringify(ipMetadata)).digest("hex");
  const nftMetadataHash =
    "0x" +
    createHash("sha256").update(JSON.stringify(nftMetadata)).digest("hex");
  await mintAndRegisterIp(client, {
    nftAddress,
    ipMetadata: {
      ipMetadataHash: ipMetadataHash as Hex,
      ipMetadataUri: ipMetadataUri,
      nftMetadataHash: nftMetadataHash as Hex,
      nftMetadataURI: nftMetadataUri,
    },
  });
}

main();
