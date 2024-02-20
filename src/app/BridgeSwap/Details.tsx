import { Flex, Box } from "@chakra-ui/react";
import Warning from "./Warning";
import { useGetMode } from "@/hooks/mode/useGetMode";
import TransactionDetail from "./TransactionDetail";
import ActionButton from "./components/ActionButton";
import ApproveToken from "@/app/BridgeSwap/ApproveToken";

export function Details() {
  const { mode } = useGetMode();

  return (
    <Flex
      flexDir={"column"}
      justify={{ base: "space-between", lg: "normal" }}
      h={{ base: "100%", lg: "fit-content" }}
      w={"100%"}
      mt={"20px"}
      rowGap={"20px"}
    >
      {mode !== null ? (
        <Flex w={"100%"} flexDir={"column"} rowGap={"10px"}>
          <Warning />
          <TransactionDetail />
          <ApproveToken />
        </Flex>
      ) : (
        <Box />
      )}
      <ActionButton />
    </Flex>
  );
}
