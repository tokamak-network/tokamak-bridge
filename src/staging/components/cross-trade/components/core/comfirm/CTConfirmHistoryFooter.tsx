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
import { isFinalStatus } from "../../../utils/getStatus";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import { useCountdown } from "@/staging/hooks/useCountdown";
import { ErrorRollupComponent } from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { getRemainTime } from "@/staging/components/new-history/utils/getTimeDisplay";
import { useBlockExplorer } from "@/hooks/network/useBlockExplorer";

interface TransactionItemProps {
  title: string;
  isActive: boolean;
  txHash?: string;
  isError?: boolean;
  blockTimestamp?: number[];
  txData: CT_History;
}

const TransactionItem = (props: TransactionItemProps) => {
  const { title, isActive, txHash, isError, blockTimestamp, txData } = props;
  const isOnError = isActive && isError;

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
      case "cancelRequest":
        return "Cancel Request";
      default:
        return title;
    }
  }, [title]);

  const { ethereumExplorer, titanExplorer } = useBlockExplorer();

  const blockExplorer = useMemo(() => {
    switch (title) {
      case "request":
        return titanExplorer;
      case "updateFee":
        return ethereumExplorer;
      case "completed":
        return titanExplorer;
      case "provide":
        return ethereumExplorer;
      case "return":
        return titanExplorer;
      case "refund":
        return titanExplorer;
      case "cancelRequest":
        return ethereumExplorer;
      default:
        return undefined;
    }
  }, [ethereumExplorer, titanExplorer, title]);

  const needToShowTimeDisplay =
    (title === "refund" || title === "return") && isActive;
  const initialTimeDisplay = formatTimeDisplay(getRemainTime(txData));
  const timeDisplay = useCountdown(initialTimeDisplay, Boolean(isOnError));

  const CountdownComponent = useMemo(() => {
    if (!needToShowTimeDisplay) return null;
    return (
      <Text
        fontWeight={400}
        fontSize={"13px"}
        lineHeight={"20px"}
        color={isOnError ? "#DD3A44" : "#fff"}
      >
        {timeDisplay}
      </Text>
    );
  }, [timeDisplay, needToShowTimeDisplay]);

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
      <Flex>
        {!isActive && (txHash !== undefined || txHash !== "") && (
          <Flex cursor={"pointer"}>
            <Link
              target="_blank"
              href={`${blockExplorer}/tx/${txHash}`}
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
        {CountdownComponent}
        {isOnError && <ErrorRollupComponent />}
      </Flex>
    </Flex>
  );
};

const analyzeTransactionHashes = (txData: {
  transactionHashes: any;
}): {
  nestedArrayLengthSum: number;
  nonNestedKeyLength: number;
  entries: [string, any][];
} => {
  if (
    typeof txData.transactionHashes === "object" &&
    txData.transactionHashes !== null
  ) {
    let nestedArrayLengthSum = 0;
    let nonNestedKeyLength = 0;
    const entries = Object.entries(txData.transactionHashes);

    entries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        nestedArrayLengthSum += value.length;
      } else {
        nonNestedKeyLength += 1;
      }
    });

    return { nestedArrayLengthSum, nonNestedKeyLength, entries };
  }
  return { nestedArrayLengthSum: 0, nonNestedKeyLength: 0, entries: [] };
};

export default function CTConfirmHistoryFooter(props: {
  txData: CT_History | null;
}) {
  const { txData } = props;
  if (txData === null) return null;

  const isCompleted = isFinalStatus(txData.status);
  const { nestedArrayLengthSum, nonNestedKeyLength, entries } =
    analyzeTransactionHashes(txData);
  const keyLength = nestedArrayLengthSum + nonNestedKeyLength;
  const isError = txData.errorMessage !== undefined;
  const lastIndex = entries.length - 1;

  const TransactionHistory = useMemo(() => {
    return (
      <Flex flexDir={"column"} ml={"18px"} flex={1} rowGap={"24px"}>
        {Object.entries(txData.transactionHashes).map(([key, hash], index) => {
          const isActive = isCompleted ? false : lastIndex === index;
          //@ts-ignore
          const blockTimestamp = txData.blockTimestamps[key];
          if (
            (hash === "" || hash === undefined) &&
            key !== "waitForReceive" &&
            key !== "return"
          )
            return null;
          if (typeof hash === "string") {
            return (
              <TransactionItem
                title={key}
                isActive={isActive}
                txHash={hash}
                isError={isError}
                blockTimestamp={blockTimestamp}
                txData={txData}
              />
            );
          }
          return hash.map((tx, index) => {
            const isActiveOnUpdateFee = isActive && index === hash.length - 1;
            if (tx === "" || tx === undefined) return null;
            return (
              <TransactionItem
                title={key}
                isActive={isActiveOnUpdateFee}
                txHash={tx}
                isError={isError}
                txData={txData}
              />
            );
          });
        })}
      </Flex>
    );
  }, [txData, keyLength, isCompleted]);

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
