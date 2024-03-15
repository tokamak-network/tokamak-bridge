import TokenInput from "@/components/input/TokenInput";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import LOCK_ICON from "assets/icons/pool/lock.svg";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

export const OutRangeWarning = () => {
  const { invalidRange } = useV3MintInfo();

  return (
    <Flex flexDir={"column"} rowGap={"8px"} opacity={invalidRange ? 0.2 : 1}>
      <Image src={LOCK_ICON} alt={"LOCK_ICON"} />
      <Text fontSize={12}>
        The market price is outside your specified price range. Single-asset
        deposit only.
      </Text>
    </Flex>
  );
};

export function InputContainer(props: {
  inToken: boolean;
  isDisabled?: boolean;
}) {
  const { inToken } = props;
  const { deposit0Disabled, deposit1Disabled, invalidRange } = useV3MintInfo();
  const { initializeInTokenAmount, initializeOutTokenAmount } =
    useInOutTokens();
  const isDisabled = useMemo(() => {
    if (invalidRange) return true;
    if (inToken) {
      initializeInTokenAmount();
      return deposit0Disabled;
    }
    initializeOutTokenAmount();
    return deposit1Disabled;
  }, [invalidRange, deposit0Disabled, deposit1Disabled, props.isDisabled]);

  return (
    <Box w={"186px"} minH={"45px"}>
      {!isDisabled && (
        <TokenInput
          inToken={inToken}
          hasMaxButton={true}
          isDisabled={props.isDisabled}
          style={{ opacity: props.isDisabled ? 0.3 : 1 }}
        />
      )}
      {invalidRange && <OutRangeWarning />}
      {!invalidRange && inToken && deposit0Disabled && <OutRangeWarning />}
      {!invalidRange && !inToken && deposit1Disabled && <OutRangeWarning />}
    </Box>
  );
}
