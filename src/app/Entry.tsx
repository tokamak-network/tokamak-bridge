import Header from "@/components/header/Index";
import { Center, Flex, useMediaQuery } from "@chakra-ui/react";
import { GlobalComponents } from "./layout";
import Modals from "./Modals";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apollo";
import Drawers from "./Drawers";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useMediaView from "@/hooks/mediaView/useMediaView";
import MobileView from "@/app/Mobile";
import Footer from "@/components/footer";

export default function Entry({ children }: { children: React.ReactNode }) {
  const { mode } = useGetMode();
  const { pcView, minorView } = useMediaView();

  if (minorView) {
    return (
      <Center h={"100vh"}>
        <MobileView />
      </Center>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Header />
      {mode !== "Pool" ? (
        <Center h={window.innerHeight}>{children}</Center>
      ) : (
        <Flex
          h={"100vh"}
          pt={{ base: "32px", lg: "140px" }}
          justifyContent={"center"}
        >
          {children}
        </Flex>
      )}
      {pcView && <Footer />}
      <GlobalComponents />
      <Drawers />
      <Modals />
    </ApolloProvider>
  );
}
