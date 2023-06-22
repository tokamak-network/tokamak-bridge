import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useConnectedNetwork from "@/hooks/network";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Button, Flex, Text ,useToast, Box} from "@chakra-ui/react";

export default function ApproveToken() {
  const { inToken } = useInOutTokens();
  const { chainName } = useConnectedNetwork();
  const { isApproved, callApprove } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  // const toast = useToast()
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
    >
      <Text fontSize={14}>
        Tokamak Bridge wants to use your {inToken?.tokenSymbol}
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
        // onClick={() =>
        //   toast({
        //     position: 'bottom-left',
        //     render: () => (
        //       <Box color='white' p={3} bg='blue.500'>
        //         Hello World
        //       </Box>
        //     ),
        //   })
        // }
      >
        Approve
      </Button>
    </Flex>
  );
}
