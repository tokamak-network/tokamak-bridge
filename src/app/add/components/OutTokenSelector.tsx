import TokenCard from "@/components/card/TokenCard";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { selectedOutTokenStatus, actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import TokenInput from "@/components/input/TokenInput";
import "@/css/pools/layers.css";
import TokenInputWarning from "./TokenInputWarn";

export default function OutTokenSelector() {
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);
  const { onOpenOutToken } = useTokenModal();

  return (
    <Flex
      w={"198px"}
      h={"242px"}
      pos={"relative"}
      mt={"12px"}
      mb={"16px"}
      ml={"9px"}
    >
      <Flex className="top-layer" pos={"relative"} zIndex={100}>
        <Flex
          w={"100%"}
          h={"100%"}
          display={"flex"}
          flexDir={"column"}
          rowGap={"70px"}
          onClick={onOpenOutToken}
        >
          {outTokenInfo?.tokenName ? (
            <TokenCard
              w={"100%"}
              h={"100%"}
              hasInput={true}
              tokenInfo={outTokenInfo}
              inNetwork={false}
            ></TokenCard>
          ) : (
            <>
              <Flex
                w={"100%"}
                h={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                fontSize={20}
                fontWeight={500}
              >
                <SearchToken />
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
      <Box className={"mid-layer"} />
      <Box className={"bottom-layer"} />
      {/* TODO: Show warning if price range invalid / no pool data */}
      <Flex position={"absolute"} mt={"258px"}>
        <TokenInput inToken={false} inputKey="out" />
      </Flex>
      {/* <Flex position={"absolute"} mt={"258px"}>
        <TokenInputWarning hasPool={true} invalidPriceRange={true} />
      </Flex> */}
    </Flex>
  );
}
