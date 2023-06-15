import { Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import WarnIcon from "@/assets/icons/warning.svg";

type WarningProps = {
  hasPool: boolean;
  invalidPriceRange: boolean;
};

export default function WarningText(props: WarningProps) {
  const { hasPool, invalidPriceRange } = props;
  return (
    <>
      <Flex mb={"20px"}>
        <Image src={WarnIcon} alt={"Warning"} />
        <Box w={"360px"} ml={"10px"}>
          {invalidPriceRange && (
            <Text fontSize={"13px"} textAlign={"left"} color={"#F9C03E"}>
              Invalid range selected. The min price must be lower than the max
              price.
            </Text>
          )}
          {!hasPool && (
            <Text fontSize={"13px"} textAlign={"left"} color={"#F9C03E"}>
              Your position will not earn fees or be used in trades until the
              market price moves into your range.
            </Text>
          )}
        </Box>
      </Flex>
    </>
  );
}
