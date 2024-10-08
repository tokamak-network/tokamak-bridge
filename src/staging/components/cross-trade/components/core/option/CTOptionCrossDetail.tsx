import {
  Box,
  Text,
  Flex,
  Circle,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import CTOptionInput from "@/staging/components/cross-trade/components/core/option/CTOptionInput";
import { Tooltip } from "@/staging/components/common/Tooltip";
import { CTInputProps } from "@/staging/components/cross-trade/types";
import {
  ButtonTypeMain,
  ButtonTypeSub,
} from "@/staging/components/cross-trade/types";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useMemo } from "react";
import formatNumber from "@/staging/utils/formatNumbers";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import commafy from "@/utils/trim/commafy";
import CustomTooltip, {
  CustomTooltipWithQuestion,
} from "@/components/tooltip/CustomTooltip";
import Image from "next/image";
import QuestionIcon from "assets/icons/question.svg";
import { useCrossTradeGasFee } from "@/staging/hooks/useCrossTradeGasFee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { BetaIcon } from "../../common/BetaIcon";

interface AdditionalCrossProps {
  activeMainButtonValue: ButtonTypeMain;
  handleButtonMainClick: (value: ButtonTypeMain) => void;
  activeSubButtonValue: ButtonTypeSub;
  handleButtonSubClick: (value: ButtonTypeSub) => void;
}

