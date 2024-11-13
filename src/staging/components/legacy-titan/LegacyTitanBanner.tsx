import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
const LegacyTitanBanner = () => {
  const { mode } = useRecoilValue(actionMode);
  return (
    <Flex
      px={"16px"}
      py={"12px"}
      bgColor={"#DD3A44"}
      borderRadius={"8px"}
      flexDir={"column"}
      width={"496px"}
      mb={"64px"}
    >
      <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
        Tokamak Bridge's Titan Network has been terminated.
      </Text>
      <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
        Please withdraw your assets immediately.
      </Text>
    </Flex>
  );
};

export default LegacyTitanBanner;
