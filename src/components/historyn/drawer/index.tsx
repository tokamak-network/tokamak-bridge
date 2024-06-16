import React, { useEffect, useState } from "react";

import axios from "axios";
import { Flex, Box } from "@chakra-ui/react";
import {
  TransactionHistory,
  Status,
  Action,
  isWithdrawTransactionHistory,
  isDepositTransactionHistory,
} from "@/components/historyn/types";
import Pending from "@/components/historyn/drawer/pending";
import Complete from "@/components/historyn/drawer/complete";

export default function AccountHistoryNew() {
  // 여기서 더미 데이터를 통해 아래 뿌려주는걸 만든다.
  // 새로 고침시 전체 데이터를 다시 불러온다.
  // hook에서 데이터를 가져온다.

  const [data, setData] = useState<TransactionHistory[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // const apiUrl = process.env.NEXT_PUBLIC_HISTORY_API;

      const apiUrl = "/api/history";
      if (!apiUrl) {
        console.error("API URL is not defined");
        return;
      }

      try {
        const response = await axios.get<TransactionHistory[]>(apiUrl);
        console.log("Data received:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

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
    } else if (isDepositTransactionHistory(transaction)) {
      const { initialTransactionHash, finalizedTransactionHash } =
        transaction.transactionHashes;
      return finalizedTransactionHash || initialTransactionHash;
    }
  };

  return (
    <Flex flexDirection='column' gap='2'>
      {data &&
        data.map((transaction) => {
          const transactionHash = getTransactionKey(transaction);
          return (
            <Box
              key={transactionHash}
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
                  transactionHash={transactionHash}
                />
              )}
            </Box>
          );
        })}
    </Flex>
  );
}
