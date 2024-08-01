import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { Field } from "@/types/swap/swap";
import BgImageButton from "assets/image/BridgeSwap/selectTokenBg.svg";

export function SelectCardButton(props: { field: Field }) {
  const { field } = props;
  const { onOpenInToken, onOpenOutToken } = useTokenModal();

  return (
    <Flex
      w={"562px"}
      h={"100px"}
      alignItems={"center"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={() => (field === "INPUT" ? onOpenInToken() : onOpenOutToken())}
      pos={"relative"}
    // zIndex={Overlay_Index}
    >
      <Image
        src={BgImageButton}
        alt={"BgImageButton"}
        style={{ position: "absolute" }}
      />
      <Text
        color={"#FFFFFF"}
        fontSize={24}
        fontWeight={"semibold"}
        zIndex={100}
        mt={"10px"}
      >
        Select Token
      </Text>
    </Flex>
  );
}