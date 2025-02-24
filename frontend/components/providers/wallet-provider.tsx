"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';


const { provider, chains } = configureChains(
  [avalancheFuji],
  [publicProvider()]
);

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
  ],
  provider,
});

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);


export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <StytchProvider stytch={stytch}>
      <WagmiConfig client={client}>
        {children}
      </WagmiConfig>
    </StytchProvider>
  );
}
