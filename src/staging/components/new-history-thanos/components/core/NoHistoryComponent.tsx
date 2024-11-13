import NoHistoryIcon from "@/assets/icons/no_history_warning.svg";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
export const NoHistoryComponent: React.FC = () => {
  return (
    <Flex
      justifyContent={"center"}
      height={"100%"}
      flexDir={"column"}
      alignItems={"center"}
      gap={"24px"}
    >
      <Image
        src={NoHistoryIcon}
        alt={"Transaction history is not available."}
      />
      <Text
        color={"#E3F3FF"}
        fontWeight={500}
        fontSize={"16px"}
        lineHeight={"24px"}
      >
        Text
      </Text>
    </Flex>
  );
};
