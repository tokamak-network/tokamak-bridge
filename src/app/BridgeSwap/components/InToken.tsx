import TokenCard from "@/components/card/TokenCard";
import NetworkDropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { selectedInTokenStatus, actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import CardWrapper from "@/bridgeComponent/CardWrapper";
import TokenInput from "@/components/input/TokenInput";
import { useMemo } from "react";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";

export default function InToken() {
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const { mode } = useRecoilValue(actionMode);
  const { onOpenInToken } = useTokenModal();

  const NetworkSwitcher = useMemo(() => {
    return (
      <Box w={"200px"} h={"32px"}>
        <NetworkDropdown inNetwork={true} height="32px" />
      </Box>
    );
  }, []);

  return (
    <Flex flexDir={"column"} rowGap={"28px"}>
      {mode && (
        <Text fontSize={36} fontWeight={"semibold"}>
          {mode}
        </Text>
      )}
      <Flex className="card-wrapper">
        {NetworkSwitcher}
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
        <Flex px={"12px"}>
          <TokenInput inToken={true} />
        </Flex>
      </Flex>
    </Flex>
  );
}
