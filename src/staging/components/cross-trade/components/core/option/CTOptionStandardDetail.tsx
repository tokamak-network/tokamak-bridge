import { Box, Text, Flex, Circle } from "@chakra-ui/react";
import { Tooltip } from "@/staging/components/common/Tooltip";
import { ButtonTypeMain } from "@/staging/components/cross-trade/types";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import CustomTooltip, {
  CustomTooltipWithQuestion,
} from "@/components/tooltip/CustomTooltip";
import Image from "next/image";
import QuestionIcon from "assets/icons/question.svg";
import { useCrossTradeGasFee } from "@/staging/hooks/useCrossTradeGasFee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import formatNumber from "@/staging/utils/formatNumbers";
import { useGetEstimatedTotalGasFee } from "@/staging/hooks/useStandardWithdrawGasFee";
import { useInOutNetwork } from "@/hooks/network";

interface AdditionalStandardProps {
  activeMainButtonValue: ButtonTypeMain;
  handleButtonMainClick: (value: ButtonTypeMain) => void;
}

export default function CTOptionStandardDetail(props: AdditionalStandardProps) {
  const isStandardActive =
    props.activeMainButtonValue === ButtonTypeMain.Standard;
  const { inToken } = useInOutTokens();
  const { inNetwork } = useInOutNetwork();
  const { totalCost } = useGetEstimatedTotalGasFee(
    inNetwork!.chainId,
    inToken!.tokenSymbol as string
  );

  const { tokenPriceWithAmount } = useGetMarketPrice({
    amount: inToken?.parsedAmount as string,
    tokenName: inToken?.tokenName as string,
  });

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      mt={"12px"}
      border={isStandardActive ? "1px solid #007AFF" : "1px solid #313442"}
      py={"16px"}
      px={"20px"}
      borderRadius={"8px"}
      onClick={() => props.handleButtonMainClick(ButtonTypeMain.Standard)}
      cursor={isStandardActive ? "auto" : "pointer"}
    >
      <Box>
        <Flex alignItems={"center"}>
          <Text
            fontWeight={600}
            fontSize={"16px"}
            lineHeight={"24px"}
            mr={"2px"}
          >
            Standard Bridge
          </Text>
          <CustomTooltipWithQuestion
            isGrayIcon={true}
            tooltipLabel={
              <Box fontSize={12}>
                <Text>Standard Bridge takes at least 7 days to withdraw</Text>
                <Text>(it may take longer depending on the rollup time)</Text>
              </Box>
            }
            style={{
              width: "316px",
              height: "56px",
              tooltipLineHeight: "18px",
              px: "8px",
              py: "10px",
            }}
          />
        </Flex>
        <Box mt={"12px"}>
          <Flex alignItems="center">
            <Text
              fontWeight={400}
              fontSize={"10px"}
              lineHeight={"20px"}
              color={"#A0A3AD"}
            >
              Receive
            </Text>
          </Flex>
          <Text
            fontWeight={600}
            fontSize={"22px"}
            lineHeight={"33px"}
            color={"#007AFF"}
          >
            {`${formatNumber(inToken?.parsedAmount)} ${inToken?.tokenSymbol}`}
          </Text>
        </Box>
        <Text fontSize={12} color={"#007AFF"}>
          {`$${
            Number(tokenPriceWithAmount) < 0 ? 0 : commafy(tokenPriceWithAmount)
          }`}
        </Text>
      </Box>
      <Circle
        size="72px"
        border="1px solid #007AFF"
        bg="#15161D"
        pb={"8px"}
        pt={"6px"}
      >
        <Box>
          <Text
            fontWeight={600}
            fontSize={"16px"}
            height={"24px"}
            lineHeight={"24px"}
            color={"#007AFF"}
            textAlign="center"
          >
            {`$${totalCost ? commafy(totalCost) : "NA"}`}
          </Text>
          <Text
            mt={"1.5px"}
            fontWeight={400}
            fontSize={"8px"}
            lineHeight={"12px"}
            color={"#007AFF"}
            textAlign="center"
          >
            Network fee
          </Text>
        </Box>
      </Circle>
    </Flex>
  );
}
