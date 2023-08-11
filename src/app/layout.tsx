"use client";

import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { RecoilRoot } from "recoil";
import HistoryDrawer from "@/components/history/Drawer";
import Head from "next/head";

import "css/scrollbar.css";
import Modals from "./Modals";
import TxToast from "@/components/modal/TxToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/client/queryClient";
import Entry from "./Entry";
import { url } from "inspector";
import { Metadata } from "next";

export const GlobalComponents = () => {
  return (
    <>
      {/* <HistoryDrawer /> */}
      <TxToast />
    </>
  );
};

const metadata: Metadata = {
  title: "Tokamak Bridge",
  description: "https://bridge.tokamak.network",
  viewport: "width=device-width, initial-scale=1.0",
  publisher: "Vercel",
};

export const HeadMeta = () => {
  return (
    <div>
      <Head>
        <title>Tokamak Bridge</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bridge.tokamak.network" />
        <meta property="title" content="Tokamak Bridge" />
        <meta property="og:title" content="Tokamak Bridge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <html lang="en">
      <HeadMeta />
      <body style={{ maxHeight: "100vh", margin: 0, padding: 0 }}>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <ChakraProvidersForNextJs>
              <WagmiProviders>
                <Entry children={children} />
                {/* <Header />
                  <Center h={"100vh"}>{children}</Center>
                  <GlobalComponents />
                  <Modals /> */}
              </WagmiProviders>
            </ChakraProvidersForNextJs>
          </QueryClientProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
