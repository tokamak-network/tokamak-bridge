import TokenCard from "@/components/card/TokenCard";
import Dropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import { Box, Flex, Text } from "@chakra-ui/layout";

export default function InToken() {
  return (
    <Flex flexDir={"column"} rowGap={"40px"}>
      <Text fontSize={36} fontWeight={"semibold"}>
        Swap
      </Text>
      <Box
        className="card card-empty"
        pt={"15px"}
        display={"flex"}
        flexDir={"column"}
        rowGap={"70px"}
      >
        <Flex justifyContent={"flex-end"} pr={"16px"}>
          <Dropdown />
        </Flex>
        <SearchToken />
      </Box>
      <TokenCard tokenName="TOK"></TokenCard>
    </Flex>
  );
}
