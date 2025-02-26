import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { EnvironmentStoreProvider } from "@/components/context";
import Layout from "@/components/layout";
import WalletProvider from "@/components/providers/wallet-provider";
import { headers } from "next/headers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");
  return (
    <EnvironmentStoreProvider>
      <html lang="en">
        <body
          style={{
            backgroundColor: "#BF4317",
          }}
          className="select-none"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <WalletProvider cookies={cookies}>
              <Toaster />
              <Layout>{children}</Layout>
            </WalletProvider>
          </ThemeProvider>
        </body>
      </html>
    </EnvironmentStoreProvider>
  );
}
