import { getCurrentProgressStatus } from "@/staging/components/new-history-thanos/utils/historyStatus";
import {
  Action,
  ProgressStatus,
  Status,
  TransactionHistory,
} from "@/staging/types/transaction";
import GasStationSymbol from "assets/icons/confirm/gas-station.svg";
import GasStationWhiteSymbol from "assets/icons/confirm/gas-station-white.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import { Box, Flex, Text, Link } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { getBridgeL2ChainId, getNextStatus } from "../../../utils";
import Image from "next/image";
import TxLink from "@/assets/icons/confirm/link.svg";
import PendingComponent from "./Pending";

interface StatusComponentProps {
  tx: TransactionHistory;
  label: Status;
  isLast: boolean;
}

interface GasDisplayComponentProps {
  value: number;
  symbol: string;
  isActive: boolean;
}

interface TxLinkComponentProps {
  link: string;
}

const GasDisplayComponent: React.FC<GasDisplayComponentProps> = ({
  value,
  symbol,
  isActive,
}) => {
  return (
    <Flex gap={"6px"}>
      <Image
        src={isActive ? GasStationWhiteSymbol : GasStationSymbol}
        alt="GasStationSymbol"
      />
      <Text
        fontSize={"14px"}
        fontWeight={400}
        lineHeight={"20px"}
        color={isActive ? "white" : "#A0A3AD"}
      >{`${value} ${symbol}`}</Text>
    </Flex>
  );
};

const TxLinkComponent: React.FC<TxLinkComponentProps> = ({ link }) => {
  return (
    <Link
      target="_blank"
      href={link}
      textDecor={"none"}
      _hover={{ textDecor: "none" }}
      display={"flex"}
    >
      <Flex alignItems={"center"} gap={"6px"}>
        <Text
          fontWeight={400}
          fontSize={"13px"}
          lineHeight={"20px"}
          color={"#A0A3AD"}
        >
          Transaction
        </Text>
        <Flex w={"14px"} h={"14px"}>
          <Image src={TxLink} alt={"TxLink"} />
        </Flex>
      </Flex>
    </Link>
  );
};

const StatusComponent: React.FC<StatusComponentProps> = (props) => {
  const { tx, label, isLast } = props;
  const progressStuatus = getCurrentProgressStatus(
    tx.action as Action,
    tx.status as Status,
    label,
    getBridgeL2ChainId(tx)
  );
  const gasCostUS = 30.63;
  const nextStatus = getNextStatus(label);
  const pendingStatus = getCurrentProgressStatus(
    tx.action as Action,
    tx.status as Status,
    nextStatus,
    getBridgeL2ChainId(tx)
  );
  return (
    <Box>
      <Flex flexDir={"column"} gap={"1px"}>
        <Flex justifyContent={"space-between"}>
          <Text
            fontSize={"17px"}
            fontWeight={600}
            lineHeight={"20px"}
            color={
              progressStuatus === ProgressStatus.Doing ? "white" : "#A0A3AD"
            }
          >
            {label}
          </Text>
          {progressStuatus === ProgressStatus.Done ? (
            <TxLinkComponent link="" />
          ) : (
            <GasDisplayComponent
              isActive={progressStuatus === ProgressStatus.Doing}
              value={0.0099}
              symbol="TON"
            />
          )}
        </Flex>
        {progressStuatus !== ProgressStatus.Done ? (
          <Text
            textAlign={"right"}
            fontSize={"11px"}
            fontWeight={400}
            lineHeight={"normal"}
            color={"#A0A3AD"}
          >
            {`$${gasCostUS}`}
          </Text>
        ) : (
          <Box height={"17px"} />
        )}
      </Flex>
      {!isLast && (
        <PendingComponent pendingStatus={pendingStatus} label={label} tx={tx} />
      )}
    </Box>
  );
};

export default StatusComponent;
