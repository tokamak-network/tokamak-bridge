import Header from "@/components/header/Index";
import { Center, Flex, useMediaQuery } from "@chakra-ui/react";
import { GlobalComponents } from "./layout";
import Modals from "./Modals";
import MobileView from "./Mobile";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/apollo";
import Drawers from "./Drawers";
import { useGetMode } from "@/hooks/mode/useGetMode";

export default function Entry({ children }: { children: React.ReactNode }) {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");
  const { mode } = useGetMode();

  if (isMobile) {
    return (
      <Center h={"100vh"}>
        <MobileView />
      </Center>
    );
  }
  // if (isMobile) {
  //   return (
  //     <Center h={"100vh"}>
  //       <MobileView />
  //     </Center>
  //   );
  // }

  return (
    <ApolloProvider client={apolloClient}>
      <Header />
      {mode !== "Pool" ? (
        <Center h={"100vh"}>{children}</Center>
      ) : (
        <Flex h={"100vh"} pt={"140px"} justifyContent={"center"}>
          {children}
        </Flex>
      )}
      <GlobalComponents />
      <Drawers />
      <Modals />
    </ApolloProvider>
  );
}
