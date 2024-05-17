import Image from "next/image";
import { Box, Flex, Text, Center, HStack } from "@chakra-ui/react";
import ThanosSymbol from "assets/icons/fw/thanos_symbol.svg";
import GasStationSymbol from "assets/icons/fw/gas_station_fw.svg";

export default function FwRefundDetail() {
  return (
    <Box mt={"16px"}>
      <Text
        fontSize={"12px"}
        fontWeight={500}
        color={"#A0A3AD"}
        lineHeight={"18px"}
      >
        Refund
      </Text>
      <Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"32px"} fontWeight={600} lineHeight={"48px"}>
            10 USDC
          </Text>
          <Center width='32px' height='32px' bg={"#FFFFFF"} borderRadius='2px'>
            <Image src={ThanosSymbol} alt={"ThanosSymbol"} />
          </Center>
        </Flex>
      </Box>
      <Text
        fontWeight={400}
        fontSize={"14px"}
        lineHeight={"21px"}
        py={"1px"}
        color={"#E3E4C0"}
      >
        <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>(</span>
        $99.00
        <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>)</span>
      </Text>
      <Box mt={"16px"} borderTop='1px solid #313442' pt={"16px"} px={0} pb={0}>
        <HStack justify='space-between' lineHeight={"18px"} mt={"6px"}>
          <Flex>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              color={"#A0A3AD"}
              mr={"2px"}
            >
              Network fee on Ethereum
            </Text>
          </Flex>
          <Flex>
            <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
            <Text fontWeight={600} fontSize={"12px"} mx={"4px"}>
              0.16 TON
            </Text>
            <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>(</span>
              0.16 TON
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>)</span>
            </Text>
          </Flex>
        </HStack>
      </Box>
    </Box>
  );
}
