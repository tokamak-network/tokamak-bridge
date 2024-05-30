import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import Image from "next/image";
import TxLink from "@/assets/icons/newHistory/link.svg";
import EthTokenSymbol from "@/assets/icons/newHistory/eth-t-symbol.svg";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";

export default function AccountHistoryNew() {
  return (
    <Box
      w={"336px"}
      h={"126px"}
      px={"12px"}
      py={"8px"}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={600}
          fontSize={"14px"}
          lineHeight={"22px"}
          color={"#FFFFFF"}
        >
          Withdraw
        </Text>
        <Image src={TxLink} alt={"TxLink"} />
      </Flex>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"12px"}
        py={"4px"}
        my={"4px"}
        borderRadius={"6px"}
        border={"1px solid rgba(0, 122, 255, 0.40)"}
      >
        <Flex>
          <Image src={EthTokenSymbol} alt={"EthTokenSymbol"} />
          <Box ml={"6px"}>
            <Text
              fontWeight={400}
              fontSize={"9px"}
              lineHeight={"13.5px"}
              color={"#A0A3AD"}
            >
              eth
            </Text>
            <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
              0.01234
            </Text>
          </Box>
        </Flex>
        <Box>
          <Flex alignItems='center'>
            <Image src={EthNetworkSymbol} alt={"EthNetworkSymbol"} />
            <Box mx={"6px"}>
              <Image src={Arrow} alt={"Arrow"} />
            </Box>
            <Image src={TitanNetworkSymbol} alt={"TitanNetworkSymbol"} />
          </Flex>
        </Box>
      </Flex>
      <Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex alignItems='center'>
            <Circle size='6px' bg={"#007AFF"} />
            <Text
              ml={"6px"}
              fontSize={"11px"}
              fontWeight={600}
              lineHeight={"22px"}
              color={"#A0A3AD"}
            >
              Initiate
            </Text>
          </Flex>
          <Text
            fontSize={"11px"}
            fontWeight={400}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            2023.04.03
          </Text>
        </Flex>
        {/* 반복되는 내용 */}
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex alignItems='center'>
            <Circle size='6px' bg={"#007AFF"} />
            <Text
              ml={"6px"}
              fontSize={"11px"}
              fontWeight={600}
              lineHeight={"22px"}
              color={"#A0A3AD"}
            >
              Finalize
            </Text>
          </Flex>
          <Text
            fontSize={"11px"}
            fontWeight={400}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            00 : 00
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