export default function CTOptionCrossDetail(
  props: AdditionalCrossProps & CTInputProps
) {
  const isCrossActive = props.activeMainButtonValue === ButtonTypeMain.Cross;
  const isRecommendActive =
    props.activeSubButtonValue === ButtonTypeSub.Recommend;
  const isAdvancedActive =
    props.activeSubButtonValue === ButtonTypeSub.Advanced;

  // 현재  props.inputValue가 1일때만 WarningType이 critical일때만, recommend 변경 타입 보여주는걸로 디자인 시연.
  // 추후 price api가 먹통 됬을때 해당 조건 주면 됨
  // const isDisabledRecommend = props.inputValue === "1";
  const isDisabledRecommend = props.recommnededFee === undefined ? true : false;
  const { inToken } = useInOutTokens();

  const receiveTokenValue = useMemo(() => {
    if (isRecommendActive && !isDisabledRecommend) return props.recommnededFee;

    const inputValue = props.inputValue;
    if (
      inputValue !== "" &&
      inputValue !== undefined &&
      inToken?.parsedAmount
    ) {
      const result = Number(inToken.parsedAmount) - Number(inputValue);
      return result;
    }
    return inToken?.parsedAmount;
  }, [props.inputValue, inToken, isRecommendActive, isDisabledRecommend]);

  const { tokenPriceWithAmount } = useGetMarketPrice({
    amount: receiveTokenValue as string,
    tokenName: inToken?.tokenName as string,
  });
  const { estimatedGasFeeUSD } = useCrossTradeGasFee(
    CTTransactionType.requestRegisteredToken
  );

  const receiveIsLessThanZero = Number(receiveTokenValue) < 0;

  const receiveValueOnUI = useMemo(() => {
    if (receiveIsLessThanZero) return "Reduce the service fee";
    return `${formatNumber(receiveTokenValue)} ${inToken?.tokenSymbol}`;
  }, [receiveIsLessThanZero, receiveTokenValue, inToken?.tokenSymbol]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      border={isCrossActive ? "1px solid #DB00FF" : "1px solid #313442"}
      py={"16px"}
      px={"20px"}
      borderRadius={"8px"}
      onClick={() => props.handleButtonMainClick(ButtonTypeMain.Cross)}
      cursor={isCrossActive ? "auto" : "pointer"}
    >
      <Box>
        <Flex alignItems={"center"}>
          <Flex>
            <Text
              fontWeight={600}
              fontSize={"16px"}
              lineHeight={"24px"}
              mr={"2px"}
            >
              Cross Trade Bridge
            </Text>
            <BetaIcon marginLeft={"4px"} marginRight={"2px"} />
          </Flex>
          <CustomTooltipWithQuestion
            isGrayIcon={true}
            tooltipLabel={
              <Box fontSize={12}>
                <Text>Cross trade bridge trades L2 token for L1 token.</Text>
                <Text>There is no guaranteed deadline; it depends</Text>
                <Text>on when liquidity is provided on L1.</Text>
              </Box>
            }
            style={{
              width: "293px",
              height: "74px",
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
              h={"20px"}
            >
              Receive
            </Text>
          </Flex>
          <Text
            fontWeight={600}
            fontSize={receiveIsLessThanZero ? 18 : 24}
            h={receiveIsLessThanZero ? "27px" : "36px"}
            lineHeight={receiveIsLessThanZero ? "27px" : "36px"}
            color={"#DB00FF"}
          >
            {receiveValueOnUI}
          </Text>
          {!receiveIsLessThanZero && (
            <Text fontSize={12} color={"#DB00FF"}>
              {`$${
                Number(tokenPriceWithAmount) < 0
                  ? 0
                  : commafy(tokenPriceWithAmount)
              }`}
            </Text>
          )}
        </Box>
        <Box mt={"12px"}>
          <Flex>
            <Button
              width={
                isRecommendActive
                  ? "99px"
                  : isDisabledRecommend
                  ? "116px"
                  : "98px"
              }
              height="26px"
              padding="4px 10px"
              gap="8px"
              borderRadius="4px"
              sx={{
                backgroundColor: isRecommendActive ? "#DB00FF" : "#15161D",
                border: isRecommendActive ? "" : "1px solid #313442",
                //disabled 상태에서 버튼 비활성화 css default 값
                _disabled: {
                  border: isRecommendActive
                    ? "none !important"
                    : "1px solid #313442",
                  cursor: "auto",
                },
                opacity: isDisabledRecommend ? 0.3 : 1,
              }}
              _hover={{}}
              _active={{}}
              _focus={{}}
              onClick={() =>
                props.handleButtonSubClick(ButtonTypeSub.Recommend)
              }
              isDisabled={isRecommendActive || isDisabledRecommend}
            >
              <Flex alignItems={"center"} justifyContent={"center"}>
                <Text
                  fontSize={"12px"}
                  color={isRecommendActive ? "#FFFFFF" : "#A0A3AD"}
                  fontWeight={isRecommendActive ? "600" : "400"}
                  lineHeight={"18px"}
                >
                  Recommend{" "}
                </Text>
                {isDisabledRecommend && (
                  <Tooltip
                    tooltipLabel={
                      "The recommendation system is currently unavailable. Please come back later."
                    }
                    style={{ marginLeft: "2px" }}
                  />
                )}
              </Flex>
            </Button>
            <Button
              width={isAdvancedActive ? "83px" : "82px"}
              height="26px"
              padding="4px 10px"
              ml={"8px"}
              gap="8px"
              borderRadius="4px"
              sx={{
                backgroundColor: isAdvancedActive ? "#DB00FF" : "#15161D",
                border: isAdvancedActive
                  ? "none !important"
                  : "1px solid #313442",
                //disabled 상태에서 버튼 비활성화 css default 값
                _disabled: {
                  border: "1px solid #313442",
                  cursor: "auto",
                },
              }}
              _hover={{}}
              _active={{}}
              _focus={{}}
              onClick={() => props.handleButtonSubClick(ButtonTypeSub.Advanced)}
              isDisabled={isAdvancedActive}
            >
              <Text
                fontSize={"12px"}
                color={isAdvancedActive ? "#FFFFFF" : "#A0A3AD"}
                fontWeight={isAdvancedActive ? "600" : "400"}
                lineHeight={"18px"}
              >
                Advanced
              </Text>
            </Button>
          </Flex>
        </Box>
        {isAdvancedActive && (
          <Box mt={"12px"}>
            <Flex alignItems="center">
              <Text
                fontWeight={400}
                fontSize={"10px"}
                lineHeight={"20px"}
                color={"#A0A3AD"}
              >
                Service fee
              </Text>
              <CustomTooltipWithQuestion
                isGrayIcon={true}
                tooltipLabel={
                  <Box fontSize={12}>
                    <Text>
                      The service fee incentivizes the liquidity provider
                    </Text>
                    <Text>to accept the request. The amount received</Text>
                    <Text>on L1 is calculated after deducting this fee. </Text>
                  </Box>
                }
                style={{
                  width: "304px",
                  height: "74px",
                  tooltipLineHeight: "18px",
                  px: "8px",
                  py: "10px",
                }}
              />
            </Flex>
            <CTOptionInput
              inputValue={props.inputValue}
              inputWarningCheck={props.inputWarningCheck}
              inTokenSymbol={inToken?.tokenSymbol as string}
              onInputChange={props.onInputChange}
            />
          </Box>
        )}
      </Box>
      <Circle
        size="72px"
        border="1px solid #DB00FF"
        bg="#15161D"
        pb={"8px"}
        pt={"6px"}
      >
        <Box>
          <Text
            fontWeight={600}
            fontSize={"16px"}
            lineHeight={"24px"}
            color={"#DB00FF"}
            textAlign="center"
          >
            ${commafy(estimatedGasFeeUSD)}
          </Text>
          <Text
            mt={"1.5px"}
            fontWeight={400}
            fontSize={"8px"}
            lineHeight={"12px"}
            color={"#DB00FF"}
            textAlign="center"
          >
            Network fee
          </Text>
        </Box>
      </Circle>
    </Flex>
  );
}
