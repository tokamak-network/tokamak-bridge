import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import TITLE_IMAGE from "assets/image/mobile/Title.svg";

export default function MobileView() {
  return (
    <Flex
      flexDir={"column"}
      alignItems={"center"}
      w={"360px"}
      textAlign={"center"}
    >
      <Image
        src={LOGO_IMAGE}
        alt={"logo"}
        style={{ width: "53px", height: "51px" }}
      />
      <Image
        src={TITLE_IMAGE}
        alt={"TITLE_IMAGE"}
        style={{ marginTop: "12px", marginBottom: "24px" }}
      />
      <Text
        color={"#A0A3AD"}
        fontSize={14}
        fontWeight={400}
        lineHeight={"24px"}
      >
        Window size is smaller than minimum requirements for Tokamak Bridge.
      </Text>
      <Text>Try increasing the browser window.</Text>
    </Flex>
  );
}
