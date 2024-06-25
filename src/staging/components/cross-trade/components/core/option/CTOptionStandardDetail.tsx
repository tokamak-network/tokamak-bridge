import { Box, Text, Flex, Circle } from "@chakra-ui/react";
import { Tooltip } from "@/staging/components/common/Tooltip";
import { ButtonTypeMain } from "@/staging/components/cross-trade/types";
interface AdditionalStandardProps {
  activeMainButtonValue: ButtonTypeMain;
  handleButtonMainClick: (value: ButtonTypeMain) => void;
}

export default function CTOptionStandardDetail(props: AdditionalStandardProps) {
  const isStandardActive =
    props.activeMainButtonValue === ButtonTypeMain.Standard;

  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      mt={"12px"}
      border={isStandardActive ? "1px solid #007AFF" : "1px solid #313442"}
      py={"16px"}
      px={"20px"}
      borderRadius={"8px"}
      onClick={() => props.handleButtonMainClick(ButtonTypeMain.Standard)}
      cursor={isStandardActive ? "auto" : "pointer"}
    >
      <Box>
        <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
          Official Standard Bridge
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
          </Flex>
          <Text
            fontWeight={600}
            fontSize={"22px"}
            lineHeight={"33px"}
            color={"#007AFF"}
          >
            10.00 USDC
          </Text>
        </Box>
        <Box mt={"12px"}>
          <Text
            fontSize={"10px"}
            fontWeight={400}
            lineHeight={"15px"}
            color={"#A0A3AD"}
          >
            Takes up to 6 hours to "rollup" and
            <br />7 days to "finalize" the withdrawal.
          </Text>
        </Box>
      </Box>
      <Circle
        size='72px'
        border='1px solid #007AFF'
        bg='#15161D'
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
            textAlign='center'
          >
            $50.16
          </Text>
          <Text
            mt={"1.5px"}
            fontWeight={400}
            fontSize={"8px"}
            lineHeight={"12px"}
            color={"#007AFF"}
            textAlign='center'
          >
            Network fee
          </Text>
        </Box>
      </Circle>
    </Flex>
  );
}
