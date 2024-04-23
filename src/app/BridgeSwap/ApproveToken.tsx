import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";
// import { useTransaction } from "@/hooks/tx/useTx";
import Image from "next/image";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { capitalizeFirstChar } from "@/utils/trim/capitalizeChar";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useTransaction } from "@/hooks/tx/useTx";
import ConfirmedImage from "assets/icons/confirm/success.svg";
import commafy from "@/utils/trim/commafy";
import { ethers } from "ethers";

export default function ApproveToken() {
  const { inToken } = useInOutTokens();
  const { isApproved, callApprove, isLoading } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  const { isTONatPair } = useIsTon();
  const { mode } = useGetMode();
  const { isConnected } = useAccount();
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const { confirmedApproveTransaction } = useTransaction();

  const [, setIsDrawerOpen] = useRecoilState(accountDrawerStatus);

  console.log(
    isApproved,
    isNotSupportForBridge,
    !inToken,
    mode == "Swap" && isTONatPair,
    !isConnected,
    isBalanceOver,
    isInputZero,
    !confirmedApproveTransaction
  );
  console.log("confirmedApproveTransaction", confirmedApproveTransaction);

  if (
    (isApproved ||
      isNotSupportForBridge ||
      !inToken ||
      (mode == "Swap" && isTONatPair) ||
      !isConnected ||
      isBalanceOver ||
      isInputZero) &&
    confirmedApproveTransaction === undefined
  ) {
    return null;
  }

  const parsedAmount =
    confirmedApproveTransaction?.tokenData?.[0]?.amount?.toString()
      ? ethers.utils.formatUnits(
          confirmedApproveTransaction.tokenData[0].amount.toString(),
          inToken?.token.decimals
        )
      : "-";

  const text =
    confirmedApproveTransaction && isApproved
      ? `${commafy(parsedAmount)} ${"TON"} has been approved`
      : `Approve ${inToken?.tokenSymbol} for ${capitalizeFirstChar(
          mode ?? undefined
        )}`;

  const afterApproved = isApproved && confirmedApproveTransaction;
  const beforeApproved = !isLoading && !afterApproved;

  return (
    <Flex
      w={"100%"}
      // h={isExpanded ? "310px" : "48px"}
      maxH={"48px"}
      bg={"#1f2128"}
      borderRadius={"8px"}
      borderWidth={beforeApproved ? "1px" : ""}
      borderColor={"#59628D"}
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
          {text}
        </Text>
      </Flex>
      {isLoading ? (
        <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
      ) : afterApproved ? (
        <Flex>
          <Image src={ConfirmedImage} alt={"ConfirmedImage"} />
        </Flex>
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
