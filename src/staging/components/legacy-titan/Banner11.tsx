import { ClaimableListAssetsURL, TitanSunSetGuideURL } from "@/constant/url";
import {
  BridgeShutdownDate,
  ClaimFeatureOpenDate,
} from "@/staging/constants/legacyTitan";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export const Banner11Component = () => {
  const claimFeatureOpenDaysLeft = Math.ceil(
    (ClaimFeatureOpenDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const daysLeft = Math.ceil(
    (BridgeShutdownDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return (
    <Flex
      w={"493px"}
      flexDir={"column"}
      gap={"12px"}
      alignItems={"center"}
      mb={"48px"}
      justifyContent={"space-between"}
    >
      <Flex
        width={"100%"}
        px={"16px"}
        py={"10px"}
        borderRadius={"8px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        bg={"#F9C03E"}
      >
        <Flex flexDir={"column"}>
          <Text fontSize={"14px"} color={"#0F0F12"} fontWeight={500}>
            Claimable list of assets locked in Titan is released.
          </Text>
          <Text fontSize={"11px"} color={"#0F0F12"} fontWeight={400}>
            List can be checked{" "}
            <a
              href={ClaimableListAssetsURL}
              target="_blank"
              style={{ textDecoration: "underline" }}
            >
              here
            </a>
            . Read about it more{" "}
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
          <Text fontSize={"16px"} color={"#0F0F12"}>
            <Text as="span" fontSize={"18px"} fontWeight={600}>
              {claimFeatureOpenDaysLeft}
            </Text>{" "}
            days Left
          </Text>
        </Flex>
      </Flex>
      <Flex
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"16px"}
        py={"10px"}
        borderRadius={"8px"}
        bg={"#DD3A44"}
      >
        <Flex flexDir={"column"}>
          <Text fontSize={"14px"} color={"#FFF"} fontWeight={500}>
            Tokamak Bridge to shut down in January 13th
          </Text>
          <Text w={"320px"} fontSize={"11px"} color={"#FFF"} fontWeight={400}>
            Read about it more{" "}
            <a
              href={TitanSunSetGuideURL}
              target="_blank"
              style={{ textDecoration: "underline" }}
            >
              here
            </a>
          </Text>
        </Flex>
        <Flex>
          <Text color={"FFF"} fontSize={"16px"}>
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
