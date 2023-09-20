import { Flex, Text } from "@chakra-ui/react";

const ServiceSuspensionBanner = () => {
  return (
    <Flex
      h="76px"
      w="560px"
      bg={"#DD3A44"}
      flexDir={"column"}
      borderRadius={"5px"}
      color={"#fff"}
      p="16px"
      mb={"10px"}>
      <Text fontSize={"14px"}>Tokamak Bridge is under maintenance</Text>
      <Text fontSize={"10px"}>
        {" "}
        Due to unexpected service migration, we are temporarily halting Tokamak
        Bridge. Please check{" "}
        <a
          href={
            "https://onther.notion.site/2023-9-14-Tokamak-Bridge-Service-Migration-14e886a1443b41688887d1e4aff18def?pvs=4"
          }
          target="_blank"
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            cursor: "pointer",
          }}>
          here
        </a>{" "}
        for real-time updates.
      </Text>
    </Flex>
  );
};
export default ServiceSuspensionBanner;
