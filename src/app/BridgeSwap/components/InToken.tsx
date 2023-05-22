import TokenCard from "@/components/card/TokenCard";
import NetworkDropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { selectedInTokenStatus, actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import CardWrapper from "@/bridgeComponent/CardWrapper";
import TokenInput from "@/components/input/TokenInput";

export default function InToken() {
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const mode = useRecoilValue(actionMode);
  const { onOpenInToken } = useTokenModal();

  return (
    <Flex flexDir={"column"} rowGap={"40px"}>
      {mode && (
        <Text fontSize={36} fontWeight={"semibold"}>
          {mode}
        </Text>
      )}
      <Flex className="card-wrapper">
        <NetworkDropdown inNetwork={true} />
        <Box
          w={"200px"}
          h={"248px"}
          mt={"12px"}
          mb={"16px"}
          onClick={onOpenInToken}
        >
          {inTokenInfo?.tokenName ? (
            <TokenCard
              tokenInfo={inTokenInfo}
              hasInput={true}
              inNetwork={true}
            />
          ) : (
            <Box
              className="card card-empty"
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
        <TokenInput inToken={true} />
      </Flex>
    </Flex>
  );
}
