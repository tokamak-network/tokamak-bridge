"use client";
import { ChakraProvidersForNextJs } from "@/providers/chakraProvider";
import "css/scrollbar.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apollo";
import TxToast from "@/components/modal/TxToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/client/queryClient";
import Script from "next/script";
import Header from "@/components/header/Index";
import { Center, Flex, useMediaQuery } from "@chakra-ui/react";
import Modals from "./Modals";
import Drawers from "./Drawers";
import useMediaView from "@/hooks/mediaView/useMediaView";
import MobileView from "@/app/Mobile";
import Footer from "@/components/footer";

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
        src="https://www.googletagmanager.com/gtag/js?id=G-WBYF8R92QK"
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
    const { pcView, minorView } = useMediaView();
    if (minorView) {
        return (
            <Center h={"100vh"}>
                <MobileView />
            </Center>
        );
    }
    return (
    <>
        <GoogleAnalyticsScript />
        <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
        <ChakraProvidersForNextJs>        
        <>
            <Header />
                <Center h={"100vh"}>
                    {children}
                </Center>
            {pcView && <Footer />}
            <GlobalComponents />
            <Drawers />
            <Modals />
        </>
        </ChakraProvidersForNextJs>
        </ApolloProvider>
        </QueryClientProvider>
    </>
    );
}
