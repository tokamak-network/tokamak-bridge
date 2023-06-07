import TokenCard from "@/components/card/TokenCard";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { selectedInTokenStatus, actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import TokenInput from "@/components/input/TokenInput";

export default function InTokenSelector() {
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const { onOpenInToken } = useTokenModal();

  return (
    <Flex flexDir={"column"} rowGap={"28px"}>
      <Box
        w={"186px"}
        h={"242px"}
        mt={"12px"}
        mb={"16px"}
        onClick={onOpenInToken}
      >
        {inTokenInfo?.tokenName ? (
          <TokenCard tokenInfo={inTokenInfo} hasInput={true} inNetwork={true} />
        ) : (
          <Box
            className="pool-card card-empty"
            display={"flex"}
            flexDir={"column"}
            rowGap={"70px"}
            w={"100%"}
            h={"100%"}
          >
            <SearchToken />
          </Box>
        )}
      </Box>
      {/* <TokenInput inToken={true} /> */}
    </Flex>
  );
}
