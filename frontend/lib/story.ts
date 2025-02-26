import { MintIpInputParams } from "@/types";
import {
  CreateNFTCollectionResponse,
  RegisterIpResponse,
  StoryClient,
  StoryConfig,
} from "@story-protocol/core-sdk";
import { createWalletClient, custom, http, toHex, zeroAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { storyAeneid } from "viem/chains";

export async function setupStoryClient(): Promise<StoryClient> {
  const wallet = createWalletClient({
    chain: storyAeneid,
    transport: http("https://aeneid.storyrpc.io"),
    account: privateKeyToAccount(
      process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`
    ),
  });
  const config: StoryConfig = {
    account: wallet.account,
    transport: custom(wallet!.transport),
    chainId: "aeneid",
  };
  const client = StoryClient.newClient(config);
  return client;
}

export async function createSpgNftCollection(
  client: StoryClient,
  name: string,
  symbol: string
): Promise<CreateNFTCollectionResponse> {
  const response = await client.nftClient.createNFTCollection({
    name: "Test SPG NFT Collection",
    symbol: "TST",
    isPublicMinting: false,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI: "",
    txOptions: { waitForTransaction: true },
  });
  console.log(
    `SPG NFT Collection created at tx hash ${response.txHash}, contract address: ${response.spgNftContract}`
  );

  return response;
}

export async function mintAndRegisterIp(
  client: StoryClient,
  params: MintIpInputParams
): Promise<RegisterIpResponse> {
  const response = await client.ipAsset.mintAndRegisterIp({
    spgNftContract: params.nftAddress,
    allowDuplicates: true,
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
