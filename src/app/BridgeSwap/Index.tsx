import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import TransactionDetail from "./TransactionDetail";
import {
  SelectCardButton,
  SelectCardModal,
} from "@/components/card/SelectCard";

export default function BridgeSwap() {
  return (
    <Flex flexDir={"column"}>
      <Swap />
      <TransactionDetail />
      <SelectCardButton />
      <SelectCardModal />
    </Flex>
  );
}
