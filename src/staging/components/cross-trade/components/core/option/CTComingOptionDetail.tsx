import { Box, Text, Flex, Circle } from "@chakra-ui/react";
import FWoptionBg from "@/assets/image/BridgeSwap/ct/ctOptionBg.png";
import FWoptionButtonBg from "@/assets/image/BridgeSwap/ct/ctOptionButtonBg.png";

export default function CTComingOptionDetail() {
  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      px={"20px"}
      pt={"16.5px"}
      pb={"15.5px"}
      borderRadius={"8px"}
      backgroundImage={`url('${FWoptionBg.src}')`}
      backgroundSize='cover'
      backgroundRepeat='no-repeat'
      cursor='not-allowed'
    >
      <Box>
        <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
          Cross Trade Bridge
        </Text>
        <Box
          mt={"13px"}
          bg={"#3C2D31"}
          width={"141px"}
          height={"44px"}
          borderRadius={"8px"}
          backgroundImage={`url('${FWoptionButtonBg.src}')`}
          backgroundSize='cover'
          backgroundRepeat='no-repeat'
          gap={"8px"}
          px={"16px"}
          py={"10px"}
        >
          <Text
            fontWeight={600}
            fontSize={"16px"}
            lineHeight={"24px"}
            color={"#DB00FF"}
            textAlign='center'
          >
            Coming soon
          </Text>
        </Box>
        <Box mt={"20px"}>
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
