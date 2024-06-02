import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import {
  TransactionHistory,
  Status,
  Action,
} from "@/componenets/historyn/types";
import { TRANSACTION_CONSTANTS } from "@/componenets/historyn/constants";
import {
  convertTimeToMinutes,
  formatDateToYMD,
} from "@/componenets/historyn/utils/timeUtils";

interface TransactionStatusComponentProps {
  label: string;
  transactionData: TransactionHistory;
}

function displayTimeBasedOnStatus(
  label: string,
  transactionData: TransactionHistory
): string {
  if (label === Status.Initial) {
    return formatDateToYMD(
      Number(transactionData.blockTimestamps.initialCompletedTimestamp)
    );
  }

  if (transactionData.action === Action.Withdraw) {
    if (transactionData.status === Status.Rollup) {
      if (transactionData.errorMessage) {
        return "11:11";
      }
      return "00:00";
    } else if (transactionData.status === Status.Finalized) {
      return "22:22";
    }
  } else if (
    transactionData.action === Action.Deposit &&
    transactionData.status === Status.Finalized
  ) {
    return "33:33";
  }

  return "Not applicable";
}

export default function StatusComponent(
  props: TransactionStatusComponentProps
) {
  const { label, transactionData } = props;
  const timeDisplay = displayTimeBasedOnStatus(label, transactionData);
  const isActive = transactionData.status === label;

  // console.log(transactionData)
  // => transactionData 값
  //   {
  //     "action": "Withdraw",
  //     "status": "Finalized",
  //     "inNetwork": "SEPOLIA",
  //     "outNetwork": "TITAN_SEPOLIA",
  //     "transactionHashes": {
  //         "initialTransactionHash": "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
  //         "rollupTransactionHash": "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3"
  //     },
  //     "blockTimestamps": {
  //         "initialCompletedTimestamp": "1717315200",
  //         "rollupCompletedTimestamp": "1717322400"
  //     },
  //     "tokenSymbol": "TON",
  //     "amount": "100.1234"
  // }

  //   console.log(
  //     formatDateToYMD(
  //       Number(transactionData.blockTimestamps.initialCompletedTimestamp)
  //     )
  //   ); =>2024.06.02

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Flex alignItems='center'>
        <Circle size='6px' bg={"#007AFF"} />
        <Text
          ml={"6px"}
          fontSize={"11px"}
          fontWeight={600}
          lineHeight={"22px"}
          color={isActive ? "#FFFFFF" : "#A0A3AD"}
        >
          {label}
        </Text>
      </Flex>
      <Text
        fontSize={"11px"}
        fontWeight={400}
        lineHeight={"22px"}
        color={isActive ? "#FFFFFF" : "#A0A3AD"}
      >
        {timeDisplay}
      </Text>
    </Flex>
  );
}
