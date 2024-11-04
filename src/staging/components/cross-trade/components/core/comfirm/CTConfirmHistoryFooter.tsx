import { Box, Text, Flex, Link } from "@chakra-ui/react";
import txlink from "@/assets/icons/ct/txlink.svg";
import Image from "next/image";
import CTTimeline from "./CTTimeLine";
import {
  CT_History,
  isInCT_REQUEST,
  isInCT_REQUEST_CANCEL,
} from "@/staging/types/transaction";
import { useEffect, useMemo, useState } from "react";
import { isFinalStatus } from "../../../utils/getStatus";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import { useCountdown } from "@/staging/hooks/useCountdown";
import { ErrorRollupComponent } from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { getRemainTime } from "@/staging/components/new-history/utils/getTimeDisplay";
import { useBlockExplorer } from "@/hooks/network/useBlockExplorer";
import { CustomTooltipWithQuestion } from "@/components/tooltip/CustomTooltip";
import { useTimeOver } from "@/hooks/time/useTimeOver";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";

interface TransactionItemProps {
  title: string;
  isActive: boolean;
  txHash?: string;
  isError?: boolean;
  blockTimestamp?: number[];
  txData: CT_History;
}

const TransactionItem = (props: TransactionItemProps) => {
  const { title, isActive, txHash, isError, txData, blockTimestamp } = props;

  const isOnError = isActive && isError;

  const _title = useMemo(() => {
    switch (title) {
      case "request":
        return "Request";
      case "updateFee":
        return "Update";
      case "waitForReceive":
        return "Waiting";
      case "completed":
        return "Completed";
      case "provide":
        return "Provide";
      case "return":
        return "Receive";
      case "refund":
        return "Refund";
      case "cancelRequest":
        return "Cancel";
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
  const initialTimeDisplay = getRemainTime(txData);
  const { isTimeOver } = useTimeOver({
    timeStamp: Number(blockTimestamp),
    //refund and return have same timeBuffer as 300s
    timeBuffer: TRANSACTION_CONSTANTS.CROSS_TRADE.RETURN_LIQUIDITY,
    needToCheck: needToShowTimeDisplay,
  });
  const timeDisplay = useCountdown(
    initialTimeDisplay,
    Boolean(isOnError) || isTimeOver
  );

  const CountdownComponent = useMemo(() => {
    if (!needToShowTimeDisplay) return null;
    return (
      <Text
        fontWeight={400}
        fontSize={"13px"}
        lineHeight={"20px"}
        color={isOnError || isTimeOver ? "#DD3A44" : "#fff"}
      >
        {timeDisplay.time}
      </Text>
    );
  }, [timeDisplay, needToShowTimeDisplay, isTimeOver]);

  return (
    <Flex justifyContent={"space-between"}>
      <Flex columnGap={"2px"} alignItems={"center"}>
        <Text
          fontWeight={600}
          fontSize={"15px"}
          lineHeight={"20px"}
          color={isActive ? "#FFFFFF" : "#A0A3AD"}
        >
          {_title}
        </Text>
        {_title === "Receive" && (
          <CustomTooltipWithQuestion
            isGrayIcon={true}
            style={{
              width: "223px",
              height: "53px",
              tooltipLineHeight: "normal",
              px: "8px",
              py: "10px",
            }}
            tooltipLabel={
              <span>
                It take at least 15 minutes to receive <br />
                (depending on the L2 sequencer).{" "}
              </span>
            }
          />
        )}
        {_title === "Refund" && (
          <CustomTooltipWithQuestion
            isGrayIcon={true}
            style={{
              width: "223px",
              height: "53px",
              tooltipLineHeight: "normal",
              px: "8px",
              py: "10px",
            }}
            tooltipLabel={
              <span>
                The refund takes at least 15 minutes
                <br />
                (depending on the L2 sequencer).{" "}
              </span>
            }
          />
        )}
      </Flex>
      <Flex>
        {!isActive && (txHash !== undefined || txHash !== "") && (
          <Flex cursor={"pointer"}>
            <Link
              target='_blank'
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
              <Flex cursor='pointer'>
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
  const isRequest = isInCT_REQUEST(txData.status);

  const TransactionHistory = useMemo(() => {
    return (
      <Flex flexDir={"column"} ml={"18px"} flex={1} rowGap={"24px"}>
        {Object.entries(txData.transactionHashes).map(([key, hash], index) => {
          const isActive = isCompleted ? false : lastIndex === index;
          //@ts-ignore
          const blockTimestamp =
            key === "refund"
              ? //@ts-ignore
                txData.blockTimestamps["cancelRequest"]
              : //@ts-ignore
                txData.blockTimestamps[key];
          const isCancelCompleted =
            isInCT_REQUEST_CANCEL(txData.status) && key === "completed";
          if (typeof hash === "string") {
            return (
              <TransactionItem
                title={isCancelCompleted ? "refund" : key}
                isActive={isActive}
                txHash={hash}
                isError={isError}
                blockTimestamp={blockTimestamp}
                txData={txData}
              />
            );
          }
          return hash?.map((tx, index) => {
            const isActiveOnUpdateFee = isActive && index === hash.length - 1;
            if (tx === "" || tx === undefined) return null;

            return (
              <TransactionItem
                title={key}
                isActive={isActiveOnUpdateFee}
                txHash={tx}
                isError={isError}
                blockTimestamp={blockTimestamp}
                txData={txData}
              />
            );
          });
        })}
      </Flex>
    );
  }, [txData, keyLength, isCompleted]);

  return (
    <Flex w={"100%"} flexDir={"column"}>
      <Box
        bg='#15161D'
        py={"16px"}
        px={"20px"}
        border={"1px, 1px, 0px, 1px"}
        borderRadius={"8px"}
        w={"100%"}
        mt={"20px"}
        maxH={"272px"}
        overflow={"auto"}
        overflowY={"auto"}
        borderLeftRadius={"8px"}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            backgroundColor: "#15161D",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#343741",
            borderRadius: "3px",
          },
        }}
      >
        <Flex>
          <Box width={"auto"}>
            <CTTimeline lineType={keyLength} status={txData.status} />
          </Box>
          {TransactionHistory}
        </Flex>
      </Box>
      {isRequest && (
        <Box w={"100%"} mt={"12px"}>
          <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
            Tip: Update the service fee to reflect significant <br /> change in
            L1 gas price.
          </Text>
        </Box>
      )}
      <Box w={"100%"} mt={"12px"}>
        <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
          *This modal doesn't update in real-time.
          <br /> Close & reopen it to view the latest data.
        </Text>
      </Box>
    </Flex>
  );
}
