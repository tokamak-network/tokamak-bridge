"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import Image from "next/image";
import foreignSVG from "@/assets/icons/foreign.svg";

export default function LPGuide() {
  return (
    <Flex
      flexDir="column"
      border="1px solid #20212B"
      w="200px"
      h="248px"
      paddingTop={"32px"}
      paddingBottom={"24px"}
      marginRight={"16px"}
      borderRadius={"16px"}
      alignItems="center"
      textAlign="center"
    >
      <Text fontWeight="semibold" marginBottom={"61px"} fontSize={"16px"}>
        Read your LP Guide
      </Text>
      <Image src={foreignSVG} alt={"unionImage"} />
      <Box
        width="100%"
        fontStyle="normal"
        fontWeight={400}
        fontSize="12px"
        lineHeight="18px"
        color="#A0A3AD"
        marginTop={"40px"} // ! sizes does not match for 54px
      >
        To learn more about <br />
        providing liquidity
      </Box>
    </Flex>
  );
}
