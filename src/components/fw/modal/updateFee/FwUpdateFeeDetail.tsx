import {
  Box,
  Text,
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import FwDownArrow from "assets/icons/fw/fwDownArrow.svg";
import FwReCircle from "assets/icons/fw/fwReCircle.svg";
import GasStationSymbol from "assets/icons/fw/gas_station_fw.svg";
import FwUsdcSymbol from "assets/icons/fw/fwUsdcSymbol.svg";

export default function FwUpdateFeeDetail() {
  return (
    <Box
      width={"364px"}
      bg='#15161D'
      px={"16px"}
      py={"16px"}
      borderRadius={"8px"}
    >
      {/** 상위 버튼 */}
      <Flex
        width={"332px"}
        bg={"#1F2128"}
        border={"1px solid #DB00FF"}
        borderRadius={"32px"}
      >
        <Button
          width={"162px"}
          height={"32px"}
          bg='#DB00FF'
          borderRadius='16px'
          p={"6px 56.5px"}
          _active={{}}
          _hover={{}}
        >
          <Text
            color='#FFFFFF'
            fontSize={"12px"}
            lineHeight={"normal"}
            fontWeight={400}
          >
            Update Fee
          </Text>
        </Button>
        <Button
          width={"162px"}
          height={"32px"}
          borderRadius={"16px"}
          bg={"#transparent"}
          p={"6px 69.5px"}
          _active={{}}
          _hover={{}}
        >
          <Text
            color='#A0A3AD'
            fontSize={"12px"}
            lineHeight={"normal"}
            fontWeight={400}
          >
            Refund
          </Text>
        </Button>
      </Flex>
      <Box
        mt={"16px"}
        p={"6px 16px"}
        border={"1px solid #313442"}
        borderRadius={"8px"}
      >
        <Text
          color={"#A0A3AD"}
          fontSize={"12px"}
          fontWeight={500}
          lineHeight={"normal"}
        >
          Current fee
        </Text>
        <Flex mt={"4px"} justifyContent='space-between'>
          <Text fontSize={"16px"} fontWeight={400} lineHeight={"normal"}>
            0.012
          </Text>
          <Flex>
            <Image src={FwUsdcSymbol} alt={"FwUsdcSymbol"} />
            <Text
              ml={"4px"}
              fontSize={"16px"}
              fontWeight={400}
              lineHeight={"normal"}
            >
              USDC
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex justifyContent={"center"} alignItems={"center"} my={"8px"}>
        <Image src={FwDownArrow} alt={"FwDownArrow"} />
      </Flex>
      <Box
        px={"16px"}
        py={"8px"}
        bg={"#1F2128"}
        borderRadius={"8px"}
        border={"1px solid #313442"}
      >
        <Flex justifyContent='space-between'>
          <Text
            lineHeight={"normal"}
            fontWeight={500}
            fontSize={"12px"}
            color={"#A0A3AD"}
          >
            New fee
          </Text>
          <Image src={FwReCircle} alt={"FwReCircle"} />
        </Flex>
        <InputGroup mt={"4px"}>
          <Input
            width={"260px"}
            pl={0}
            fontWeight={600}
            fontSize={"24px"}
            lineHeight={"38px"}
            border={"none"}
            _hover={{ border: "none" }}
            _focus={{ boxShadow: "none", border: "none" }}
          />
          <InputRightElement mr={"24px"}>
            <Flex>
              <Image src={FwUsdcSymbol} alt={"FwUsdcSymbol"} />
              <Text
                ml={"4px"}
                fontSize={"16px"}
                fontWeight={400}
                color={"#FFFFFF"}
                lineHeight={"24px"}
              >
                USDC
              </Text>
            </Flex>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box mt={"16px"}>
        <Flex justifyContent='space-between'>
          <Text
            color={"#A0A3AD"}
            fontSize={"12px"}
            fontWeight={400}
            lineHeight={"normal"}
          >
            Receive
          </Text>
          <Flex>
            <Text
              color={"#FFFFFF"}
              fontSize={"12px"}
              fontWeight={600}
              lineHeight={"normal"}
            >
              9.998 USDC
            </Text>
            <Flex
              ml={"6px"}
              px={"4px"}
              borderRadius={"4px"}
              alignItems={"center"}
              bg={"#DB00FF"}
            >
              <Text
                color={"#FFFFFF"}
                fontSize={"10px"}
                fontWeight={500}
                lineHeight={"normal"}
                letterSpacing={"1px"}
              >
                98.31
              </Text>
              <Text
                color={"#FFFFFF"}
                fontSize={"10px"}
                fontWeight={400}
                lineHeight={"normal"}
                letterSpacing={"1px"}
              >
                %
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex justifyContent='space-between' my={"6px"}>
          <Text
            color={"#A0A3AD"}
            fontSize={"12px"}
            fontWeight={400}
            lineHeight={"normal"}
          >
            Estimated Time of Arrival
          </Text>
          <Text
            color={"#DB00FF"}
            fontSize={"12px"}
            fontWeight={600}
            lineHeight={"normal"}
          >
            ~ 1 day
          </Text>
        </Flex>
        <Flex justifyContent='space-between'>
          <Text
            color={"#A0A3AD"}
            fontSize={"12px"}
            fontWeight={400}
            lineHeight={"normal"}
          >
            Network fee
          </Text>
          <Flex>
            <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
            <Text
              color={"#FFFFFF"}
              fontSize={"12px"}
              fontWeight={600}
              lineHeight={"normal"}
              mx={"4px"}
            >
              0.16 ETH
            </Text>
            <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>(</span>
              $0.43
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>)</span>
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
