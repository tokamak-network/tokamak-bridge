import { Box, Text, Flex, Center, Link } from "@chakra-ui/react";
import ThanosSymbol_bg from "assets/icons/ct/thanos_symbol_bg_white.svg";
import txlink from "@/assets/icons/ct/txlink.svg";
import Image from "next/image";
import CTTimeline from "./CTTimeLine";
import { CT_History, isInCT_REQUEST } from "@/staging/types/transaction";
import { useMemo } from "react";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  calculateInitialCountdown,
  isFinalStatus,
} from "../../../utils/getStatus";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import { useCountdown } from "@/staging/hooks/useCountdown";

interface TransactionItemProps {
  title: string;
  isActive: boolean;
  txHash?: string;
  isCT_REQUEST_CANCEL?: boolean;
}
const TransactionItem = (props: TransactionItemProps) => {
  const { title, isActive, txHash } = props;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const isOnL1 = title === "Wait For Receive";

  const _title = useMemo(() => {
    switch (title) {
      case "request":
        return "Request";
      case "updateFee":
        return "Update fee";
      case "waitForReceive":
        return "Wait for receive";
      case "completed":
        return "Completed";
      case "provide":
        return "Provide";
      case "return":
        return "Return liquidity";
      case "refund":
        return "Refund";
      default:
        return title;
    }
  }, [title]);

  const chainId = isOnL1
    ? isConnectedToMainNetwork
      ? SupportedChainId.MAINNET
      : SupportedChainId.SEPOLIA
    : isConnectedToMainNetwork
    ? SupportedChainId.TITAN
    : SupportedChainId.TITAN_SEPOLIA;

  const remainTime = calculateInitialCountdown(
    Math.floor(Date.now() / 1000),
    TRANSACTION_CONSTANTS.CROSS_TRADE.REQUEST
  );
  const initialTimeDisplay = formatTimeDisplay(remainTime);
  const timeDisplay = useCountdown(initialTimeDisplay, false);

  return (
    <Flex justifyContent={"space-between"}>
      <Text
        fontWeight={600}
        fontSize={"15px"}
        lineHeight={"20px"}
        color={isActive ? "#FFFFFF" : "#A0A3AD"}
      >
        {_title}
      </Text>
      {!isActive && (
        <Flex cursor={"pointer"}>
          <Link
            target="_blank"
            href={`${BLOCKEXPLORER_CONSTANTS[chainId]}/tx/${txHash}`}
            textDecor={"none"}
            _hover={{ textDecor: "none" }}
            display={"flex"}
          >
            <Text
              fontWeight={400}
              fontSize={"13px"}
              lineHeight={"20px"}
              color={"#A0A3AD"}
              mr={"4px"}
            >
              Transaction
            </Text>
            <Flex cursor="pointer">
              <Image src={txlink} alt={"txlink"} />
            </Flex>
          </Link>
        </Flex>
      )}
      {isActive && (
        <Text
          fontWeight={400}
          fontSize={"13px"}
          lineHeight={"20px"}
          color={"#fff"}
          mr={"4px"}
        >
          {timeDisplay}
        </Text>
      )}
    </Flex>
  );
};

export default function CTConfirmHistoryFooter(props: {
  txData: CT_History | null;
}) {
  const { txData } = props;

  if (txData === null) return null;

  const isCompleted = isFinalStatus(txData.status);
  const keyLength = Object.keys(txData.transactionHashes).length;
  const TransactionHistory = useMemo(() => {
    return (
      <Flex flexDir={"column"} ml={"18px"} flex={1} rowGap={"24px"}>
        {Object.entries(txData.transactionHashes).map(([key, hash], index) => {
          const isActive = isCompleted ? false : keyLength - 1 === index;
          if (typeof hash === "string") {
            return (
              <TransactionItem title={key} isActive={isActive} txHash={hash} />
            );
          }
          return hash.map((tx, index) => {
            const isActiveOnUpdateFee = isActive && index === hash.length - 1;
            return (
              <TransactionItem
                title={key}
                isActive={isActiveOnUpdateFee}
                txHash={tx}
              />
            );
          });
        })}
      </Flex>
    );
  }, [txData.transactionHashes, keyLength, isCompleted]);

  return (
    <>
      <Box
        mt={"16px"}
        bg="#15161D"
        py={"16px"}
        px={"20px"}
        border={"1px, 1px, 0px, 1px"}
        borderRadius={"8px"}
      >
        <Flex>
          <Box width={"auto"}>
            <CTTimeline lineType={keyLength} status={txData.status} />
          </Box>
          {TransactionHistory}
        </Flex>
      </Box>
      <Box mt={"12px"} pb={"4px"}>
        <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
          Estimated Time of Arrival: ~1 day
        </Text>
        <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
          Estimated Time of Arrival: ~1 day
        </Text>
      </Box>
    </>
  );
}
