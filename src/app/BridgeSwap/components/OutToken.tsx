import NetworkDropdown from "@/components/dropdown/Index";
import SearchToken from "@/components/search/SearchToken";
import { Box, Flex, Text } from "@chakra-ui/layout";
import Image from "next/image";
import SettingIcon from "assets/icons/setting.svg";
import { useRecoilValue } from "recoil";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import ImageSymbol from "@/components/image/TokenSymbol";
import useNetwork from "@/hooks/network";
import { ImageFileType } from "@/types/style/imageFileType";
import TokenInput from "@/components/input/TokenInput";

const SelectedNetwork = () => {
  const { inNetwork, outNetwork } = useNetwork();

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

const SearchTokenComponent = () => {
  return (
    <Box
      className="card card-empty"
      display={"flex"}
      flexDir={"column"}
      rowGap={"70px"}
    >
      <SearchToken />
    </Box>
  );
};

export default function OutToken() {
  const mode = useRecoilValue(actionMode);

  return (
    <Flex flexDir={"column"} rowGap={"40px"}>
      <Flex justifyContent={"space-between"}>
        <Text fontSize={36} fontWeight={"semibold"}>
          {mode === "Swap" ? "For" : "To"}
        </Text>
        <Image
          src={SettingIcon}
          alt={"SettingIcon"}
          style={{ cursor: "pointer" }}
        />
      </Flex>

      <Flex className="card-wrapper">
        <NetworkDropdown inNetwork={false} />
        {mode === "Swap" && <SearchTokenComponent />}
        {(mode === "Deposit" || mode === "Withdraw") && <SelectedNetwork />}
        <TokenInput style={{ marginTop: "16px" }} />
      </Flex>
    </Flex>
  );
}
