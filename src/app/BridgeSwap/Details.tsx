import { Flex } from "@chakra-ui/react";
import Warning from "./Warning";
import { useGetMode } from "@/hooks/mode/useGetMode";
import TransactionDetail from "./TransactionDetail";
import { useApprove } from "@/hooks/token/useApproval";
import ActionButton from "./components/ActionButton";
import ApproveToken from "@/app/BridgeSwap/ApproveToken";

export function Details() {
  const { mode } = useGetMode();

  return (
    <Flex flexDir={"column"} w={"100%"} mt={"24px"} rowGap={"10px"}>
      {mode !== null && (
        <Flex w={"100%"} flexDir={"column"} rowGap={"10px"}>
          <Warning />
          <TransactionDetail />
          <ApproveToken />
        </Flex>
      )}
      <ActionButton />
    </Flex>
  );
}
