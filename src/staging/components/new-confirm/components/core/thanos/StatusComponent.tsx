import { getCurrentProgressStatus } from "@/staging/components/new-history-thanos/utils/historyStatus";
import {
  Action,
  ProgressStatus,
  StandardHistory,
  Status,
  TransactionHistory,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import GasStationSymbol from "assets/icons/confirm/gas-station.svg";
import GasStationWhiteSymbol from "assets/icons/confirm/gas-station-white.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import { Box, Flex, Text, Link } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getBridgeL1ChainId,
  getBridgeL2ChainId,
  getDepositWithdrawType,
  getEstimatedWithdrawalFeeConstant,
  getNativeToken,
  getNextStatus,
} from "../../../utils";
import Image from "next/image";
import TxLink from "@/assets/icons/confirm/link.svg";
import PendingComponent from "./Pending";
import { useThanosSDK } from "@/staging/hooks/useThanosSDK";
import getBlockExplorerUrl from "@/staging/utils/getBlockExplorerUrl";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import commafy from "@/utils/trim/commafy";

interface StatusComponentProps {
  tx: TransactionHistory;
  label: Status;
  isLast: boolean;
}

interface GasDisplayComponentProps {
  value: number | null;
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
      >{`${value ?? "NA"} ${symbol}`}</Text>
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
  const l1ChainId = useMemo(() => {
    return getBridgeL1ChainId(tx);
  }, [tx]);
  const l2ChainId = useMemo(() => {
    return getBridgeL2ChainId(tx);
  }, [tx]);
  const progressStuatus = getCurrentProgressStatus(
    tx.action as Action,
    tx.status as Status,
    label,
    l2ChainId
  );

  const { tokenMarketPrice } = useGetMarketPrice({
    tokenName: label === Status.Initiate ? "TON" : "ETH",
  });

  const [gasEstimation, setGasEstimation] = useState<number | null>(0);
  const nextStatus = getNextStatus(label);
  const pendingStatus = getCurrentProgressStatus(
    tx.action as Action,
    tx.status as Status,
    nextStatus,
    l2ChainId
  );
  const [initiateGasEstimation, setInitiateGasEstimation] = useState<number>(0);
  const { estimateGas, crossChainMessenger } = useThanosSDK(
    l1ChainId,
    l2ChainId
  );

  const gasCostUS = useMemo(() => {
    if (tokenMarketPrice && gasEstimation) {
      return `$${commafy(tokenMarketPrice * gasEstimation, 2)}`;
    }
    return "NA";
  }, [tokenMarketPrice, tx, label]);

  //estimage initiate Gas by SDK
  useEffect(() => {
    const getEstimatedGas = async () => {
      return 0;
    };
    if (pendingStatus === ProgressStatus.Todo) {
      const fee = getEstimatedWithdrawalFeeConstant(
        l2ChainId,
        getDepositWithdrawType(tx.inToken.symbol)
      );
      if (!fee) setGasEstimation(null);
      else setGasEstimation(fee[label] ?? null);
    }
  }, [estimateGas, label]);

  const txLink = useMemo(() => {
    if (progressStuatus === ProgressStatus.Done && l1ChainId && l2ChainId) {
      const l1Url = getBlockExplorerUrl(l1ChainId);
      const l2Url = getBlockExplorerUrl(l2ChainId);
      switch (label) {
        case Status.Initiate:
          return `${tx.action === Action.Deposit ? l1Url : l2Url}/tx/${
            (tx as StandardHistory).transactionHashes.initialTransactionHash
          }`;
        case Status.Prove:
          return `${l1Url}/tx/${
            (tx as WithdrawTransactionHistory).transactionHashes
              .proveTransactionHash
          }`;
        case Status.Finalize:
          return `${l1Url}/tx/${
            (tx as WithdrawTransactionHistory).transactionHashes
              .finalizedTransactionHash
          }`;
      }
    }
    return "";
  }, [progressStuatus]);
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
            <TxLinkComponent link={txLink} />
          ) : (
            <GasDisplayComponent
              isActive={progressStuatus === ProgressStatus.Doing}
              value={gasEstimation}
              symbol={
                label === Status.Initiate ? getNativeToken(l2ChainId) : "ETH"
              }
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
            {`${gasCostUS}`}
          </Text>
        ) : !isLast ? (
          <Box height={"17px"} />
        ) : null}
      </Flex>
      {!isLast && (
        <PendingComponent
          pendingStatus={pendingStatus ?? ProgressStatus.Todo}
          label={label}
          tx={tx}
        />
      )}
    </Box>
  );
};

export default StatusComponent;
