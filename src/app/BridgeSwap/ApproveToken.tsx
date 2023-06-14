import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useConnectedNetwork from "@/hooks/network";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Button, Flex, Text } from "@chakra-ui/react";

export default function ApproveToken() {
  const { inToken } = useInOutTokens();
  const { chainName } = useConnectedNetwork();
  const { isApproved, callApprove } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();

  if (isApproved || isNotSupportForBridge) {
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
    >
      <Text fontSize={14}>
        {chainName} wants to use your {inToken?.tokenSymbol}
      </Text>
      <Button
        w={"92px"}
        h={"28px"}
        fontSize={14}
        fontWeight={500}
        bgColor={"#007AFF"}
        _active={{}}
        _hover={{}}
        onClick={callApprove}
      >
        Approve
      </Button>
    </Flex>
  );
}
