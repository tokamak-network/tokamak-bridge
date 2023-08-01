import { Flex, Text } from "@chakra-ui/react";
import PoolList from "./components/PoolList";
import { useAccount } from "wagmi";

export default function YourPools() {
  const { isConnected } = useAccount();
  return (
    <Flex flexDir="column" alignSelf={"baseline"} mt={"180px"}>
      <Text fontSize={36} fontWeight="medium" marginBottom="24px">
        Your Pools
      </Text>
      <Flex
        w="673px"
        h={isConnected ? "600px" : "400px"}
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
