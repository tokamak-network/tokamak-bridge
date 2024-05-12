import { Box, Checkbox, Button, Text, Flex, Center } from "@chakra-ui/react";
import ThanosSymbol_bg from "assets/icons/fw/thanos_symbol_bg_white.svg";
import txlink from "@/assets/icons/fw/txlink.svg";
import Image from "next/image";

export default function FwConfirmHistoryFooter() {
  return (
    <>
      <Box
        mt={"16px"}
        bg='#15161D'
        py={"12px"}
        border={"1px, 1px, 0px, 1px"}
        borderRadius={"8px"}
      >
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          px={"12px"}
        >
          <Flex>
            <Box
              display='inline-block'
              mt={"16px"}
              mb={"15px"}
              width='9px'
              height='9px'
              bgColor='#03D187'
              borderRadius='full'
            />
            <Text
              my={"8px"}
              ml={"12px"}
              fontWeight={500}
              fontSize={"15px"}
              lineHeight={"24px"}
              color={"#A0A3AD"}
            >
              Request
            </Text>
            <Center
              ml={"6px"}
              width='16px'
              height='16px'
              bg={"#000000"}
              borderRadius='2px'
              opacity={"50%"}
              my={"12px"}
            >
              <Image src={ThanosSymbol_bg} alt={"ThanosSymbol_bg"} />
            </Center>
          </Flex>
          <Flex my={"13px"}>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              lineHeight={"26px"}
              color={"#A0A3AD"}
              mr={"4px"}
            >
              Transaction
            </Text>
            <Image src={txlink} alt={"txlink"} />
          </Flex>
        </Flex>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          px={"12px"}
          mt={"16px"}
        >
          <Flex>
            <Box
              display='inline-block'
              mt={"16px"}
              mb={"15px"}
              width='9px'
              height='9px'
              bgColor='#007AFF'
              borderRadius='full'
            />
            <Text
              my={"8px"}
              ml={"12px"}
              fontWeight={500}
              fontSize={"15px"}
              lineHeight={"24px"}
              color={"#FFFFFF"}
            >
              Wait
            </Text>
          </Flex>
          <Flex my={"13px"}>
            <Text
              fontWeight={400}
              fontSize={"13px"}
              lineHeight={"19.5px"}
              color={"#FFFFFF"}
              mr={"4px"}
            >
              ~ 3 min
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Box height={"15px"} mt={"12px"} textAlign={"right"}>
        <Text
          fontWeight={400}
          fontSize={"10px"}
          lineHeight={"15px"}
          color={"#797B80"}
        >
          Cancel Cross Trade
        </Text>
      </Box>
    </>
  );
}
