import { Box, HStack, Flex, Center, Text } from "@chakra-ui/react";
import { ModalType } from "@/staging/components/cross-trade/types";
import GasStationSymbol from "assets/icons/ct/gas_station_ct.svg";
import Pencil from "assets/icons/ct/pencil.svg";
import Image from "next/image";
import { Tooltip } from "@/staging/components/common/Tooltip";
import CTNetworkTransition, {
  CTSingleNetworkTransition,
} from "@/staging/components/cross-trade/components/core/comfirm/CTNetworkTransition";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import {
  CT_History,
  ableToUpdateFee,
  getCancelValueFromCTRequestHistory,
} from "@/staging/types/transaction";
import { sub } from "date-fns";
import { convertNumber } from "@/utils/trim/convertNumber";
import { isFinalStatus } from "../../../utils/getStatus";

interface TransactionDetailProps {
  title: string;
  mainValue: string;
  subValue: string;
  chainId: number;
  tokenSymbol: string;
  isCanceled?: boolean;
}

const CTTransactionDetail: React.FC<TransactionDetailProps> = ({
  title,
  mainValue,
  subValue,
  chainId,
  tokenSymbol,
  isCanceled,
}) => {
  return (
    <Box mt={title !== "Send" || isCanceled ? "24px" : "0"}>
      <Text
        fontSize={"12px"}
        fontWeight={500}
        color={"#A0A3AD"}
        lineHeight={"18px"}
      >
        {title}
      </Text>
      <Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"32px"} fontWeight={600} lineHeight={"48px"}>
            {mainValue}
          </Text>
          <Center width="32px" height="32px">
            <TokenSymbolWithNetwork
              tokenSymbol={tokenSymbol}
              chainId={chainId}
              networkSymbolW={22}
              networkSymbolH={22}
              symbolW={40}
              symbolH={40}
              bottom={-0.5}
              right={-0.5}
            />
          </Center>
        </Flex>
      </Box>
      <Text
        fontWeight={400}
        fontSize={"14px"}
        lineHeight={"21px"}
        py={"1px"}
        color={"#E3E4C0"}
      >
        <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>(</span>
        {subValue}
        <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>)</span>
      </Text>
    </Box>
  );
};

interface FeeDetailProps {
  title: string;
  mainAmount?: string;
  subAmount?: string;
  inNetwork?: number;
  outNetwork?: number;
  modalType?: ModalType;
  onPencilClick?: () => void;
  isCompleted?: boolean;
}

interface CTConfirmDetailProps {
  modalType: ModalType;
  txData: CT_History | null;
  onPencilClick: () => void;
}

const FeeDetail: React.FC<FeeDetailProps> = ({
  title,
  mainAmount,
  subAmount,
  modalType,
  onPencilClick,
  inNetwork,
  outNetwork,
  isCompleted,
}) => {
  return (
    <HStack
      justify="space-between"
      lineHeight={"18px"}
      mt={title === "Service fee" || title === "Network fee" ? "6px" : "0"}
    >
      <Flex alignItems="center">
        <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"} mr={"2px"}>
          {title}
        </Text>
        {title == "Service fee" && (
          <Tooltip
            tooltipLabel={"text will be changed"}
            style={{ marginLeft: "2px" }}
          />
        )}
      </Flex>
      <Flex>
        {title === "Network" ? (
          <CTNetworkTransition
            networkI={inNetwork}
            networkO={outNetwork}
            networkH={14}
            networkW={14}
          />
        ) : title === "Refund network" ? (
          <CTSingleNetworkTransition
            networkI={inNetwork}
            networkH={14}
            networkW={14}
          />
        ) : (
          <>
            {title == "Service fee" &&
              modalType === ModalType.History &&
              !isCompleted && (
                <Flex cursor="pointer" onClick={onPencilClick}>
                  <Image src={Pencil} alt={"Pencil"} />
                </Flex>
              )}
            {title == "Network fee" && (
              <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
            )}
            <Text fontWeight={600} fontSize={"12px"} mx={"4px"}>
              {mainAmount}
            </Text>
            <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>(</span>
              {subAmount}
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>)</span>
            </Text>
          </>
        )}
      </Flex>
    </HStack>
  );
};

export default function CTConfirmDetail({
  modalType,
  onPencilClick,
  txData,
}: CTConfirmDetailProps) {
  if (txData === null) return null;

  const { inToken, outToken, inNetwork, outNetwork, status } = txData;
  const isCompleted = isFinalStatus(status);
  const isCanceled = getCancelValueFromCTRequestHistory(txData);
  const updateFee = ableToUpdateFee(txData);

  const sendTokenInfo = {
    title: isCanceled ? "Refund" : "Send",
    mainValue: `${convertNumber(outToken.amount, outToken.decimals)} ${
      outToken.symbol
    }`,
    subValue: `$${"99.00"}`,
    chainId: outNetwork,
    tokenSymbol: outToken.symbol,
  };
  const outTokenInfo = {
    title: "Receive",
    mainValue: `${convertNumber(inToken.amount, inToken.decimals)} ${
      inToken.symbol
    }`,
    subValue: `$${"99.00"}`,
    chainId: inNetwork,
    tokenSymbol: inToken.symbol,
  };

  return (
    <Box
      bg="#15161D"
      px={"20px"}
      py={"16px"}
      border={"1px, 1px, 0px, 1px"}
      borderRadius={"8px"}
    >
      <CTTransactionDetail {...sendTokenInfo} isCanceled={isCanceled} />
      {!isCanceled && <CTTransactionDetail {...outTokenInfo} />}

      <Box mt={"24px"} borderTop="1px solid #313442" pt={"16px"} px={0} pb={0}>
        {isCanceled && (
          <FeeDetail
            title="Refund network"
            inNetwork={inNetwork}
            outNetwork={outNetwork}
          />
        )}
        {!isCanceled && (
          <FeeDetail
            title="Network"
            inNetwork={inNetwork}
            outNetwork={outNetwork}
          />
        )}
        {!isCanceled && updateFee && (
          <FeeDetail
            title="Service fee"
            mainAmount="0.012 USDC"
            subAmount="$0.43"
            modalType={modalType}
            onPencilClick={onPencilClick}
            isCompleted={isCompleted}
          />
        )}
        {modalType === ModalType.Trade && (
          <FeeDetail
            title="Network fee"
            mainAmount="0.16 ETH"
            subAmount="$0.43"
          />
        )}
      </Box>
    </Box>
  );
}
