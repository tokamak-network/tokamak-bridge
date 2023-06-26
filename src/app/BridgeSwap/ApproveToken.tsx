import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useConnectedNetwork from "@/hooks/network";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useTransaction } from "@/hooks/tx/useTx";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export default function ApproveToken() {
  const { inToken } = useInOutTokens();
  const { isApproved, callApprove } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  const { pendingTransactionToApprove } = useTransaction();

  const approveBtnDisabled = useMemo(() => {
    return (
      pendingTransactionToApprove && pendingTransactionToApprove.length > 0
    );
  }, [pendingTransactionToApprove]);

  if (isApproved || isNotSupportForBridge || !inToken) {
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
      color={approveBtnDisabled ? "#8E8E92" : ""}
    >
      <Flex columnGap={"12px"}>
        {approveBtnDisabled && (
          <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
        )}
        <Text fontSize={14}>
          Tokamak Bridge wants to use your {inToken?.tokenSymbol}
        </Text>
      </Flex>
      <Button
        w={"92px"}
        h={"28px"}
        fontSize={14}
        fontWeight={500}
        bgColor={"#007AFF"}
        _active={{}}
        _hover={{}}
        onClick={callApprove}
        isDisabled={approveBtnDisabled}
        _disabled={{ bg: "#15161D", color: "#8E8E92" }}
      >
        Approve
      </Button>
    </Flex>
  );
}
