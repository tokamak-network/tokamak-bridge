"use client";

import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { RecoilRoot } from "recoil";

import "css/scrollbar.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apollo";
import TxToast from "@/components/modal/TxToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/client/queryClient";
import Entry from "./Entry";
import Script from "next/script";

//Test Commit for Vercel
//Test build for new uniswap contracts
//Oct 25, 2023

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
      <meta property="og:title" content="Tokamak Bridge" />
      <meta
        name="viewport"
        content="width=device-width,user-scalable=no,initial-scale=1,shrink-to-fit=n"
      />
      <meta
        name="description"
        content="Tokamak Bridge offers a unified bridge and swap experience between Ethereum and Titan Network."
      ></meta>
      <meta
        property="og:description"
        content="Tokamak Bridge offers a unified bridge and swap experience between Ethereum and Titan Network."
      ></meta>
      <meta name="keywords" content="tokamak bridge titan swap pool" />
      <link rel="icon" href="/favicon.ico" />
    </head>
  );
};

const GoogleAnalyticsScript = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-DVJG6CWTNM"
      ></Script>
      <Script>
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DVJG6CWTNM');`}
      </Script>
    </>
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
      <GoogleAnalyticsScript />
      <HeadMeta />
      <body style={{ maxHeight: "100vh", margin: 0, padding: 0 }}>
        <RecoilRoot>
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
