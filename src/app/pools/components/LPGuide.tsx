import { Flex, Text, Box } from "@chakra-ui/layout";
import Image from "next/image";
import LINK_ICON from "@/assets/icons/guideLink.svg";

export default function LPGuide() {
  return (
    <Flex
      flexDir="column"
      border="1px solid #20212B"
      w="200px"
      h="248px"
      paddingTop={"32px"}
      paddingBottom={"24px"}
      borderRadius={"16px"}
      justifyContent={"center"}
      alignItems="center"
      textAlign="center"
      _hover={{
        border: "1px solid #007AFF",
      }}
      cursor={"pointer"}
      onClick={() =>
        window.open(
          "https://docs.tokamak.network/home/02-service-guide/tokamak-bridge/pools"
        )
      }
    >
      <Text fontWeight="semibold" marginBottom={"61px"} fontSize={"16px"}>
        Read your LP Guide
      </Text>
      <Image src={LINK_ICON} alt={"LINK_ICON"} />
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
