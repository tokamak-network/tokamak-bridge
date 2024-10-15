import { Flex, Text } from "@chakra-ui/react";

const ServiceSuspensionBanner = () => {
  return (
    <Flex
      h="76px"
      w="590px"
      bg={"#DD3A44"}
      flexDir={"column"}
      borderRadius={"5px"}
      color={"#fff"}
      p="16px"
      mb={"10px"}
    >
      <Text fontSize={"14px"}>
        Titan Network is currently experiencing an unexpected high demand
      </Text>
      <Text fontSize={"10px"}>
        {" "}
        Swap, deposit, initiate withdraw are disabled until further notice.
        Check{" "}
        <a
          href={"https://twitter.com/Tokamak_Network"}
          target="_blank"
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          https://twitter.com/Tokamak_Network
        </a>{" "}
        for live updates.
      </Text>
    </Flex>
  );
};
export default ServiceSuspensionBanner;
