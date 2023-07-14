import { WarningText } from "@/components/ui/WarningText";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { Flex } from "@chakra-ui/react";

export function WarningPool() {
  const { invalidRange } = useV3MintInfo();

  return (
    <Flex w={"384px"}>
      {invalidRange && (
        <WarningText label="Invalid range selected. The min price must be lower than the max price." />
      )}
    </Flex>
  );
}
