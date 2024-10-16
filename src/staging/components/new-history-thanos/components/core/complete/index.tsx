import React, { use, useCallback, useEffect, useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import TokenPair from "@/staging/components/new-history-thanos/components/TokenPair";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  TransactionHistory,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
  CT_ACTION,
  CT_REQUEST_CANCEL,
  getCancelValueFromCTRequestHistory,
  HISTORY_SORT,
  CT_History,
  isInCT_REQUEST,
  CT_REQUEST_HISTORY_blockTimestamps,
  isInCT_Provide,
  CT_PROVIDE_HISTORY_blockTimestamps,
  isInCT_REQUEST_CANCEL,
  Action,
} from "@/staging/types/transaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { formatDateToYMD } from "@/staging/components/new-history-thanos/utils/timeUtils";
import { convertNumber } from "@/utils/trim/convertNumber";
import { useHistoryTab } from "@/staging/hooks/useHistoryTab";
import useCTConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import { ModalType } from "@/staging/components/cross-trade/types";
import { depositWithdrawConfirmModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import useDepositWithdrawConfirmModalUpdate from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModalUpdate";
import InfoIcon from "@/assets/icons/info.svg"
import Image from "next/image";

export default function Complete(transaction: TransactionHistory) {
  const transactionData = transaction;
  const { isOnOfficialStandard } = useHistoryTab();
  const { onOpenDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();
  const { } = useDepositWithdrawConfirmModalUpdate(transactionData);
  const isExternalBridge =
    (transactionData.action === Action.Deposit ||
      transactionData.action === Action.Withdraw) &&
    transactionData?.fromAddress !== transactionData?.toAddress;
  const completedTimestamp = useMemo(() => {
    if (isWithdrawTransactionHistory(transactionData)) {
      return transactionData.blockTimestamps.finalizedCompletedTimestamp;
      // return transactionData.blockTimestamps.finalizedCompletedTimestamp;
    }
    if (isDepositTransactionHistory(transactionData)) {
      return transactionData.blockTimestamps.finalizedCompletedTimestamp;
    }
    if (isInCT_REQUEST(transactionData.status)) {
      const blockTimestamps =
        transactionData.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
      return blockTimestamps.completed;
    }
    if (isInCT_REQUEST_CANCEL(transactionData.status)) {
      const blockTimestamps =
        transactionData.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
      return blockTimestamps.completed;
    }
    if (isInCT_Provide(transactionData.status)) {
      const blockTimestamps =
        transactionData.blockTimestamps as CT_PROVIDE_HISTORY_blockTimestamps;
      return blockTimestamps.return;
    }
    return null;
  }, [transactionData]);

  const { onOpenCTConfirmModal } = useCTConfirmModal();

  const openModal = useCallback(() => {
    if (
      transactionData.category === HISTORY_SORT.STANDARD &&
      (isDepositTransactionHistory(transactionData) ||
        isWithdrawTransactionHistory(transactionData))
    ) {
      onOpenDepositWithdrawConfirmModal(transactionData);
    }
    if (transactionData.category === HISTORY_SORT.CROSS_TRADE) {
      onOpenCTConfirmModal({
        type: ModalType.History,
        txData: transactionData as CT_History,
      });
    }
  }, [transactionData]);

  const isCT_Request_Cancel =
    getCancelValueFromCTRequestHistory(transactionData);
  const title = useMemo(() => {
    switch (transactionData.action) {
      case "Withdraw":
        return "Withdraw";
      case "Deposit":
        return isExternalBridge ? "Deposit to" : "Deposit";
      case CT_ACTION.REQUEST:
        return "Request";
      case CT_ACTION.PROVIDE:
        return "Provide";
      default:
        return "-";
    }
  }, [transactionData.action, isCT_Request_Cancel]);

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex gap={"3px"} alignItems={"center"}>
          <Text
            fontWeight={500}
            fontSize={"12px"}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            {title}{" "}
            {isCT_Request_Cancel && (
              <>
                <span style={{ fontSize: "10px", fontWeight: 400 }}>{"("}</span>
                <span>Cancel</span>
                <span style={{ fontSize: "10px", fontWeight: 400 }}>{")"}</span>
              </>
            )}
          </Text>
          {isExternalBridge && <Image src={InfoIcon} alt="info icon" />}
        </Flex>
        <TokenPair
          networkI={transactionData.inNetwork}
          networkO={isCT_Request_Cancel ? null : transactionData.outNetwork}
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
        mt={"4px"}
        borderRadius={"6px"}
        borderWidth={"1px"}
        borderColor={
          isOnOfficialStandard
            ? "rgba(0, 122, 255, 0.4)"
            : "rgba(219, 0, 255, 0.40)"
        }
        h={"36px"}
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
          onClick={openModal}
        >
          {formatDateToYMD(Number(completedTimestamp))}
        </Text>
      </Flex>
    </>
  );
}
