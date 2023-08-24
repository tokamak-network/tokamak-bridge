import { Button, Flex, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { poolModalStatus } from "@/recoil/modal/atom";
import { useMemo } from "react";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";

const ActionButton = (props: { step: string }) => {
  const { step } = props;
  const [, setPoolModal] = useRecoilState(poolModalStatus);

  const handleAction = () => {
    return setPoolModal("increaseLiquidity");
  };

  const { inverted, deposit0Disabled, deposit1Disabled } = usePoolInfo();
  const { isBalanceOver, isInputZero, isOutInputZero, isOutTokenBalanceOver } =
    useInputBalanceCheck();

  const btnIsDisabled = useMemo(() => {
    if (deposit1Disabled) {
      return isBalanceOver || isInputZero;
    }
    if (deposit0Disabled) {
      return isOutTokenBalanceOver || isOutInputZero;
    }
    return (
      isBalanceOver || isOutTokenBalanceOver || isInputZero || isOutInputZero
    );
  }, [
    deposit0Disabled,
    deposit1Disabled,
    isBalanceOver,
    isOutTokenBalanceOver,
    isOutInputZero,
    isInputZero,
    inverted,
  ]);

  return (
    <Flex w={"100%"}>
      <Button
        w={"100%"}
        h={"48px"}
        borderRadius={"8px"}
        bg={"#007AFF"}
        fontSize={16}
        fontWeight={600}
        _hover={{}}
        _active={{}}
        _disabled={{ bgColor: "#17181D", color: "#8E8E92" }}
        onClick={handleAction}
        // isDisabled={btnIsDisabled}
      >
        <Text>{step}</Text>
      </Button>
    </Flex>
  );
};

export default ActionButton;
