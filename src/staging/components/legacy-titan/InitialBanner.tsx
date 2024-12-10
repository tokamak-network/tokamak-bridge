import { TitanSunSetGuideURL } from "@/constant/url";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export const InitialBanner = () => {
  return (
    <Flex
      w={"493px"}
      flexDir={"column"}
      gap={"12px"}
      justifyContent={"center"}
      alignItems={"center"}
      mb={"48px"}
    >
      <Flex
        width={"100%"}
        flexDir={"column"}
        px={"16px"}
        py={"10px"}
        borderRadius={"8px"}
        bg={"#F9C03E"}
      >
        <Text fontSize={"14px"} color={"#0F0F12"} fontWeight={500}>
          Titan to shutown in December, 2024
        </Text>
        <Text fontSize={"11px"} color={"#0F0F12"} fontWeight={400}>
          Read about it more{" "}
          <a
            href={TitanSunSetGuideURL}
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            here
          </a>
          . The exact date will be announced soon.
        </Text>
      </Flex>
      <Flex
        flexDir={"column"}
        px={"16px"}
        py={"10px"}
        borderRadius={"8px"}
        bg={"#F9C03E"}
      >
        <Text fontSize={"14px"} color={"#0F0F12"} fontWeight={500}>
          Tokamak Bridge to shutdown in January, 2025
        </Text>
        <Text fontSize={"11px"} color={"#0F0F12"} fontWeight={400}>
          Pools and cross trade will shutdown in December, while other functions
          will continue with limited support until their final shutdown in
          January
        </Text>
      </Flex>
    </Flex>
  );
};
