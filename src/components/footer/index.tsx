import { Flex, Box, Text } from "@chakra-ui/react";
import useMediaView from "@/hooks/mediaView/useMediaView";
import dayjs from "dayjs";

const Footer = () => {
  const { pcView } = useMediaView();

  return (
    <Flex
      // pos={"absolute"}
      // bottom={6}
      mt={"auto"}
      pt={pcView ? 0 : 5}
      bottom={pcView ? 6 : 0}
      w={"full"}
      minH={pcView ? "77px" : ""}
      maxH={pcView ? "77px" : ""}
      justify={"center"}
      alignItems={"center"}
      position={pcView ? "absolute" : "initial"}
    >
      <Text fontSize={pcView ? 14 : 12} color={"#A0A3AD"}>
        Copyright © {dayjs().year()}{" "}
        <span style={{ color: "#007AFF" }}>Tokamak Network</span> All Rights
        Reserved.
      </Text>
    </Flex>
  );
};

export default Footer;
