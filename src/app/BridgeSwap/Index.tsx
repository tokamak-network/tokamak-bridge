import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import TransactionDetail from "./TransactionDetail";

export default function BridgeSwap() {
  return (
    <Flex>
      <Swap />
      <TransactionDetail />
    </Flex>
  );
}
