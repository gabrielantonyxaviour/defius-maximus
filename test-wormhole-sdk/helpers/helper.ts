import type {
  Chain,
  ChainAddress,
  ChainContext,
  Network,
  PlatformDefinition,
  Signer,
  TxHash,
} from "@wormhole-foundation/sdk";
import {
  DEFAULT_TASK_TIMEOUT,
  TokenTransfer,
  TransferState,
  Wormhole,
  amount,
  api,
  tasks,
} from "@wormhole-foundation/sdk";

import { applyChainsConfigConfigOverrides } from "@wormhole-foundation/sdk-connect";
import * as _evm from "@wormhole-foundation/sdk-evm";

const evm: PlatformDefinition<typeof _evm._platform> = {
  Address: _evm.EvmAddress,
  Platform: _evm.EvmPlatform,
  getSigner: _evm.getEvmSigner,
  protocols: {
    WormholeCore: () => import("@wormhole-foundation/sdk-evm-core"),
    TokenBridge: () => import("@wormhole-foundation/sdk-evm-tokenbridge"),
    PorticoBridge: () => import("@wormhole-foundation/sdk-evm-portico"),
    CircleBridge: () => import("@wormhole-foundation/sdk-evm-cctp"),
  },
  getChain: (network, chain, overrides?) =>
    new _evm.EvmChain(
      chain,
      new _evm.EvmPlatform(
        network,
        applyChainsConfigConfigOverrides(network, _evm._platform, {
          [chain]: overrides,
        })
      )
    ),
};

function getEnv(key: string): string {
  // If we're in the browser, return empty string
  if (typeof process === undefined) return "";

  // Otherwise, return the env var or error
  const val = process.env[key];
  if (!val)
    throw new Error(
      `Missing env var ${key}, did you forget to set values in '.env'?`
    );

  return val;
}

export interface SignerStuff<N extends Network, C extends Chain = Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>
): Promise<SignerStuff<N, C>> {
  // Read in from `.env`
  (await import("dotenv")).config();

  let signer: Signer;
  const platform = chain.platform.utils()._platform;
  switch (platform) {
    // case "Solana":
    //   signer = await solana.getSigner(await chain.getRpc(), getEnv("SOL_PRIVATE_KEY"), {
    //     debug: true,
    //     priorityFee: {
    //       // take the middle priority fee
    //       percentile: 0.5,
    //       // juice the base fee taken from priority fee percentile
    //       percentileMultiple: 2,
    //       // at least 1 lamport/compute unit
    //       min: 1,
    //       // at most 1000 lamport/compute unit
    //       max: 1000,
    //     },
    //   });

    //   break;
    case "Evm":
      signer = await evm.getSigner(
        await chain.getRpc(),
        getEnv("ETH_PRIVATE_KEY"),
        {
          debug: true,
          maxGasLimit: amount.units(amount.parse("0.01", 18)),
          // overrides is a Partial<TransactionRequest>, so any fields can be overriden
          //overrides: {
          //  maxFeePerGas: amount.units(amount.parse("1.5", 9)),
          //  maxPriorityFeePerGas: amount.units(amount.parse("0.1", 9)),
          //},
        }
      );
      break;
    default:
      throw new Error("Unrecognized platform: " + platform);
  }

  return {
    chain,
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}

export async function waitLog<N extends Network = Network>(
  wh: Wormhole<N>,
  xfer: TokenTransfer<N>,
  tag: string = "WaitLog",
  timeout: number = DEFAULT_TASK_TIMEOUT
) {
  const tracker = TokenTransfer.track(
    wh,
    TokenTransfer.getReceipt(xfer),
    timeout
  );
  let receipt;
  for await (receipt of tracker) {
    console.log(
      `${tag}: Current trasfer state: `,
      TransferState[receipt.state]
    );
  }
  return receipt;
}
