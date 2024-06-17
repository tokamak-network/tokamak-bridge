import { Box, Text, Flex, Circle } from "@chakra-ui/react";
import { FwTooltip } from "@/staging/components/cross-trade/components/FwTooltip";
import { ButtonTypeMain } from "@/staging/components/cross-trade/types";
interface AdditionalStandardProps {
  activeMainButtonValue: ButtonTypeMain;
  handleButtonMainClick: (value: ButtonTypeMain) => void;
}

export default function FwOptionStandardDetail(props: AdditionalStandardProps) {
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
            <FwTooltip
              tooltipLabel={"text will be changed"}
              style={{ marginLeft: "2px" }}
            />
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
            Crosstrade is a common bridge service.
          </Text>
          <Text
            fontSize={"10px"}
            fontWeight={400}
            lineHeight={"15px"}
            color={"#A0A3AD"}
          >
            Network fee is more expensive than service fee
          </Text>
        </Box>
      </Box>
      <Circle
        size='56px'
        border='1px solid #007AFF'
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
            color={"#007AFF"}
            textAlign='center'
          >
            7
          </Text>
          <Text
            fontWeight={400}
            fontSize={"10px"}
            lineHeight={"15px"}
            color={"#007AFF"}
            textAlign='center'
          >
            days
          </Text>
        </Box>
      </Circle>
    </Flex>
  );
}
