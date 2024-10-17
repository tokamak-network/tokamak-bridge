import { Flex, Text } from "@chakra-ui/layout";
import Image from "next/image";
import ICON_SEARCH from "assets/icons/search.svg";
import { useRecoilValue } from "recoil";
import { bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutNetwork } from "@/hooks/network";

export default function SearchToken(props: { onClick?: () => any }) {
  const status = useRecoilValue(bannerStatus);
  const { inNetwork, outNetwork } = useInOutNetwork();

  const isL2 = inNetwork?.layer === "L2" || outNetwork?.layer === "L2";
  const deactivateButton = status === "Active" && isL2; //disable search tokens UI when the maintenance banner is active and the action is L2

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      rowGap={"14px"}
      w={"100%"}
      h={"100%"}
      cursor={"pointer"}
      onClick={props?.onClick}
      opacity={deactivateButton ? 0.2 : 1}
    >
      <Text fontSize={18} fontWeight={500}>
        Search Tokens
      </Text>
      <Image
        src={ICON_SEARCH}
        alt={"ICON_SEARCH"}
        style={{ width: "24px", height: "24px" }}
      />
    </Flex>
  );
}
