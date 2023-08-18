import NetworkDropdown from "@/components/dropdown/Index";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import Title from "./components/Title";

export default function SelectNetwork() {
  const NetworkSwitcher = useMemo(() => {
    return (
      <NetworkDropdown
        inNetwork={true}
        height="48px"
        width={"408px"}
        isPool={true}
      />
    );
  }, []);

  return (
    <Flex flexDir="column">
      <Title title="Select Network" />
      <Box w={"408px"} h={"48px"}>
        {NetworkSwitcher}
      </Box>
    </Flex>
  );
}
