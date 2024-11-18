import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import NetworkSymbol from "@/staging/components/new-confirm/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  TransactionHistory,
  Status,
  Action,
} from "@/staging/types/transaction";
import TxLink from "@/assets/icons/confirm/link.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import capitalizeFirstLetter from "@/staging/utils/capitalizeFirstLetter";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { convertNumber, formatUnits } from "@/utils/trim/convertNumber";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import {
  NetworkDisplayName,
  SupportedChainId,
} from "@/types/network/supportedNetwork";
import commafy from "@/utils/trim/commafy";
import Link from "next/link";
import { useInOutNetwork } from "@/hooks/network";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";

interface ConfirmDetailProps {
  isInNetwork: boolean;
  transactionHistory: TransactionHistory | undefined;
}

export default function ConfirmDetails(props: ConfirmDetailProps) {
  const { isInNetwork, transactionHistory } = props;

  if (!transactionHistory) {
    return null;
  }
  const { tokenPriceWithAmount: tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: transactionHistory.inToken.name as string,
    amount: formatUnits(
      transactionHistory.inToken.amount,
      transactionHistory.inToken.decimals
    ),
  });

  const marketPrice = useMemo(() => {
    if (transactionHistory && tokenPriceWithAmount !== undefined) {
      return `$${commafy(tokenPriceWithAmount)}`;
    }
    return "NA";
  }, [tokenPriceWithAmount, transactionHistory]);

  const networkChainId = isInNetwork
    ? transactionHistory.inNetwork
    : transactionHistory.outNetwork;

  const chainName = getKeyByValue(SupportedChainId, networkChainId) || "";

  const displayNetworkName = NetworkDisplayName[chainName];

  const tokenAddress = isInNetwork
    ? transactionHistory.inToken.address
    : transactionHistory.outToken.address;

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Box>
        <Text
          fontWeight={500}
          fontSize={"14px"}
          lineHeight={"21px"}
          color={"#FFFFFF"}
        >
          {isInNetwork ? "Send" : "Receive"}
        </Text>
        <Flex mt={"4px"} alignItems={"center"}>
          <NetworkSymbol
            networkI={
              isInNetwork
                ? transactionHistory.inNetwork
                : transactionHistory.outNetwork
            }
            networkH={14}
            networkW={14}
          />
          <Text
            ml={"6px"}
            fontWeight={400}
            fontSize={"11px"}
            lineHeight={"14px"}
            color={"#A0A3AD"}
          >
            {displayNetworkName}
          </Text>
        </Flex>
      </Box>
      <Box>
        <Flex gap={"8px"} alignItems={"center"} justifyContent={"right"}>
          <FormatNumber
            style={{
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#FFFFFF",
            }}
            value={
              isInNetwork
                ? convertNumber(
                    transactionHistory.inToken.amount,
                    transactionHistory.inToken.decimals
                  )
                : convertNumber(
                    transactionHistory.outToken.amount,
                    transactionHistory.outToken.decimals
                  )
            }
            tokenSymbol={
              isInNetwork
                ? transactionHistory.inToken.symbol
                : transactionHistory.outToken.symbol
            }
          />
          <Link
            target="_blank"
            href={`${
              BLOCKEXPLORER_CONSTANTS[
                isInNetwork
                  ? transactionHistory?.inNetwork ?? SupportedChainId.MAINNET
                  : transactionHistory?.outNetwork ?? SupportedChainId.MAINNET
              ]
            }/address/${getTokenAddressByChainId(
              isInNetwork
                ? (transactionHistory.inToken.symbol as string)
                : (transactionHistory.outToken.symbol as string),
              isInNetwork
                ? transactionHistory.inNetwork
                : transactionHistory.outNetwork
            )}`}
          >
            <TokenSymbol
              w={20}
              h={20}
              tokenType={
                isInNetwork
                  ? (transactionHistory.inToken.symbol as string)
                  : (transactionHistory.outToken.symbol as string)
              }
            />
          </Link>
        </Flex>
        <Box>
          <Text
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"18px"}
            color={"#A0A3AD"}
            textAlign={"right"}
            marginRight={"28px"}
          >
            {marketPrice}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
