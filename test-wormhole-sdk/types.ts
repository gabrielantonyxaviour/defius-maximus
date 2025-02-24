import type {
  Network,
  Platform,
  ProtocolName,
  ChainConfigOverrides,
  ChainContext,
  NativeAddressCtr,
  PlatformToChains,
  PlatformUtils,
  RpcConnection,
  Signer,
} from "@wormhole-foundation/sdk-connect";

export interface PlatformDefinition<P extends Platform> {
  /** Platform implements PlatformUtils and can be used as a constructor to create a configured PlatformContext */
  Platform: PlatformUtils<P>;
  /** Address implements the logic to properly parse or format an address for this Platform */
  Address: NativeAddressCtr;
  /** creates a new ChainContext object for a specific Network and Chain */
  getChain: <N extends Network, C extends PlatformToChains<P>>(
    network: N,
    chain: C,
    overrides?: ChainConfigOverrides<N, C>
  ) => ChainContext<N, C, P>;
  /** Provides a local signer that implements the Signer interface for the platform */
  getSigner: (
    rpc: RpcConnection<P>,
    key: string,
    ...args: any
  ) => Promise<Signer>;
  /** A map of ProtocolName => ProtocolLoader for dynamic imports of protocols  */
  protocols: ProtocolLoaders;
}

export type ProtocolLoaders = {
  [key in ProtocolName]?: () => Promise<any>;
};
