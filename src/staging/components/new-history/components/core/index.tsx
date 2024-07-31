import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import {
  Action,
  CT_ACTION,
  CT_PROVIDE,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  Status,
} from "@/staging/types/transaction";
import Pending from "@/staging/components/new-history/components/core/pending";
import Complete from "@/staging/components/new-history/components/core/complete";
import { useBridgeHistory } from "@/staging/hooks/useBridgeHistory";
import { useRecoilValue } from "recoil";
import { selectedTransactionCategory } from "@/recoil/history/transaction";
import GradientSpinner from "@/components/ui/GradientSpinner";
import Image from "next/image";
import NoAcitivity from "@/assets/icons/accountHistory/noActivityIcon.svg";

const NoAcitivityComponent = () => {
  return (
    <Flex
      flexDir={"column"}
      rowGap={"24px"}
      alignItems={"center"}
      justifyContent={"center"}
      h={"640px"}
    >
      <Image src={NoAcitivity} alt={"noActivityIcon"}></Image>
      <Text>No activity yet</Text>
    </Flex>
  );
};

const LoadingSpinner = () => {
  const components = new Array(5).fill(null).map((_, index) => (
    <Box
      key={`${Math.random()}_${index}`}
      w={"336px"}
      px={"12px"}
      py={"8px"}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
    >
      <Flex key={index} w={"336px"} h={"78px"}>
        <Box w={"92%"}>
          <GradientSpinner minW="50%" />
        </Box>
      </Flex>
    </Box>
  ));

  return <>{components}</>;
};

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
    <Flex flexDirection="column" gap="2" h={"100%"}>
      {!historyData && <LoadingSpinner />}
      {historyData?.length === 0 && <NoAcitivityComponent />}
      {historyData?.map((transaction, index) => {
        return (
          <Box
            key={`${transaction.action}-${index}`}
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
            transaction.status === CT_REQUEST_CANCEL.Completed ||
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
