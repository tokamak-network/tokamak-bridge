import { Flex, Text, Box } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { Token, Profit } from "@/staging/types/crossTrade";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import formatNumber from "@/staging/utils/formatNumbers";
import { convertNumber, formatUnits } from "@/utils/trim/convertNumber";
import CTCustomTooltip from "@/staging/components/cross-trade/components/CTCustomTooltip";
import { useMemo } from "react";
import commafy from "@/utils/trim/commafy";

interface TokenDetailProps {
  token?: Token;
  network?: number;
  isProvide?: boolean;
  providingUSD?: number;
  recevingUSD?: number;
  profit?: Profit;
}

export default function TokenDetail(props: TokenDetailProps) {
  const { token, network, profit, isProvide, providingUSD, recevingUSD } =
    props;

  const formattedAmount = token
    ? convertNumber(token.amount, token.decimals)
    : profit?.amount;

  const symbol = token ? token.symbol : profit?.symbol;
  const tokenPriceWithAmount = useMemo(() => {
    if (isProvide) return providingUSD;
    return recevingUSD;
  }, [isProvide, providingUSD, recevingUSD]);

  const priceOrPercent = useMemo(() => {
    if (token) {
      return tokenPriceWithAmount ? `$${commafy(tokenPriceWithAmount)}` : "NA";
    }
    return `${profit?.percent}%`;
  }, [tokenPriceWithAmount, profit?.percent]);

  return (
    <Flex columnGap={"13px"}>
      {network && token && (
        <TokenSymbolWithNetwork
          tokenSymbol={token.symbol}
          chainId={network}
          networkSymbolW={18}
          networkSymbolH={18}
          symbolW={32}
          symbolH={32}
        />
      )}
      <Box>
        <Flex alignItems={"center"}>
          <Text
            fontWeight={500}
            fontSize={"14px"}
            lineHeight={"21px"}
            color={"#FFFFFF"}
          ></Text>
          <CTCustomTooltip
            content={formatNumber(formattedAmount)}
            tooltipLabel={`${formattedAmount} ${symbol}`}
            style={{
              maxW: "245px",
              px: "8px",
              py: "5px",
              tooltipLineHeight: "18px",
            }}
            contentStyle={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "21px",
              color: "#FFFFFF",
            }}
          />
          <Text
            ml={"4px"}
            fontWeight={400}
            fontSize={"14px"}
            lineHeight={"21px"}
            color={"#A0A3AD"}
          >
            {symbol}
          </Text>
        </Flex>
        <Flex alignItems={"center"}>
          <Text
            fontWeight={400}
            fontSize={"9px"}
            lineHeight={"13.5px"}
            color={"#A0A3AD"}
          >
            (
          </Text>
          <Text
            fontWeight={400}
            fontSize={"11px"}
            lineHeight={"16.5px"}
            color={"#A0A3AD"}
          >
            {priceOrPercent}
          </Text>
          <Text
            fontWeight={400}
            fontSize={"9px"}
            lineHeight={"13.5px"}
            color={"#A0A3AD"}
          >
            )
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
