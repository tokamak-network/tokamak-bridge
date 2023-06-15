import { Flex, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import LockIcon from "@/assets/icons/lockIcon.svg";
import LockIconDisabled from "@/assets/icons/lockIconDisabled.svg";

type TokenInputWarningProps = {
  hasPool: boolean;
  invalidPriceRange: boolean;
};

export default function TokenInputWarning(props: TokenInputWarningProps) {
  const { hasPool, invalidPriceRange } = props;
  return (
    <Flex w={"186px"} flexDir={"column"} pl="10px" mt="18px" pb="20px">
      {invalidPriceRange && (
        <>
          <Box alignItems={"left"} mb="10px">
            <Image src={LockIconDisabled} alt={"LockIcon"}></Image>
          </Box>
          <Text textAlign={"left"} fontSize={12} color="#8E8E92">
            The market price is outside your specified price range. Single-asset
            deposit only.
          </Text>
        </>
      )}
      {!hasPool && (
        <>
          <Box alignItems={"left"} mb="10px">
            <Image src={LockIcon} alt={"LockIcon"}></Image>
          </Box>
          <Text textAlign={"left"} fontSize={12}>
            The market price is outside your specified price range. Single-asset
            deposit only.
          </Text>
        </>
      )}
    </Flex>
  );
}
