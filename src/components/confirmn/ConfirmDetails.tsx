import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Network } from "@/components/historyn/types";
import NetworkSymbol from "@/components/confirmn/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import TxLink from "@/assets/icons/confirm/link.svg";
import exp from "constants";

interface ConfirmDetail {
  direction: "send" | "receive";
}

export default function ConfirmDetails(props: ConfirmDetail) {
  const { direction } = props;

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      mt={direction !== "send" ? "16px" : undefined}
    >
      <Box>
        <Text
          fontWeight={500}
          fontSize={"14px"}
          lineHeight={"21px"}
          color={"#FFFFFF"}
        >
          {direction === "send" ? "Send" : "Receive"}
        </Text>
        <Flex mt={"4px"}>
          <NetworkSymbol networkI={Network.Titan} networkH={14} networkW={14} />
          <Text
            ml={"6px"}
            fontWeight={400}
            fontSize={"11px"}
            lineHeight={"14px"}
            color={"#A0A3AD"}
          >
            Titan
          </Text>
        </Flex>
      </Box>
      <Box>
        <Flex>
          <Flex alignItems={"center"}>
            <TokenSymbol w={24} h={24} tokenType={"ETH"} />
          </Flex>
          <Box ml={"8px"}>
            <Flex>
              <Text
                mr={"6px"}
                fontWeight={600}
                fontSize={"16px"}
                lineHeight={"24px"}
                color={"#FFFFFF"}
              >
                2.0123409 ETH
              </Text>
              <Flex alignItems={"center"}>
                <Image src={TxLink} alt={"TxLink"} />
              </Flex>
            </Flex>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              lineHeight={"18px"}
              color={"#A0A3AD"}
            >
              $000.00
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
