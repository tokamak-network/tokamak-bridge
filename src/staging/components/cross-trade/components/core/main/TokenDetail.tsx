import { Flex, Text, Box } from "@chakra-ui/react";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { Token, Profit } from "@/staging/types/crossTrade";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import formatNumber from "@/staging/utils/formatNumbers";
import { convertNumber, formatUnits } from "@/utils/trim/convertNumber";
import CTCustomTooltip from "@/staging/components/cross-trade/components/CTCustomTooltip";
import { useMemo } from "react";
import commafy from "@/utils/trim/commafy";
import { formatProfit } from "@/staging/utils/formatProfit";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { useRecommendFee } from "../../../hooks/useRecommendFee";
import { T_FETCH_REQUEST_LIST_L2 } from "@/staging/hooks/useCrossTrade";
import { useProvideCTGas } from "../../../hooks/useCTGas";

interface TokenDetailProps {
  token?: Token;
  network?: number;
  isProvide?: boolean;
  providingUSD?: number;
  recevingUSD?: number;
  profit?: Profit;
}

const Percentage = (props: { percent: string }) => {
  const isNegative = props.percent.includes("-");
  const isZero = Number(props.percent) === 0;

  return (
    <Text
      fontSize={14}
      fontWeight={500}
      color={
        isZero && !isNegative ? "#fff" : isNegative ? "#DD3A44" : "#03D187"
      }
    >
      {!isNegative && !isZero && "+"} {props.percent}%
    </Text>
  );
};

const USDValue = (props: { usdAmount: string }) => {
  const isNegative = props.usdAmount.includes("-");
  const isZero = Number(props.usdAmount) === 0;

  return (
    <Text
      fontSize={11}
      fontWeight={400}
      color={isZero ? "#fff" : isNegative ? "#DD3A44" : "#03D187"}
    >
      {isZero ? "" : isNegative ? "-" : "+"}$
      {props.usdAmount.replaceAll("-", "")}
    </Text>
  );
};

const NetProfit = (props: { percent: string; usdAmount: string }) => {
  return (
    <Flex flexDir={"column"}>
      <Percentage {...props}></Percentage>
      <USDValue {...props}></USDValue>
    </Flex>
  );
};

export default function TokenDetail(props: TokenDetailProps) {
  const { token, network, profit, isProvide, providingUSD, recevingUSD } =
    props;
  const isProfit = profit !== undefined;

  const formattedAmount = token
    ? convertNumber(token.amount, token.decimals)
    : commafy(profit?.amount);

  const symbol = token ? token.symbol : profit?.symbol;
  const tokenPriceWithAmount = useMemo(() => {
    if (isProvide) return providingUSD;
    return recevingUSD;
  }, [isProvide, providingUSD, recevingUSD]);

  const priceOrPercent = useMemo(() => {
    if (token) {
      return tokenPriceWithAmount ? `$${commafy(tokenPriceWithAmount)}` : "NA";
    }
    return `${formatProfit(profit?.percent)}`;
  }, [token, tokenPriceWithAmount, profit?.percent]);

  if (isProfit) {
    return (
      <NetProfit percent={priceOrPercent} usdAmount={commafy(profit.usd)} />
    );
  }

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
          <CustomTooltip
            content={formatNumber(formattedAmount)}
            tooltipLabel={`${formattedAmount} ${symbol}`}
            style={{
              maxW: "245px",
              px: "8px",
              py: "5px",
              tooltipLineHeight: "18px",
            }}
            needArrow={false}
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
            fontSize={"11px"}
            lineHeight={"16.5px"}
            color={"#A0A3AD"}
          >
            {priceOrPercent}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
