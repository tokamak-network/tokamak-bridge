import NetworkDropdown from "@/components/dropdown/Index";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Title from "./components/Title";

export default function SelectNetwork() {
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const NetworkSwitcher = useMemo(() => {
    return <NetworkDropdown inNetwork={true} height="48px" isOpen={isOpen} setIsOpen={setIsOpen} />;
  }, [isOpen, setIsOpen]);

  return (
    <Flex flexDir="column">
      <Title title="Select Network" />
      <Box w={"408px"} h={"48px"}>
        {NetworkSwitcher}
      </Box>
    </Flex>
  );
}
