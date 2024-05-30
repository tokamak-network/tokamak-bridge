import { Flex, Box, Text } from "@chakra-ui/react";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

const Footer = () => {
  const { pcView } = useMediaView();
  // Change footer background color when 'pool' is in the path. To be removed after ad ends. @Robert
  const pathname = usePathname();
  const isPoolsRoute = pathname === "/pools";

  return pcView ? (
    <Flex
      bottom={0}
      mt={"auto"}
      pt={pcView ? 0 : 5}
      w={"full"}
      minH={pcView ? "77px" : ""}
      maxH={pcView ? "77px" : ""}
      justify={"center"}
      alignItems={"center"}
      position={pcView ? "relative" : "initial"}
      // To be removed after ad ends. @Robert
      bg={isPoolsRoute ? "#17181D" : undefined}
    >
      <Text fontSize={pcView ? 14 : 12} color={"#A0A3AD"}>
        Copyright © {dayjs().year()}{" "}
        <span style={{ color: "#007AFF" }}>Tokamak Network</span> All Rights
        Reserved.
      </Text>
    </Flex>
  ) : (
    // When in mobile view, there is no footer.
    // A box is placed to maintain the background color while scrolling with a finger. @Robert
    <Box
      position='fixed'
      top='0'
      right='0'
      bottom='0'
      left='0'
      zIndex={-1}
      bg={"#0F0F12"}
    ></Box>
  );
};

export default Footer;
