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
  const isDisabledRecommend = props.inputValue === "1";

  const { inToken } = useInOutTokens();

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
        <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
          Cross Trade Bridge
        </Text>
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
            color={"#DB00FF"}
          >
            {`${inToken?.parsedAmount} ${inToken?.tokenSymbol}`}
          </Text>
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
                    tooltipLabel={"text will be changed"}
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
              <Tooltip
                tooltipLabel={"text will be changed"}
                style={{ marginLeft: "2px" }}
              />
            </Flex>
            <CTOptionInput
              inputValue={props.inputValue}
              inputWarningCheck={props.inputWarningCheck}
              onInputChange={props.onInputChange}
            />
          </Box>
        )}
        <Box mt={"12px"}>
          <Text
            fontSize={"10px"}
            fontWeight={400}
            lineHeight={"15px"}
            color={"#A0A3AD"}
          >
            Trade for a token on a different layer,
            <br />
            subject to the availability of liquidity providers.
          </Text>
        </Box>
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
            $0.16
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
