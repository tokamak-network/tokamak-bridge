import TokenCard from "@/components/card/TokenCard";
import NetworkDropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import useCustomModal from "@/hooks/modal/useCustomModal";
import { SelectedInTokenStatus, actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

export default function InToken() {
  const inTokenInfo = useRecoilValue(SelectedInTokenStatus);
  const mode = useRecoilValue(actionMode);
  const { onOpenInToken } = useCustomModal();

  return (
    <Flex flexDir={"column"} rowGap={"40px"}>
      {mode && (
        <Text fontSize={36} fontWeight={"semibold"}>
          {mode}
        </Text>
      )}
      {inTokenInfo?.tokenName ? (
        <TokenCard tokenInfo={inTokenInfo} hasInput={true} inNetwork={true} />
      ) : (
        <Box
          className="card card-empty"
          pt={"15px"}
          display={"flex"}
          flexDir={"column"}
          rowGap={"70px"}
          onClick={() => onOpenInToken()}
        >
          <Flex justifyContent={"flex-end"} pr={"16px"}>
            <NetworkDropdown inNetwork={true} />
          </Flex>
          <SearchToken />
        </Box>
      )}
    </Flex>
  );
}
