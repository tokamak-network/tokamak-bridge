import { Flex, Box, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

const Footer = () => {
  return (
    <Flex
      pos={"absolute"}
      bottom={6}
      w={"full"}
      justify={"center"}
      alignItems={"center"}
    >
        <Text fontSize={14} color={"#A0A3AD"}>
          Copyright © {dayjs().year()}{" "}
          <span style={{ color: "#007AFF" }}>Tokamak Network</span> All Rights
          Reserved.
        </Text>
    </Flex>
  );
};

export default Footer;