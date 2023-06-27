"use client";

import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { Center } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Header from "@/components/header/Index";
import HistoryDrawer from "@/components/history/Drawer";

import "css/scrollbar.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apollo";
import Modals from "./Modals";
import TxToast from "@/components/modal/TxToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/client/queryClient";

const GlobalComponents = () => {
  return (
    <>
      <HistoryDrawer />
      <TxToast />
    </>
  );
};

// export const metadata = {
//   title: "wagmi",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <html lang="en">
      <body style={{ maxHeight: "100vh", margin: 0, padding: 0 }}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <ChakraProvidersForNextJs>
              <RecoilRoot>
                <WagmiProviders>
                  <Header />
                  <Center h={"100vh"}>{children}</Center>
                  <GlobalComponents />
                  <Modals />
                </WagmiProviders>
              </RecoilRoot>
            </ChakraProvidersForNextJs>
          </ApolloProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
