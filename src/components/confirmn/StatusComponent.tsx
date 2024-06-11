import { Box, Flex, Text, Link } from "@chakra-ui/react";
import TxLink from "@/assets/icons/confirm/link.svg";
import Image from "next/image";

export default function StatusComponent() {
  return (
    <Flex h={"38px"} justifyContent={"space-between"} alignItems={"flex-start"}>
      <Text
        fontWeight={600}
        fontSize={"17px"}
        lineHeight={"20px"}
        color={"#A0A3AD"}
      >
        Initiate
      </Text>
      <Flex alignItems={"center"}>
        <Text
          mr={"4px"}
          fontWeight={400}
          fontSize={"13px"}
          lineHeight={"20px"}
          color={"#A0A3AD"}
        >
          Transaction
        </Text>
        <Flex w={"14px"} h={"14px"}>
          <Image src={TxLink} alt={"TxLink"} />
        </Flex>
      </Flex>
    </Flex>
  );
}
