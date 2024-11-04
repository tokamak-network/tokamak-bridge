"use client";
import { useState, useEffect } from "react";
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

/**
 * Import statements for modal control and view state management
 * These are added to handle the initial loading state and mobile modal behavior @Robert
 */
import { actionMethodStatus } from "@/recoil/modal/atom";
import { useRecoilValue } from "recoil";
import useMediaView from "@/hooks/mediaView/useMediaView";

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
  /**
   * State and hooks for controlling initial page visibility
   * - pageReady: Controls the visibility of main content
   * - mobileView: Checks if user is on mobile device
   * - methodStatus: Tracks the state of the action method modal @Robert
   */
  const [pageReady, setPageReady] = useState(false);
  const { mobileView } = useMediaView();
  const methodStatus = useRecoilValue(actionMethodStatus);

  /**
   * Effect to manage initial page loading behavior
   * - On mobile: Shows content only after modal interaction (methodStatus becomes true)
   * - On desktop: Shows content immediately
   * This prevents unwanted content flashing before modal appears on mobile @Robert
   */
  useEffect(() => {
    if (mobileView) {
      if (methodStatus) {
        setPageReady(true);
      }
    } else {
      setPageReady(true);
    }
  }, [mobileView, methodStatus]);

  const queryClient = getQueryClient();

  return (
    <>
      <GoogleAnalyticsScript />
      <QueryClientProvider client={queryClient}>
        <ChakraProvidersForNextJs>
          <Flex
            flexDir={"column"}
            h={"100vh"}
            style={{
              visibility: pageReady ? "visible" : "hidden",
              opacity: pageReady ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
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
