import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";
import { useTransaction } from "@/hooks/tx/useTx";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";

export default function ApproveToken() {
  const { inToken, outToken } = useInOutTokens();
  const { isApproved, callApprove } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  const { pendingTransactionToApprove } = useTransaction();
  const { isTONatPair } = useIsTon();
  const { mode } = useGetMode();
  const { isConnected } = useAccount();
  const [, setIsDrawerOpen] = useRecoilState(accountDrawerStatus);

  const tokenBalance = useTokenBalance(inToken);

  if (tokenBalance?.data.parsedBalance && inToken?.parsedAmount) {
    console.log(tokenBalance?.data.parsedBalance)
    console.log(inToken?.parsedAmount)
  }

  const isExceedMaximum = useMemo(() => {
    if (tokenBalance?.data.parsedBalance && inToken?.parsedAmount) {
      return Number(tokenBalance?.data.parsedBalance) >= Number(inToken?.parsedAmount)
    }
    return false;
  }, [tokenBalance, inToken])

  const approveBtnDisabled = useMemo(() => {
    return (
      pendingTransactionToApprove && pendingTransactionToApprove.length > 0
    );
  }, [pendingTransactionToApprove]);

  if (
    isApproved ||
    isNotSupportForBridge ||
    !(inToken && outToken) ||
    (mode == "Swap" && isTONatPair) ||
    !isConnected ||
    !isExceedMaximum
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
      color={approveBtnDisabled ? "#8E8E92" : ""}
    >
      <Flex columnGap={"12px"}>
        {approveBtnDisabled && (
          <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
        )}
        <Text fontSize={{ base: 12, lg: 14 }}>
          Tokamak Bridge wants to use your {inToken?.tokenSymbol}
        </Text>
      </Flex>
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
        isDisabled={approveBtnDisabled}
        _disabled={{ bg: "#15161D", color: "#8E8E92" }}
      >
        Approve
      </Button>
    </Flex>
  );
}
