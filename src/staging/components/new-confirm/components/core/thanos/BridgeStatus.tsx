import { getStatusConfig } from "@/staging/constants/status";
import {
  Action,
  ProgressStatus,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import TimeLineComponent from "./TimeLine";
import { getLineConfig } from "../../../utils";
import StatusComponent from "./StatusComponent";

interface BridgeStatusComponentProps {
  tx: TransactionHistory;
}

const BridgeStatusComponent: React.FC<BridgeStatusComponentProps> = (props) => {
  let { tx } = props;
  const statusConfig = getStatusConfig(tx.inNetwork, tx.outNetwork);
  const { pointCount, currentIndex, completedIndex } = getLineConfig(tx);

  const statuses: Status[] =
    tx.action === Action.Withdraw
      ? statusConfig.WITHDRAW
      : statusConfig.DEPOSIT;
  return (
    <Box my={"12px"} px={"20px"} py={"16px"} borderRadius={"8px"} bg="#15161D">
      <Flex>
        <TimeLineComponent
          pointCount={pointCount}
          completedIndex={completedIndex}
          currentIndex={currentIndex}
        />
        <Flex flexDir={"column"} width={"100%"}>
          {Array.from({ length: statuses.length }, (_, index) => {
            return (
              <StatusComponent
                key={index}
                tx={tx}
                label={statuses[index]}
                isLast={index === statuses.length - 1}
              />
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
};

export default BridgeStatusComponent;
