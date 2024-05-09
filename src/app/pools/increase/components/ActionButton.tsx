import { Button, Flex, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { poolModalStatus } from "@/recoil/modal/atom";
import { useMemo } from "react";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useApproveTokenForPools } from "@/hooks/token/useApproveToken";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { usePool } from "@/hooks/pool/usePool";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { PoolState } from "@/types/pool/pool";
import useConnectedNetwork from "@/hooks/network";
import { isWETH } from "@/utils/token/isETH";
import { ApproveButton } from "../../add/ActionButton";

const ApproveButtonsContrainer = () => {
  const { inTokenApproved, outTokenApproved } = useApproveTokenForPools();
  const { inToken, outToken, inTokenHasAmount, outTokenHasAmount } =
    useInOutTokens();
  const [poolState] = usePool();
  const { chainName } = useConnectedNetwork();
  const { subMode } = useGetMode();
  const { isBalanceOver, isOutTokenBalanceOver } = useInputBalanceCheck();

  if (subMode.add && poolState === PoolState.INVALID) return null;
  if (isBalanceOver || isOutTokenBalanceOver) return null;

  const inTokenApprvedOnIncrease = useMemo(() => {
    if (isWETH(inToken, chainName) && subMode.increase) return true;
    return inTokenApproved;
  }, [inTokenApproved, inToken, subMode, chainName]);
  const outTokenApprvedOnIncrease = useMemo(() => {
    if (isWETH(outToken, chainName) && subMode.increase) return true;
    return outTokenApproved;
  }, [outTokenApproved, outToken, subMode, chainName]);

  return (
    <Flex columnGap={"12px"} justifyContent={"flex-end"}>
      {inToken &&
        inTokenHasAmount &&
        !inTokenApprvedOnIncrease &&
        !isBalanceOver && <ApproveButton isInToken={true} />}
      {outToken &&
        outTokenHasAmount &&
        !outTokenApprvedOnIncrease &&
        !isOutTokenBalanceOver && <ApproveButton isInToken={false} />}
    </Flex>
  );
};

const ActionButton = () => {
  const [, setPoolModal] = useRecoilState(poolModalStatus);

  const handleAction = () => {
    return setPoolModal("increaseLiquidity");
  };

  const { deposit0Disabled, deposit1Disabled, pool } = usePoolInfo();
  const { isBalanceOver, isInputZero, isOutInputZero, isOutTokenBalanceOver } =
    useInputBalanceCheck();
  const { inTokenApproved, outTokenApproved } = useApproveTokenForPools();

  const btnIsDisabled = useMemo(() => {
    if (deposit1Disabled) {
      return isBalanceOver || isInputZero || !inTokenApproved;
    }
    if (deposit0Disabled) {
      return isOutTokenBalanceOver || isOutInputZero || !outTokenApproved;
    }
    return (
      isBalanceOver ||
      isOutTokenBalanceOver ||
      isInputZero ||
      isOutInputZero ||
      !inTokenApproved ||
      !outTokenApproved
    );
  }, [
    deposit0Disabled,
    deposit1Disabled,
    isBalanceOver,
    isOutTokenBalanceOver,
    isOutInputZero,
    isInputZero,
    inTokenApproved,
    outTokenApproved,
  ]);

  const buttonName = useMemo(() => {
    if (isBalanceOver) return `Insufficient ${pool?.token0.symbol} balance`;
    if (isOutTokenBalanceOver)
      return `Insufficient ${pool?.token1.symbol} balance`;
    if (isOutTokenBalanceOver)
      return `Insufficient ${pool?.token1.symbol} balance`;
    if (isInputZero || isOutInputZero) return "Enter an amount";
    return "Preview";
  }, [
    isBalanceOver,
    isOutTokenBalanceOver,
    pool?.token0.symbol,
    pool?.token1.symbol,
    isInputZero,
    isOutInputZero,
  ]);

  return (
    <Flex w={"100%"} flexDir={"column"} rowGap={"12px"}>
      <ApproveButtonsContrainer />
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
        <Text>{buttonName}</Text>
      </Button>
    </Flex>
  );
};

export default ActionButton;
