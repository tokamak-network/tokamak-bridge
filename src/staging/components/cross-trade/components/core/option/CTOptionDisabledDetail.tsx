import { Box, Text, Flex, Circle } from "@chakra-ui/react";
import FWoptionBg from "@/assets/image/BridgeSwap/ct/ctOptionBg.png";
import CTOptionDisabledOptionSubBg from "@/assets/image/BridgeSwap/ct/ctOptionButtonBg.png";
import CTOptionalDisabledOptionBg from "@/assets/image/BridgeSwap/ct/ctOptionBg.png";
import questionIcon from "@/assets/icons/questionGray.svg";
import Image from "next/image";

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
      backgroundImage={`url('${CTOptionalDisabledOptionBg.src}')`}
    >
      <Box>
        <Flex gap={"2px"}>
          <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
            Cross Trade Bridge
          </Text>
          <Image src={questionIcon} alt="" />
        </Flex>
        <Box
          mt={"13px"}
          bg={"#3C2D31"}
          borderRadius={"8px"}
          // backgroundImage={`url('${CTOptionDisabledOptionSubBg.src}')`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          gap={"8px"}
          px={"16px"}
          background={"rgba(21, 22, 29, 0.60);"}
          py={"10px"}
          maxWidth={"max-content"}
          overflow={"hidden"}
          position={"relative"}
        >
          <Text
            fontWeight={600}
            fontSize={"22px"}
            lineHeight={"24px"}
            color={"#DB00FF"}
            pos={"absolute"}
            minWidth={"max-content"}
            left={0}
            bottom={"-5px"}
            filter={"blur(3.5px)"}
            opacity={"0.5"}
          >
            9.988 USDC
          </Text>
          <Text
            fontWeight={600}
            fontSize={"16px"}
            lineHeight={"24px"}
            color={"#DB00FF"}
            textAlign="center"
            backdropFilter={"blur(3.5px);"}
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
    </Flex>
  );
}
