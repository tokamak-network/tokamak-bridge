import { Flex, Text } from "@chakra-ui/react";
import PoolList from "./components/PoolList";

export default function YourPools() {
  return (
    <Flex flexDir="column">
      <Text fontSize={36} fontWeight="medium" marginBottom="24px">
        Your Pools
      </Text>
      <Flex
        w="673px"
        h="600px"
        alignItems="flex-start"
        padding="16px"
        border="1px solid #313442"
        borderRadius="13px"
        overflowY={"auto"}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "4px",
          },
          "::-webkit-scrollbar-thumb": {
            background: "#343741",
            borderRadius: "3px",
          },
        }}
      >
        <PoolList />
      </Flex>
    </Flex>
  );
}
