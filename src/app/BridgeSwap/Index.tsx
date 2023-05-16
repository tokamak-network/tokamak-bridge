import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import TransactionDetail from "./TransactionDetail";
import {
  SelectCardButton,
  SelectCardModal,
} from "@/components/card/SelectCard";

export default function BridgeSwap() {
  return (
    <Flex flexDir={"column"} h={"100%"}>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        h={"100%"}
      >
        <Swap />
        <TransactionDetail />
      </Flex>
      <Flex mt={"auto"}>
        <SelectCardButton />
      </Flex>
      <SelectCardModal />
    </Flex>
  );
}
