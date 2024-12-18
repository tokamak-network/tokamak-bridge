import { TitanSunSetGuideURL } from "@/constant/url";
import { TitanShutdownDate } from "@/staging/constants/legacyTitan";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export const Banner10Component = () => {
  const daysLeft = Math.ceil(
    (TitanShutdownDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  return (
    <Flex
      w={"520px"}
      flexDir={"column"}
      gap={"12px"}
      justifyContent={"center"}
      alignItems={"center"}
      mb={"48px"}
    >
      <Flex
        width={"100%"}
        px={"16px"}
        py={"10px"}
        borderRadius={"8px"}
        bg={"#DD3A44"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Flex flexDirection={"column"} w={"396px"}>
          <Text fontSize={"14px"} color={"#FFF"} fontWeight={500}>
            Titan to shut down in December 26th
          </Text>
          <Text fontSize={"11px"} color={"#FFF"} fontWeight={400}>
            L2 transactions will no longer be accepted. Read about it more{" "}
            <a
              href={TitanSunSetGuideURL}
              target="_blank"
              style={{ textDecoration: "underline" }}
            >
              here
            </a>
            .
          </Text>
        </Flex>
        <Flex>
          <Text fontSize={"16px"} color={"#FFF"}>
            <Text as="span" fontSize={"18px"} fontWeight={600}>
              {daysLeft}
            </Text>{" "}
            days Left
          </Text>
        </Flex>
      </Flex>
      <Flex
        px={"16px"}
        py={"10px"}
        borderRadius={"8px"}
        bg={"#DD3A44"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Flex flexDirection={"column"} w={"396px"}>
          <Text fontSize={"14px"} color={"#FFF"} fontWeight={500}>
            Pools and Cross Trade to shut down in December 26th
          </Text>
          <Text fontSize={"11px"} color={"#FFF"} fontWeight={400}>
            Other functions will continue with limited support until their final
            shutdown in January 13th, 2025
          </Text>
        </Flex>
        <Flex>
          <Text fontSize={"16px"} color={"#FFF"}>
            <Text as="span" fontSize={"18px"} fontWeight={600}>
              {daysLeft}
            </Text>{" "}
            days Left
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
