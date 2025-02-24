import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { EnvironmentStoreProvider } from "@/components/context";
import Layout from "@/components/layout";
import WalletProvider from "@/components/providers/wallet-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EnvironmentStoreProvider>
      <html lang="en">
        <body
          style={{
            backgroundImage: "url('/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="select-none"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <WalletProvider>
              <Toaster />
              <Layout>{children}</Layout>
            </WalletProvider>
          </ThemeProvider>
        </body>
      </html>
    </EnvironmentStoreProvider>
  );
}
