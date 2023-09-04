import Header from "@/components/header/Index";
import { Center, useMediaQuery } from "@chakra-ui/react";
import { GlobalComponents } from "./layout";
import Modals from "./Modals";
import MobileView from "./Mobile";
import { ApolloProvider } from "@apollo/client";
import useConnectedNetwork from "@/hooks/network";
import { apolloClient } from "@/apollo";
import Drawers from "./Drawers";
export default function Entry({ children }: { children: React.ReactNode }) {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");

  const { connectedChainId } = useConnectedNetwork();

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
      <Center h={"100vh"}>{children}</Center>
      <GlobalComponents />
      <Drawers/>
      <Modals />
    </ApolloProvider>
  );
}
