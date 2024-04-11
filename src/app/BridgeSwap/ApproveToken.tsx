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
import { useRecoilState, useRecoilValue } from "recoil";

import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import useMediaView from "@/hooks/mediaView/useMediaView";
import checkGreen from "assets/icons/mobile/check_green.svg";
import Image from "next/image";
import { convertNumber } from "@/utils/trim/convertNumber";
import commafy from "@/utils/trim/commafy";
import { txPendingStatus } from "@/recoil/global/transaction";


export default function ApproveToken() {
  const { inToken, outToken } = useInOutTokens();
  const { isApproved, callApprove, allowance } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  const { pendingTransactionToApprove } = useTransaction();
  const { isTONatPair } = useIsTon();
  const { mode } = useGetMode();
  const { isConnected } = useAccount();
  const [, setIsDrawerOpen] = useRecoilState(accountDrawerStatus);
  const { isBalanceOver } = useInputBalanceCheck();
  const { mobileView } = useMediaView();
  const txPending = useRecoilValue(txPendingStatus);

  
  const approveBtnDisabled = useMemo(() => {
    return (
      pendingTransactionToApprove && pendingTransactionToApprove.length > 0
    );
  }, [pendingTransactionToApprove]);

  if (
    isNotSupportForBridge ||
    !inToken ||
    !(inToken && outToken) && mode ==="Swap" ||
    !inToken && mode !== "Swap" ||
    (mode == "Swap" && isTONatPair) ||
    !isConnected ||
    isBalanceOver ||
    (Number(inToken?.parsedAmount) === 0 && !mobileView)
  ) {
    return null;
  }

  let mode_name

  if(mode === "ETH-Wrap")
    mode_name = "Wrap"

  else if(mode === "ETH-Unwrap")
    mode_name = "Unwrap"
  
  else
    mode_name = mode

let view_value
if (allowance != BigInt(0) && typeof allowance != 'undefined') {
  view_value = commafy(convertNumber(allowance, inToken.decimals),2)
  if (view_value.length > 30) {
    view_value = view_value.substring(0, 30) + '...';
  }
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
      {(!mobileView && approveBtnDisabled) && (
        <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
      )}
      {
        isApproved ? (
          <Text fontSize={{base: 12, lg: 14}} color={"#A0A3AD"}>
            {view_value} {inToken?.tokenSymbol} has been approved ({mode_name})
          </Text>
        ) : (
          mobileView ? (
            <>
              <Text fontSize={{base: 12, lg: 14}}>
                Approve {inToken?.tokenSymbol} for Swap
              </Text>
            </>
          ) : (
            <Text fontSize={{ base: 12, lg: 14 }}>
              Tokamak Bridge wants to use your {inToken?.tokenSymbol}
            </Text>
          )
        )
      }
    </Flex>
    {isApproved ? (
      <Image src={checkGreen}  alt={"check"} color='#18d08e' style={{ width: "20px", height: "20px" }} />
    ): (
      !mobileView ? (
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
      ) : (
        //mobile view
        isConnected && txPending ? (
          <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
        )
        : (
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
          >
            Approve
          </Button>
        )
      )
    )}
  </Flex>
);
}
