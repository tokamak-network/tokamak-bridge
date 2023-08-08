import { Flex } from "@chakra-ui/react";
import TierSelector from "./components/TierSelect";
import Title from "./components/Title";

export default function SelectFeeTier() {
  return (
    <Flex flexDir="column">
      <Title title="Select Fee" />
      <TierSelector />
    </Flex>
  );
}
