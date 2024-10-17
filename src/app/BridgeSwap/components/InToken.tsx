import TokenCard from "@/components/card/TokenCard";
import NetworkDropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import TokenInput from "@/components/input/TokenInput";
import { useMemo } from "react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

export default function InToken() {
  const { inToken } = useInOutTokens();
  const { mode } = useRecoilValue(actionMode);
  const { onOpenInToken } = useTokenModal();

  const NetworkSwitcher = useMemo(() => {
    return (
      <Box w={"200px"} h={"32px"}>
        <NetworkDropdown inNetwork={true} width={"200px"} height="32px" />
      </Box>
    );
  }, []);

  return (
    <Flex flexDir={"column"} rowGap={"28px"}>
      <Flex pos={"relative"} h={"54px"}>
        {mode && (
          <Text
            w={"300px"}
            fontSize={36}
            fontWeight={"semibold"}
            pos={"absolute"}
          >
            {mode.replaceAll("ETH-", "")}
          </Text>
        )}
      </Flex>
      <Flex className="card-wrapper" minW={"224px"} minH={"386px"}>
        {NetworkSwitcher}
        <Box
          w={"200px"}
          h={"248px"}
          mt={"12px"}
          mb={"16px"}
          onClick={onOpenInToken}
        >
          {inToken?.tokenName ? (
            <TokenCard
              tokenInfo={inToken}
              hasInput={true}
              inNetwork={true}
              forBridge={true}
              watch={true}
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
        <Flex px={"12px"} mb={"-16px"}>
          {inToken !== null && (
            <TokenInput inToken={true} hasMaxButton={true} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
