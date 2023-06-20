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
import useConfirmModal from "@/hooks/modal/useConfirmModal";
import CloseButton from "@/components/button/CloseButton";
import Setting from "@/components/Setting";
import { useGetMode } from "@/hooks/mode/useGetMode";

export const SelectedNetwork = () => {
  const { outNetwork } = useInOutNetwork();

  return (
    <Box
      className="card card-empty"
      display={"flex"}
      flexDir={"column"}
      rowGap={"28px"}
      justifyContent={"center"}
      alignItems={"center"}
      mt={"15px"}
    >
      <ImageSymbol
        ImgFile={outNetwork?.networkImage as ImageFileType}
        w={48}
        h={48}
      />
      <Text w={"156px"} maxH={"44px"} textAlign={"center"}>
        {outNetwork?.chainName}
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
  const { isOpen, onCloseConfirmModal } = useConfirmModal();

  const NetworkSwitcher = useMemo(() => {
    return (
      <Box minW={"200px"} h={"32px"}>
        <NetworkDropdown inNetwork={false} height="32px" />
      </Box>
    );
  }, []);

  return (
    <Flex flexDir={"column"} rowGap={"28px"}>
      <Flex justifyContent={"space-between"}>
        <Text fontSize={36} fontWeight={"semibold"} h={"54px"}>
          {isOpen ? "" : mode === "Swap" ? "For" : "To"}
        </Text>
        {isOpen ? <CloseButton onClick={onCloseConfirmModal} /> : <Setting />}
      </Flex>

      <Flex className="card-wrapper" w={"224px"} h={"386px"}>
        {NetworkSwitcher}
        {swapSection && <SearchTokenComponent />}
        {(mode === "Deposit" || mode === "Withdraw") && <SelectedNetwork />}
        {swapSection && (
          <TokenInput
            inToken={false}
            isDisabled={false}
            style={{
              marginTop: "16px",
              widht: "100%",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}
