import { Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import WarnIcon from "@/assets/icons/warning.svg";

export default function InvalidRange() {
  return (
    <>
      <Flex mb={"20px"} mt={"20px"}>
        <Image src={WarnIcon} alt={"Warning"} />
        <Box w={"360px"} ml={"10px"}>
          <Text fontSize={"13px"} textAlign={"left"} color={"#F9C03E"}>
            Invalid range selected. The min price must be lower than the max
            price.
          </Text>
        </Box>
      </Flex>
    </>
  );
}
