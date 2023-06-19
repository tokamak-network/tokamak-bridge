import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import BackIcon from "@/assets/icons/back.svg";

export default function InfoHeader() {
  return (
    <Link href="/pools">
      <Flex mb={"10px"} w="100%">
        <Image src={BackIcon} alt="Back" />
        <Text fontSize="28px" fontWeight="normal" ml={"14px"}>
          Liquidity Info
        </Text>
      </Flex>
    </Link>
  );
}
