import { Flex, Box } from "@chakra-ui/react";
import Warning from "./Warning";
import { useGetMode } from "@/hooks/mode/useGetMode";
import TransactionDetail from "./TransactionDetail";
import ActionButton from "./components/ActionButton";
import ApproveToken from "@/app/BridgeSwap/ApproveToken";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";

const WrappedWarning = () => {
  return (
    <Box data-testid='warning-box'>
      <Warning />
    </Box>
  );
};

export function Details() {
  const { mode } = useGetMode();
  const { pcView, mobileView } = useMediaView();
  const { inToken, outToken } = useInOutTokens();
  const { isTONatPair } = useIsTon();
  const showWarning =
    !pcView && mode === "Swap" && inToken && outToken && isTONatPair;

  return (
    <Flex
      flexDir={"column"}
      justify={{ base: "space-betwzcontent" }}
      w={"100%"}
      mt={{ sm: "0px", lg: "24px" }}
      rowGap={"10px"}
    >
      {mode !== null ? (
        <Flex w={"100%"} flexDir={"column"} rowGap={"10px"}>
          {pcView ? <WrappedWarning /> : !showWarning && <WrappedWarning />}
          <ApproveToken />
          <TransactionDetail />
        </Flex>
      ) : (
        <Box />
      )}
      {!mobileView ? (
        <ActionButton />
      ) : (
        <Flex direction='column' rowGap={"12px"}>
          {showWarning && <WrappedWarning />}
          <ActionButton />
        </Flex>
      )}
    </Flex>
  );
}
