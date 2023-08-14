"use client";

import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { RecoilRoot } from "recoil";
import HistoryDrawer from "@/components/history/Drawer";

import "css/scrollbar.css";
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

export const HeadMeta = () => {
  return (
    <head>
      <title>Tokamak Bridge</title>
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bridge.tokamak.network" />
      <meta property="title" content="Tokamak Bridge - dev" />
      <meta property="og:title" content="Tokamak Bridge - dev" />
      <meta
        name="viewport"
        content="width=device-width,user-scalable=no,initial-scale=1,shrink-to-fit=n"
      />
      <meta
        name="description"
        content=" Tokamak Bridge offers a unified bridge and swap experience between Ethereum and Titan Network."
      ></meta>
      <meta
        name="og:description"
        content=" Tokamak Bridge offers a unified bridge and swap experience between Ethereum and Titan Network."
      ></meta>
      <link rel="icon" href="/favicon.ico" />
    </head>
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
