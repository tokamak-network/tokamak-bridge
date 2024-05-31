import { Flex, Box, Text, Circle } from "@chakra-ui/react";
import Image from "next/image";
import EthTokenSymbol from "@/assets/icons/newHistory/eth-t-symbol.svg";
import TxLink from "@/assets/icons/newHistory/link.svg";
import TokenPair from "@/componenets/historyn/drawer/TokenPair";

import {
  TransactionHistory,
  Action,
  Status,
  Network,
} from "@/componenets/historyn/types";

export default function Complete() {
  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={500}
          fontSize={"12px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          withdraw completed
        </Text>
        <TokenPair
          networkI={Network.Mainnet}
          networkO={Network.Titan}
          networkW={16}
          networkH={16}
        />
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
              ETH
            </Text>
            <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
              0.01234
            </Text>
          </Box>
        </Flex>
        <Text
          fontWeight={400}
          fontSize={"11px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          2023.04.03
        </Text>
      </Flex>
    </>
  );
}
