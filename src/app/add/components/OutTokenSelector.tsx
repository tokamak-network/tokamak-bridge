import TokenCard from "@/components/card/TokenCard";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { selectedInTokenStatus, actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import TokenInput from "@/components/input/TokenInput";
import "@/css/pools/layers.css";

export default function OutTokenSelector() {
  const outTokenInfo = useRecoilValue(selectedInTokenStatus);
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
        <Box
          w={"100%"}
          h={"100%"}
          display={"flex"}
          flexDir={"column"}
          rowGap={"70px"}
        >
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
        </Box>
      </Flex>
      <Box className={"mid-layer"} />
      <Box className={"bottom-layer"} />
    </Flex>
  );
}
