import { WarningText } from "@/components/ui/WarningText";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import useIsTon from "@/hooks/token/useIsTon";
import { Flex } from "@chakra-ui/react";

export function WarningPool() {
  const { invalidRange, deposit0Disabled, deposit1Disabled } = useV3MintInfo();
  const { isTONatPair } = useIsTon();

  return (
    <Flex w={"384px"}>
      {isTONatPair && <WarningText label={"TON is not supported on L1"} />}
      {!isTONatPair && invalidRange && (
        <WarningText label="Invalid range selected. The min price must be lower than the max price." />
      )}
      {!isTONatPair &&
        !invalidRange &&
        (deposit0Disabled || deposit1Disabled) && (
          <WarningText label="Your position will not earn fees or be used in swaps until the market price moves into your range." />
        )}
    </Flex>
  );
}
