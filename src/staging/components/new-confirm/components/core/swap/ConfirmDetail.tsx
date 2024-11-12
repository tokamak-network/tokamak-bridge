import { Box, Flex, Text, Link } from "@chakra-ui/react";
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
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { TokenInfo } from "types/token/supportedToken";
import getBlockExplorerUrl from "@/staging/utils/getBlockExplorerUrl";
import commafy from "@/utils/trim/commafy";
import { useInOutNetwork } from "@/hooks/network";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import {
  NetworkDisplayName,
  SupportedChainId,
} from "@/types/network/supportedNetwork";

interface Token {
  chainId: number;
}

interface ConfirmDetailProps {
  isInNetwork: boolean;
  inToken:
    | (TokenInfo & {
        token: Token;
        amountBN: BigInt | null;
        parsedAmount: string | null;
        tokenAddress: string | null;
      })
    | null;
  deductionPercentage?: string;
}

export default function ConfirmDetails(props: ConfirmDetailProps) {
  const { isInNetwork, inToken, deductionPercentage } = props;
  const { inNetwork } = useInOutNetwork();
  const chainName =
    getKeyByValue(
      SupportedChainId,
      inNetwork?.chainId ?? SupportedChainId.MAINNET
    ) || "";

  const displayNetworkName = NetworkDisplayName[chainName];
  const { tokenPriceWithAmount: tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  const marketPrice = useMemo(() => {
    if (tokenPriceWithAmount) {
      return `$${commafy(tokenPriceWithAmount)}`;
    }
    return "NA";
  }, [tokenPriceWithAmount]);

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      mt={isInNetwork ? undefined : "16px"}
    >
      <Flex flexDir={"column"} gap={"4px"}>
        <Text
          fontWeight={500}
          fontSize={"14px"}
          lineHeight={"21px"}
          color={"#FFFFFF"}
        >
          {isInNetwork ? "Sell" : "Receive"}
        </Text>
        <Flex gap={"4px"} alignItems={"center"}>
          <NetworkSymbol
            networkI={inToken?.token.chainId ?? SupportedChainId.MAINNET}
            networkW={14}
            networkH={14}
          />
          <Text
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"18px"}
            color={"#A0A3AD"}
          >
            {displayNetworkName}
          </Text>
        </Flex>
      </Flex>
      <Box>
        <Flex gap={"8px"} alignItems={"center"} justifyContent={"right"}>
          <FormatNumber
            style={{
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#FFFFFF",
            }}
            value={inToken?.parsedAmount}
            tokenSymbol={inToken?.tokenSymbol}
          />
          <Link
            target="_blank"
            href={
              inToken?.token.chainId
                ? `${
                    getBlockExplorerUrl(inToken?.token.chainId)
                    /** To be updated with the correct values after the proper type design @Robert */
                  }/address/${inToken.tokenAddress}`
                : ""
            }
          >
            <TokenSymbol
              w={20}
              h={20}
              tokenType={inToken?.tokenSymbol as string}
            />
          </Link>
        </Flex>
        <Flex
          gap={"4px"}
          alignItems={"center"}
          justifyContent={"right"}
          marginRight={"28px"}
        >
          <Text
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"18px"}
            color={"#A0A3AD"}
            textAlign={"right"}
          >
            {marketPrice}
          </Text>
          {deductionPercentage && (
            <Text
              fontWeight={400}
              lineHeight={"18px"}
              color={"#DD3A44"}
              fontSize={"12px"}
            >
              ({deductionPercentage}%)
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
