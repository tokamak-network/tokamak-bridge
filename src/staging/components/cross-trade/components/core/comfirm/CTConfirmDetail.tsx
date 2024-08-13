import { Box, HStack, Flex, Center, Text, Link } from "@chakra-ui/react";
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
  isInCT_Provide,
  isInCT_REQUEST,
} from "@/staging/types/transaction";
import { convertNumber, formatUnits } from "@/utils/trim/convertNumber";
import { isFinalStatus } from "../../../utils/getStatus";
import { LinkContainer } from "@/staging/components/common/LinkContainer";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useMemo } from "react";
import commafy from "@/utils/trim/commafy";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import QuestionIcon from "assets/icons/questionGray.svg";
import formatNumber from "@/staging/utils/formatNumbers";
import { useCrossTradeGasFee } from "@/staging/hooks/useCrossTradeGasFee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { trimAddress } from "@/utils/trim";
import { useBlockExplorer } from "@/hooks/network/useBlockExplorer";

interface TransactionDetailProps {
  title: string;
  mainValue: string;
  subValue: string;
  chainId: number;
  tokenSymbol: string;
  isCanceled?: boolean;
  tokenAddress: string;
  isProvide: boolean;
}

const CTTransactionDetail: React.FC<TransactionDetailProps> = ({
  title,
  mainValue,
  subValue,
  chainId,
  tokenSymbol,
  isCanceled,
  tokenAddress,
  isProvide,
}) => {
  const tooltipMessage = useMemo(() => {
    switch (title) {
      case "Request":
        return (
          <span>
            Total amount to pay, <br />
            including the service fee.
          </span>
        );
      case "Receive":
        if (isProvide)
          return (
            <span>
              Total amount to receive, including the service
              <br /> fee. It takes at least 2~5 minutes to receive <br />{" "}
              (depending on the L2 sequencer).
            </span>
          );

        return <span>Total amount to receive.</span>;
      case "Provide":
        return <span>Total amount to pay.</span>;
    }
  }, [title, isProvide]);

  return (
    <Box mt={title !== "Send" || isCanceled ? "0" : "0"}>
      <Flex alignItems={"center"}>
        <Text
          fontSize={"12px"}
          fontWeight={500}
          color={"#A0A3AD"}
          lineHeight={"18px"}
        >
          {title}
        </Text>
        <CustomTooltip
          content={<Image src={QuestionIcon} alt={"QuestionIcon"}></Image>}
          tooltipLabel={tooltipMessage}
          style={{
            px: "8px",
            py: "10px",
            tooltipLineHeight: "15x",
            height: "normal",
          }}
        />
      </Flex>
      <Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"32px"} fontWeight={600} lineHeight={"48px"}>
            {mainValue}
          </Text>
          <Center width="32px" height="32px">
            <LinkContainer
              chainId={chainId}
              address={tokenAddress}
              component={
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
              }
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
  txHash?: string;
}

interface CTConfirmDetailProps {
  modalType: ModalType;
  txData: CT_History | null;
  onPencilClick: () => void;
  requester?: string;
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
  txHash,
}) => {
  const { ethereumExplorer } = useBlockExplorer();
  return (
    <HStack
      justify="space-between"
      lineHeight={"18px"}
      mt={
        title === "Service fee" ||
        title === "Network fee" ||
        title === "Send to"
          ? "6px"
          : "0"
      }
    >
      <Flex alignItems="center">
        <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"} mr={"2px"}>
          {title}
        </Text>
        {title == "Service fee" && (
          <Tooltip
            tooltipLabel={
              "The service fee incentivizes the liquidity provider to accept the request. The amount received on L1 is calculated after deducting this fee."
            }
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
        ) : title === "Send to" ? (
          <Link
            fontSize={12}
            href={`${ethereumExplorer}/address/${txHash}`}
            isExternal={true}
          >
            {trimAddress({
              address: txHash,
              firstChar: 6,
              lastChar: 6,
              dots: "...",
            })}
          </Link>
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
  requester,
}: CTConfirmDetailProps) {
  if (txData === null) return null;

  const { inToken, outToken, inNetwork, outNetwork, status } = txData;
  const isCompleted = isFinalStatus(status);
  const isProvide = isInCT_Provide(status);
  const isCanceled = getCancelValueFromCTRequestHistory(txData);
  const updateFee = ableToUpdateFee(txData);
  const { tokenPriceWithAmount: inTokenPrice } = useGetMarketPrice({
    tokenName: inToken?.name,
    amount: formatUnits(inToken?.amount, inToken?.decimals),
  });
  const { tokenPriceWithAmount: outTokenPrice } = useGetMarketPrice({
    tokenName: outToken?.name,
    amount: formatUnits(outToken?.amount, outToken?.decimals),
  });

  const sendTokenInfo = {
    title: isProvide ? "Provide" : isCanceled ? "Refund" : "Request",
    mainValue: `${formatNumber(
      convertNumber(inToken.amount, inToken.decimals)
    )} ${inToken.symbol}`,
    subValue: `$${commafy(inTokenPrice)}`,
    chainId: isProvide ? outNetwork : inNetwork,
    tokenSymbol: inToken.symbol,
    tokenAddress: inToken.address,
  };
  const outTokenInfo = {
    title: "Receive",
    mainValue: `${formatNumber(
      convertNumber(outToken.amount, outToken.decimals)
    )} ${outToken.symbol}`,
    subValue: `$${commafy(outTokenPrice)}`,
    chainId: isProvide ? inNetwork : outNetwork,
    tokenSymbol: outToken.symbol,
    tokenAddress: outToken.address,
  };
  const serviceFee = useMemo(() => {
    return formatUnits(txData.serviceFee.toString(), inToken.decimals);
  }, [txData.serviceFee, inToken.decimals]);

  const { tokenPriceWithAmount } = useGetMarketPrice({
    amount: serviceFee,
    tokenName: inToken.name,
  });
  const { estimatedGasFeeUSD, estimatedGasFeeETH } = useCrossTradeGasFee(
    isProvide
      ? CTTransactionType.provideCT
      : CTTransactionType.requestRegisteredToken
  );

  return (
    <Box
      bg="#15161D"
      px={"20px"}
      py={"16px"}
      border={"1px, 1px, 0px, 1px"}
      borderRadius={"8px"}
    >
      <Flex flexDir={"column"} rowGap={"24px"}>
        <CTTransactionDetail
          {...sendTokenInfo}
          isCanceled={isCanceled}
          isProvide={isProvide}
        />
        {!isCanceled && (
          <CTTransactionDetail {...outTokenInfo} isProvide={isProvide} />
        )}
      </Flex>
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
            inNetwork={isProvide ? outNetwork : inNetwork}
            outNetwork={isProvide ? inNetwork : outNetwork}
          />
        )}
        {!isCanceled && updateFee && !isProvide && (
          <FeeDetail
            title="Service fee"
            mainAmount={`${commafy(serviceFee)} ${sendTokenInfo.tokenSymbol}`}
            subAmount={`$${commafy(tokenPriceWithAmount)}`}
            modalType={modalType}
            onPencilClick={onPencilClick}
            isCompleted={isCompleted}
          />
        )}
        {isProvide && <FeeDetail title="Send to" txHash={requester} />}
        {modalType === ModalType.Trade && (
          <FeeDetail
            title="Network fee"
            mainAmount={`${formatNumber(estimatedGasFeeETH)} ETH`}
            subAmount={`$ ${commafy(estimatedGasFeeUSD)}`}
          />
        )}
      </Box>
    </Box>
  );
}
