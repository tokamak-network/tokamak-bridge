import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import TransactionDetail from "./TransactionDetail";
import {
  SelectCardButton,
  SelectCardModal,
} from "@/components/card/SelectCard";
import ActionButton from "./components/ActionButton";

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
        <Flex w={"100%"} mt={"32px"} mb={"12px"}>
          <TransactionDetail />
        </Flex>
        <ActionButton />
      </Flex>
      <Flex mt={"auto"}>
        <SelectCardButton />
      </Flex>
      <SelectCardModal />
    </Flex>
  );
}
