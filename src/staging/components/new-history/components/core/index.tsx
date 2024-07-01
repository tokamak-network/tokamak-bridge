import React, { useMemo } from "react";
import { Flex, Box } from "@chakra-ui/react";
import {
  Action,
  CT_ACTION,
  CT_PROVIDE,
  CT_REQUEST,
  Status,
} from "@/staging/types/transaction";
import Pending from "@/staging/components/new-history/components/core/pending";
import Complete from "@/staging/components/new-history/components/core/complete";
import { useBridgeHistory } from "@/staging/hooks/useBridgeHistory";
import { useRecoilValue } from "recoil";
import { selectedTransactionCategory } from "@/recoil/history/transaction";

export default function AccountHistoryNew() {
  const { depositHistory, withdrawHistory, requestHistory, provideHistory } =
    useBridgeHistory();
  const _selectedTransactionCategory = useRecoilValue(
    selectedTransactionCategory
  );

  const historyData = useMemo(() => {
    switch (_selectedTransactionCategory) {
      case Action.Deposit:
        return depositHistory;
      case Action.Withdraw:
        return withdrawHistory;
      case CT_ACTION.REQUEST:
        return requestHistory;
      case CT_ACTION.PROVIDE:
        return provideHistory;
      default:
        return;
    }
  }, [
    _selectedTransactionCategory,
    depositHistory,
    withdrawHistory,
    requestHistory,
    provideHistory,
  ]);

  return (
    <Flex flexDirection="column" gap="2">
      {historyData?.map((transaction, index) => {
        return (
          <Box
            key={transaction.transactionHashes.initialTransactionHash}
            w={"336px"}
            px={"12px"}
            py={"8px"}
            borderRadius={"8px"}
            border={"1px solid #313442"}
            bg={"#15161D"}
          >
            {/** In the history, Pending shows the current incomplete screen, and Complete shows the completed screen. */}
            {transaction.status === Status.Completed ||
            transaction.status === CT_REQUEST.Completed ||
            transaction.status === CT_PROVIDE.Completed ? (
              <Complete {...transaction} />
            ) : (
              <Pending transaction={transaction} />
            )}
          </Box>
        );
      })}
    </Flex>
  );
}
