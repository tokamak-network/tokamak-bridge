import NetworkDropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import { Box, Flex, Text } from "@chakra-ui/layout";
import ImageSymbol from "@/components/image/TokenSymbol";
import { useInOutNetwork } from "@/hooks/network";
import { ImageFileType } from "@/types/style/imageFileType";
import TokenInput from "@/components/input/TokenInput";
import useTokenModal from "@/hooks/modal/useTokenModal";
import TokenCard from "@/components/card/TokenCard";
import { useMemo } from "react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import Setting from "@/components/Setting";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { convertNetworkName } from "@/utils/network/convertNetworkName";

export const SelectedNetwork = () => {
  const { outNetwork } = useInOutNetwork();

  return (
    <Box
      className="card card-empty"
      display={"flex"}
      flexDir={"column"}
      rowGap={"16px"}
      justifyContent={"center"}
      alignItems={"center"}
      mt={"15px"}
    >
      <ImageSymbol
        ImgFile={outNetwork?.networkImage as ImageFileType}
        w={48}
        h={48}
      />
      <Text
        w={"156px"}
        maxH={"44px"}
        fontSize={18}
        fontWeight={500}
        textAlign={"center"}
      >
        {convertNetworkName(outNetwork?.chainName)}
      </Text>
    </Box>
  );
};

export const SearchTokenComponent = () => {
  const { outToken } = useInOutTokens();

  const { onOpenOutToken } = useTokenModal();

  if (outToken?.tokenName) {
    return (
      <TokenCard
        h={"248px"}
        tokenInfo={outToken}
        hasInput={true}
        inNetwork={false}
        style={{ marginTop: "12px", minHeight: "248px" }}
        onClick={onOpenOutToken}
        forBridge={true}
        watch={true}
      />
    );
  }
  return (
    <Box
      className="card card-empty"
      display={"flex"}
      flexDir={"column"}
      rowGap={"70px"}
      mt={"12px"}
    >
      <SearchToken onClick={onOpenOutToken} />
    </Box>
  );
};

export default function OutToken() {
  const { mode, swapSection } = useGetMode();
  const { outToken } = useInOutTokens();

  const NetworkSwitcher = useMemo(() => {
    return (
      <Box minW={"200px"} h={"32px"}>
        <NetworkDropdown inNetwork={false} width={"200px"} height="32px" />
      </Box>
    );
  }, []);

  return (
    <Flex flexDir={"column"} rowGap={"28px"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text fontSize={36} fontWeight={"semibold"} h={"54px"}>
          {mode === "Swap" ? "For" : "To"}
        </Text>
        {mode === "Swap" && <Setting />}
      </Flex>

      <Flex className="card-wrapper" w={"224px"} h={"386px"}>
        {NetworkSwitcher}
        {swapSection && <SearchTokenComponent />}
        {(mode === "Deposit" || mode === "Withdraw") && <SelectedNetwork />}
        {outToken !== null && (
          <TokenInput
            inToken={false}
            isDisabled={false}
            style={{
              marginTop: "16px",
              width: "100%",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}
