"use client";

import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { Center } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Header from "@/components/header/Index";
import HistoryDrawer from "@/components/history/Drawer";
import Head from "next/head";

import "css/scrollbar.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apollo";
import Modals from "./Modals";
import TxToast from "@/components/modal/TxToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/client/queryClient";
import Entry from "./Entry";

export const GlobalComponents = () => {
  return (
    <>
      {/* <HistoryDrawer /> */}
      <TxToast />
    </>
  );
};

const HeadMeta = () => {
  return (
    <div>
      <Head>
        <title>Tokamak Bridge</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bridge.tokamak.network" />
        <meta property="title" content="Tokamak Bridge" />
        <meta property="og:title" content="Tokamak Bridge" />
        {/* <meta
        property="description"
        content="Functional upgrade to TONStarter ecosystem"
      />
      <meta
        property="og:description"
        content="Functional upgrade to TONStarter ecosystem"
      /> */}
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
      <body style={{ maxHeight: "100vh", margin: 0, padding: 0 }}>
        <RecoilRoot>
          <HeadMeta />
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
              <ChakraProvidersForNextJs>
                <WagmiProviders>
                  <Entry children={children} />
                  {/* <Header />
                  <Center h={"100vh"}>{children}</Center>
                  <GlobalComponents />
                  <Modals /> */}
                </WagmiProviders>
              </ChakraProvidersForNextJs>
            </ApolloProvider>
          </QueryClientProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
