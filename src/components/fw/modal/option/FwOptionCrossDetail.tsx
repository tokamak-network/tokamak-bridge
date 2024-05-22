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
import FwOptionInput from "@/components/fw/modal/option/FwOptionInput";
import { FwTooltip } from "@/components/fw/components/FwTooltip";
import { FwInputProps } from "@/components/fw/types";
import { ButtonTypeMain, ButtonTypeSub } from "@/components/fw/types";
interface AdditionalCrossProps {
  activeMainButtonValue: ButtonTypeMain;
  handleButtonMainClick: (value: ButtonTypeMain) => void;
  activeSubButtonValue: ButtonTypeSub;
  handleButtonSubClick: (value: ButtonTypeSub) => void;
}

export default function FwOptionCrossDetail(
  props: AdditionalCrossProps & FwInputProps
) {
  const isCrossActive = props.activeMainButtonValue === ButtonTypeMain.Cross;

  const isRecommendActive =
    props.activeSubButtonValue === ButtonTypeSub.Recommend;
  const isAdvancedActive =
    props.activeSubButtonValue === ButtonTypeSub.Advanced;

  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
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
          <Flex alignItems='center'>
            <Text
              fontWeight={400}
              fontSize={"10px"}
              lineHeight={"20px"}
              color={"#A0A3AD"}
            >
              Receive
            </Text>
            <FwTooltip
              tooltipLabel={"text will be changed"}
              style={{ marginLeft: "2px" }}
            />
          </Flex>
          <Text
            fontWeight={600}
            fontSize={"22px"}
            lineHeight={"33px"}
            color={"#DB00FF"}
          >
            9.988 USDC
          </Text>
        </Box>
        <Box mt={"12px"}>
          <Flex>
            <Button
              width={isRecommendActive ? "99px" : "98px"}
              height='26px'
              padding='4px 10px'
              gap='8px'
              borderRadius='4px'
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
              }}
              _hover={{}}
              onClick={() =>
                props.handleButtonSubClick(ButtonTypeSub.Recommend)
              }
              isDisabled={isRecommendActive}
            >
              <Text
                fontSize={"12px"}
                color={isRecommendActive ? "#FFFFFF" : "#A0A3AD"}
                fontWeight={isRecommendActive ? "600" : "400"}
                lineHeight={"18px"}
              >
                Recommend
              </Text>
            </Button>
            <Button
              width={isAdvancedActive ? "83px" : "82px"}
              height='26px'
              padding='4px 10px'
              ml={"8px"}
              gap='8px'
              borderRadius='4px'
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
            <Flex alignItems='center'>
              <Text
                fontWeight={400}
                fontSize={"10px"}
                lineHeight={"20px"}
                color={"#A0A3AD"}
              >
                Service fee
              </Text>
              <FwTooltip
                tooltipLabel={"text will be changed"}
                style={{ marginLeft: "2px" }}
              />
            </Flex>
            <FwOptionInput
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
            It can be received faster depending on
          </Text>
          <Text
            fontSize={"10px"}
            fontWeight={400}
            lineHeight={"15px"}
            color={"#A0A3AD"}
          >
            the liquidity provider situation
          </Text>
        </Box>
      </Box>
      <Circle
        size='56px'
        border='1px solid #DB00FF'
        bg='#15161D'
        pb={"8px"}
        pt={"6px"}
      >
        <Box>
          <Text
            fontWeight={600}
            fontSize={"22px"}
            height={"29px"}
            lineHeight={"33px"}
            letterSpacing={"-0.05em"}
            color={"#DB00FF"}
            textAlign='center'
          >
            ?
          </Text>
          <Text
            fontWeight={400}
            fontSize={"10px"}
            lineHeight={"15px"}
            color={"#DB00FF"}
            textAlign='center'
          >
            day
          </Text>
        </Box>
      </Circle>
    </Flex>
  );
}
