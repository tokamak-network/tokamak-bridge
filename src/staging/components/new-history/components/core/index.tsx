import React, { useEffect, useState } from "react";

import axios from "axios";
import { Flex, Box } from "@chakra-ui/react";
import {
  TransactionHistory,
  Status,
  Action,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
} from "@/staging/types/transaction";
import Pending from "@/staging/components/new-history/components/core/pending";
import Complete from "@/staging/components/new-history/components/core/complete";
import {
  useBridgeHistory,
  useDepositData,
  useWithdrawData,
} from "@/staging/hooks/useBridgeHistory";

export default function AccountHistoryNew() {
  // 여기서 더미 데이터를 통해 아래 뿌려주는걸 만든다.
  // 새로 고침시 전체 데이터를 다시 불러온다.
  // hook에서 데이터를 가져온다.

  const { depositHistory, withdrawHistory } = useBridgeHistory();

  // The last available hash becomes the transaction key.
  const getTransactionKey = (transaction: TransactionHistory) => {
    if (isWithdrawTransactionHistory(transaction)) {
      const {
        initialTransactionHash,
        rollupTransactionHash,
        finalizedTransactionHash,
      } = transaction.transactionHashes;
      return (
        finalizedTransactionHash ||
        rollupTransactionHash ||
        initialTransactionHash
      );
    }
    if (isDepositTransactionHistory(transaction)) {
      const { initialTransactionHash, finalizedTransactionHash } =
        transaction.transactionHashes;
      return finalizedTransactionHash || initialTransactionHash;
    }
  };

  const test = depositHistory &&
    withdrawHistory && [...depositHistory, ...withdrawHistory];

  return (
    <Flex flexDirection="column" gap="2">
      {test?.map((transaction, index) => {
        const transactionHash = getTransactionKey(transaction);
        return (
          <Box
            // key={transactionHash}
            w={"336px"}
            px={"12px"}
            py={"8px"}
            borderRadius={"8px"}
            border={"1px solid #313442"}
            bg={"#15161D"}
          >
            {transaction.status === Status.Completed ? (
              <Complete {...transaction} />
            ) : (
              <Pending
                transaction={transaction}
                transactionHash={`${transactionHash}_${index}`}
              />
            )}
          </Box>
        );
      })}
    </Flex>
  );
}
