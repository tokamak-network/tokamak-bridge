import {
  useErc20Approve,
  useErc20TotalSupply,
  usePrepareErc20Approve,
} from "@/generated";
import useContract from "@/hooks/contracts/useContract";
import { useGetMode } from "@/hooks/mode/useGetMode";
import {
  useAllowance,
  useApproveTokenForPools,
} from "@/hooks/token/useApproveToken";
import { useMintPositionInfo } from "@/hooks/pool/useMintPositionInfo";
import { usePool } from "@/hooks/pool/usePool";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import useIsTon from "@/hooks/token/useIsTon";
import { useTx } from "@/hooks/tx/useTx";
import { poolModalProp, poolModalStatus } from "@/recoil/modal/atom";
import { PoolState } from "@/types/pool/pool";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import { Hash } from "viem";
import { useContractWrite } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { USDT_ADDRESS_BY_CHAINID } from "@/constant/contracts/tokens";
import USDT_ABI from "@/constant/abis/USDT.json";

export const ApproveButton = (props: { isInToken: boolean }) => {
  return <></>;
};

export const ApproveButtonsContrainer = () => {
  const { inTokenApproved, outTokenApproved } = useApproveTokenForPools();
  const { inToken, outToken, inTokenHasAmount, outTokenHasAmount } =
    useInOutTokens();
  const [poolState] = usePool();
  const { subMode } = useGetMode();
  const { isBalanceOver, isOutTokenBalanceOver } = useInputBalanceCheck();

  if (subMode.add && poolState === PoolState.INVALID) return null;
  if (isBalanceOver || isOutTokenBalanceOver) return null;

  return (
    <Flex columnGap={"12px"} justifyContent={"flex-end"}>
      {inToken && inTokenHasAmount && !inTokenApproved && !isBalanceOver && (
        <ApproveButton isInToken={true} />
      )}
      {outToken &&
        outTokenHasAmount &&
        !outTokenApproved &&
        !isOutTokenBalanceOver && <ApproveButton isInToken={false} />}
    </Flex>
  );
};

export default function ActionButton() {
  const [poolState] = usePool();
  const { tokensPairHasAmount } = useInOutTokens();
  const { inTokenApproved, outTokenApproved } = useApproveTokenForPools();
  const { isBalanceOver, isOutTokenBalanceOver, isInputZero, isOutInputZero } =
    useInputBalanceCheck();
  const { inToken, outToken } = useInOutTokens();
  const { isTONatPair } = useIsTon();
  const { deposit0Disabled, deposit1Disabled, invalidRange } = useV3MintInfo();

  const [, setPoolModal] = useRecoilState(poolModalStatus);
  const [, setPollModalProp] = useRecoilState(poolModalProp);

  const btnDisabled =
    (!deposit0Disabled && !deposit1Disabled && !tokensPairHasAmount) ||
    (!deposit0Disabled && !inTokenApproved) ||
    (!deposit1Disabled && !outTokenApproved) ||
    (!deposit0Disabled && isBalanceOver) ||
    (!deposit1Disabled && isOutTokenBalanceOver) ||
    isTONatPair ||
    (!deposit0Disabled && isInputZero) ||
    (!deposit1Disabled && isOutInputZero) ||
    invalidRange;

  const { mintPositionInfo } = useMintPositionInfo();

  const handleAction = () => {
    setPollModalProp(mintPositionInfo);
    return setPoolModal("addLiquidity");
  };

  const buttonName = useMemo(() => {
    if (!deposit0Disabled && isBalanceOver)
      return `Insufficient ${inToken?.tokenSymbol} balance`;
    if (!deposit1Disabled && isOutTokenBalanceOver)
      return `Insufficient ${outToken?.tokenSymbol} balance`;

    switch (poolState) {
      case PoolState.EXISTS:
        return (!deposit0Disabled &&
          !deposit1Disabled &&
          tokensPairHasAmount) ||
          (deposit0Disabled && !isOutInputZero) ||
          (deposit1Disabled && !isInputZero)
          ? "Preview"
          : "Enter an amount";
      case PoolState.INVALID:
        return "Invalid pair";
      case PoolState.NOT_EXISTS:
        return (!deposit0Disabled &&
          !deposit1Disabled &&
          tokensPairHasAmount) ||
          (deposit0Disabled && !isOutInputZero) ||
          (deposit1Disabled && !isInputZero)
          ? "Preview"
          : "Enter an amount";
    }
    return "Invalid pair";
  }, [
    poolState,
    tokensPairHasAmount,
    isBalanceOver,
    isOutTokenBalanceOver,
    inToken,
    outToken,
    deposit0Disabled,
    deposit1Disabled,
  ]);

  return (
    <Flex flexDir={"column"} rowGap={"12px"} mt={"auto"}>
      <ApproveButtonsContrainer />
      <Button
        w={"100%"}
        h={"48px"}
        color={"#fff"}
        bgColor={"#007AFF"}
        borderRadius={"8px"}
        _hover={{}}
        _active={{}}
        onClick={handleAction}
        isDisabled={btnDisabled}
        _disabled={{ bgColor: "#17181D", color: "#8E8E92" }}
        cursor={"pointer !important"}
        opacity={"1 !important"}
      >
        {buttonName}
      </Button>
    </Flex>
  );
}
