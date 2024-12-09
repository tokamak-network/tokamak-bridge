import {
  ClaimableListPlanURL,
  WithdrawAssetsGuideURL,
  TitanSunSetGuideURL,
} from "@/constant/url";
import { BridgeShutdownDate } from "@/staging/constants/legacyTitan";
import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

export const Banner11Component = () => {
  const daysLeft = Math.floor(
    (BridgeShutdownDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
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
          Claimable list plan
        </Text>
        <Text fontSize={"11px"} color={"#0F0F12"} fontWeight={400}>
          Read about it more{" "}
          <a
            href={ClaimableListPlanURL}
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            here
          </a>
          . The exact date will be announced soon.
        </Text>
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
            Tokamak Bridge to be shutdown
          </Text>
          <Text w={"320px"} fontSize={"11px"} color={"#FFF"} fontWeight={400}>
            Make sure to withdraw your assets using Tokamak Bridge by end of
            January 2025. See this{" "}
            <a
              href={WithdrawAssetsGuideURL}
              target="_blank"
              style={{ textDecoration: "underline" }}
            >
              guide
            </a>{" "}
            .
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
