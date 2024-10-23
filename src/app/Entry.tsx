"use client";
import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import "css/scrollbar.css";
import TxToast from "@/components/modal/TxToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/client/queryClient";
import Script from "next/script";
import { Flex } from "@chakra-ui/react";
import Modals from "./Modals";
import Drawers from "./Drawers";
import Footer from "@/components/footer";
import dynamic from "next/dynamic";

const DynamicHeader = dynamic(() => import("@/components/header/Index"), {
  loading: () => <></>,
  ssr: false,
});

/**
 * test domain building commit
 * test.app.bridge.tokamak.network
 * 2024-08-30
 */

const GlobalComponents = () => {
  return (
    <>
      {/* <HistoryDrawer /> */}
      <TxToast />
    </>
  );
};

const GoogleAnalyticsScript = () => {
  return (
    <>
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-WBYF8R92QK'
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

export default function Entry({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <>
      <GoogleAnalyticsScript />
      <QueryClientProvider client={queryClient}>
        <ChakraProvidersForNextJs>
          <Flex flexDir={"column"} h={"100vh"}>
            <DynamicHeader />
            <Flex flexDir={"column"} flexGrow={1}>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                bg={"#0F0F12"}
                h={"100%"}
              >
                {children}
              </Flex>
              <Footer />
            </Flex>
            <GlobalComponents />
            <Drawers />
            <Modals />
          </Flex>
        </ChakraProvidersForNextJs>
      </QueryClientProvider>
    </>
  );
}
