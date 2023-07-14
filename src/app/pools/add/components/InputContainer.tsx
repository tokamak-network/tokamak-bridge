import TokenInput from "@/components/input/TokenInput";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { Box } from "@chakra-ui/react";
import { useMemo } from "react";

export function InputContainer(props: { inToken: boolean }) {
  const { inToken } = props;
  const { deposit0Disabled, deposit1Disabled, invalidRange } = useV3MintInfo();

  const isDisabled = useMemo(() => {
    if (invalidRange) return true;
    if (inToken) {
      return deposit0Disabled;
    }
    return deposit1Disabled;
  }, [invalidRange, deposit0Disabled, deposit1Disabled]);

  if (isDisabled) return null;

  return (
    <Box w={"186px"}>
      <TokenInput inToken={inToken} hasMaxButton={true} />
    </Box>
  );
}
