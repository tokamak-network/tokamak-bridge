import { Box, Text, Flex, Circle } from "@chakra-ui/react";
import FWoptionBg from "@/assets/image/BridgeSwap/ct/ctOptionBg.png";
import CTOptionDisabledOptionBg from "@/assets/image/BridgeSwap/ct/ctOptionDisabledOptionBg.png";
import { BetaIcon } from "../../common/BetaIcon";

export default function CTOptionDisabledDetail() {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      px={"20px"}
      pt={"16.5px"}
      pb={"15.5px"}
      borderRadius={"8px"}
      bg={"#17181D"}
    >
      <Box>
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
        <Box
          mt={"13px"}
          bg={"#3C2D31"}
          width={"141px"}
          height={"44px"}
          borderRadius={"8px"}
          backgroundImage={`url('${CTOptionDisabledOptionBg.src}')`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          gap={"8px"}
          px={"16px"}
          py={"10px"}
        >
          <Text
            fontWeight={600}
            fontSize={"16px"}
            lineHeight={"24px"}
            color={"#DB00FF"}
            textAlign="center"
          >
            Not available
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
