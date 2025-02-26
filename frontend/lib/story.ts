import { MintIpInputParams } from "@/types";
import {
  CreateNFTCollectionResponse,
  RegisterIpResponse,
  StoryClient,
  StoryConfig,
} from "@story-protocol/core-sdk";
import {
  createWalletClient,
  custom,
  Hex,
  http,
  toHex,
  WalletClient,
  zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { storyAeneid } from "viem/chains";

export async function setupStoryClient(
  wallet: WalletClient
): Promise<StoryClient> {
  // const wallet = createWalletClient({
  //   chain: storyAeneid,
  //   transport: http("https://aeneid.storyrpc.io"),
  //   account: privateKeyToAccount(
  //     process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`
  //   ),
  // });
  const config = {
    wallet: wallet as WalletClient,
    transport: custom(wallet!.transport),
    chainId: "1315" as any,
  };
  const client = StoryClient.newClientUseWallet(config);
  return client;
}

export async function createSpgNftCollection(
  client: StoryClient,
  name: string,
  symbol: string,
  owner: string
): Promise<CreateNFTCollectionResponse> {
  const response = await client.nftClient.createNFTCollection({
    name: name,
    symbol: symbol,
    isPublicMinting: true,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI: "",
    owner: owner as Hex,
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
