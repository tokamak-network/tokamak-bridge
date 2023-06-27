import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import Modals from "../Modals";
import { Details } from "./Details";
import { createContext } from "react";
import { useSmartRouter } from "@/hooks/uniswap/useSmartRouter";

export default function BridgeSwap() {
  const d = useSmartRouter();
  return (
    <Flex flexDir={"column"} w={"496px"} h={"100%"}>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"100%"}
        h={"100%"}
      >
        <Swap />
        <Details />
      </Flex>
      <Modals />
    </Flex>
  );
}
