import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";
// import { useTransaction } from "@/hooks/tx/useTx";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { capitalizeFirstChar } from "@/utils/trim/capitalizeChar";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useWaitForTransaction, useTransaction } from "wagmi";
import useConnectedNetwork from "@/hooks/network";

export default function ApproveToken() {
  const { inToken } = useInOutTokens();
  const { isApproved, callApprove, isLoading } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  const { isTONatPair } = useIsTon();
  const { mode } = useGetMode();
  const { isConnected } = useAccount();
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const { connectedChainId } = useConnectedNetwork();

  const [, setIsDrawerOpen] = useRecoilState(accountDrawerStatus);

  if (
    isApproved ||
    isNotSupportForBridge ||
    !inToken ||
    (mode == "Swap" && isTONatPair) ||
    !isConnected ||
    isBalanceOver ||
    isInputZero
  ) {
    return null;
  }

  return (
    <Flex
      w={"100%"}
      // h={isExpanded ? "310px" : "48px"}
      maxH={"48px"}
      bg={"#1f2128"}
      borderRadius={"8px"}
      px={"20px"}
      py={"19px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={isLoading ? "#8E8E92" : ""}
    >
      <Flex columnGap={"12px"}>
        <Text
          fontSize={{ base: 12, lg: 14 }}
          color={isLoading ? "#A0A3AD" : "#fff"}
        >
          Approve {inToken?.tokenSymbol} for
          {capitalizeFirstChar(mode ?? undefined)}
        </Text>
      </Flex>
      {isLoading ? (
        <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
      ) : (
        <Button
          w={{ base: "64px", lg: "92px" }}
          h={"28px"}
          fontSize={{ base: 12, lg: 14 }}
          fontWeight={500}
          bgColor={"#007AFF"}
          color={"#fff"}
          _active={{}}
          _hover={{}}
          onClick={() => {
            callApprove();
            setIsDrawerOpen(false);
          }}
          isDisabled={isLoading}
          _disabled={{ bg: "#15161D", color: "#8E8E92" }}
        >
          Approve
        </Button>
      )}
    </Flex>
  );
}
