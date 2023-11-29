import { Flex, Text } from "@chakra-ui/react";
import PoolList from "./components/PoolList";
import { useAccount } from "wagmi";
import { useGetPositionIds } from "@/hooks/pool/useGetPositionIds";

export default function YourPools() {
  const { isConnected } = useAccount();
  const { positions } = useGetPositionIds();

  const isReducedHeight = !isConnected || positions?.length === 0;

  return (
    <Flex flexDir="column" alignSelf={"baseline"}>
      <Text fontSize={36} fontWeight="medium" marginBottom="24px">
        Your Pools
      </Text>
      <Flex
        w="672px"
        h={isReducedHeight ? "440px" : "600px"}
        alignItems="flex-start"
        p={"20px"}
        pr={"0px"}
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
      {/* <LoadingModal /> */}
    </Flex>
  );
}
