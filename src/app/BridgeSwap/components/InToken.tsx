import TokenCard from "@/components/card/TokenCard";
import Dropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import { SelectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

export default function InToken() {
  const inTokenInfo = useRecoilValue(SelectedInTokenStatus);

  return (
    <Flex flexDir={"column"} rowGap={"40px"}>
      <Text fontSize={36} fontWeight={"semibold"}>
        Swap
      </Text>
      {inTokenInfo?.tokenName ? (
        <TokenCard tokenInfo={inTokenInfo} />
      ) : (
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
      )}
    </Flex>
  );
}
