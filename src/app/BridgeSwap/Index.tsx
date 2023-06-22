import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import Modals from "../Modals";
import { Details } from "./Details";
import TxToast from "@/components/toast/TxToast";
import { createContext } from "react";

export default function BridgeSwap() {
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
        <TxToast/>
      </Flex>
      <Modals />
    </Flex>
  );
}
