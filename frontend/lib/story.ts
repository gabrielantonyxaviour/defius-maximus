import { MintDerivativeIpInputParams, MintIpInputParams } from "@/types";
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
  toHex,
  WalletClient,
  zeroAddress,
} from "viem";
import { IS_TESTNET } from "./constants";

export async function setupStoryClient(
  wallet: WalletClient
): Promise<StoryClient> {
  const config = {
    wallet: wallet as WalletClient,
    transport: custom(wallet!.transport),
    chainId: (IS_TESTNET ? "1315" : "1514") as any,
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
): Promise<CreateNFTCollectionResponse> {
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

  return response;
}

export async function mintAndRegisterDerivativeIp(
  client: StoryClient,
  params: MintIpInputParams
): Promise<RegisterIpResponse> {
  const response = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
    spgNftContract: params.nftAddress,
    allowDuplicates: true,
    derivData: {
      parentIpIds: ["0xf78938029dF78D307D4288BC6B11B7385F8f98d9"], // IP of Defius Maximus
      licenseTermsIds: ["3"],
      maxMintingFee: BigInt("0"), // disabled
      maxRts: 100_000_000, // default
      maxRevenueShare: 100, // default
    },
    ipMetadata: params.ipMetadata,
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
  console.log(
    `View on the explorer: https://${
      IS_TESTNET ? "aeneid." : ""
    }explorer.story.foundation/ipa/${response.ipId}`
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
