import React, { use, useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import TokenPair from "@/staging/components/new-history/components/TokenPair";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  TransactionHistory,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
  CT_ACTION,
} from "@/staging/types/transaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { formatDateToYMD } from "@/staging/components/new-history/utils/timeUtils";
import { convertNumber } from "@/utils/trim/convertNumber";
import { useHistoryTab } from "@/staging/hooks/useHistoryTab";

export default function Complete(transaction: TransactionHistory) {
  const transactionData = transaction;
  const { onOpenDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();
  const { isOnOfficialStandard } = useHistoryTab();

  const completedTimestamp = useMemo(() => {
    if (isWithdrawTransactionHistory(transactionData)) {
      return transactionData.blockTimestamps.finalizedCompletedTimestamp;
    }
    if (isDepositTransactionHistory(transactionData)) {
      return transactionData.blockTimestamps.finalizedCompletedTimestamp;
    }
    return null;
  }, [transactionData]);

  const title = useMemo(() => {
    switch (transactionData.action) {
      case "Withdraw":
        return "Withdraw";
      case "Deposit":
        return "Deposit";
      case CT_ACTION.REQUEST:
        return "Request";
      case CT_ACTION.PROVIDE:
        return "Provide";
      default:
        return "-";
    }
  }, [transactionData.action]);

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={500}
          fontSize={"12px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          {title}
        </Text>
        <TokenPair
          networkI={transactionData.inNetwork}
          networkO={transactionData.outNetwork}
          networkW={16}
          networkH={16}
          pairType={"completed"}
        />
      </Flex>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"12px"}
        py={"4px"}
        my={"4px"}
        borderRadius={"6px"}
        borderWidth={"1px"}
        borderColor={
          isOnOfficialStandard
            ? "rgba(0, 122, 255, 0.4)"
            : "rgba(219, 0, 255, 0.4)"
        }
      >
        <Flex alignItems="center">
          <TokenSymbol
            w={22}
            h={22}
            tokenType={transactionData.inToken.symbol}
          />
          <Box ml={"6px"}>
            <Flex>
              <FormatNumber
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#FFFFFF",
                }}
                value={convertNumber(
                  transactionData.inToken.amount,
                  transactionData.inToken.decimals
                )}
              />
              <Box w="4px" /> {/** space bar */}
              <Text
                fontWeight={400}
                fontSize={"14px"}
                lineHeight={"21px"}
                color={"#A0A3AD"}
              >
                {transactionData.inToken.symbol}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Text
          fontWeight={400}
          fontSize={"11px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
          cursor={"pointer"}
          onClick={() => onOpenDepositWithdrawConfirmModal(transactionData)}
        >
          {formatDateToYMD(Number(completedTimestamp))}
        </Text>
      </Flex>
    </>
  );
}
