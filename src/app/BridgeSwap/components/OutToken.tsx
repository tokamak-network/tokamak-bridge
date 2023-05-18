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

const SelectedNetwork = () => {
  const { inNetwork, outNetwork } = useNetwork();

  return (
    <Box
      className="card card-empty"
      pt={"15px"}
      display={"flex"}
      flexDir={"column"}
      rowGap={"28px"}
    >
      <Flex justifyContent={"flex-end"} pr={"16px"}>
        <NetworkDropdown inNetwork={false} />
      </Flex>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        fontSize={20}
        fontWeight={500}
        rowGap={"18px"}
      >
        <ImageSymbol
          ImgFile={outNetwork?.networkImage as ImageFileType}
          w={48}
          h={48}
        />
        <Text w={"156px"} maxH={"44px"} textAlign={"center"}>
          {outNetwork?.chainName}
        </Text>
      </Flex>
    </Box>
  );
};

const SearchTokenComponent = () => {
  return (
    <Box
      className="card card-empty"
      pt={"15px"}
      display={"flex"}
      flexDir={"column"}
      rowGap={"70px"}
    >
      <Flex justifyContent={"flex-end"} pr={"16px"}>
        <NetworkDropdown inNetwork={false} />
      </Flex>
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
      {mode === "Swap" && <SearchTokenComponent />}
      {(mode === "Deposit" || mode === "Withdraw") && <SelectedNetwork />}
    </Flex>
  );
}
