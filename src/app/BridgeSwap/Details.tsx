import { Flex, Box } from "@chakra-ui/react";
import Warning from "./Warning";
import { useGetMode } from "@/hooks/mode/useGetMode";
import TransactionDetail from "./TransactionDetail";
import ActionButton from "./components/ActionButton";
import ApproveToken from "@/app/BridgeSwap/ApproveToken";
import useMediaView from "@/hooks/mediaView/useMediaView";

export function Details() {
  const { mode } = useGetMode();
  const { mobileView } = useMediaView();

  return (
    <Flex
      flexDir={"column"}
      justify={{ base: "space-between", lg: "normal" }}
      h={{ base: "100%", lg: "fit-content" }}
      w={"100%"}
      mt={"24px"}
      rowGap={"10px"}
    >
      {mode !== null ? (
        <Flex w={"100%"} flexDir={"column"} rowGap={"10px"}>
          {
            !mobileView && <Warning />
          }
          <ApproveToken />
          <TransactionDetail />
        </Flex>
      ) : (
        <Box />
      )}
      {
        !mobileView
        ? 
        <ActionButton /> 
        :
        <Flex direction="column" alignItems="center" rowGap={"12px"}>
          <Warning />
          <ActionButton />
        </Flex>
      }
    </Flex>
  );
}
