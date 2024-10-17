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
  const { isInToken } = props;
  const { inToken, outToken } = useInOutTokens();
  const tokenAddress = isInToken
    ? (inToken?.tokenAddress as Hash)
    : (outToken?.tokenAddress as Hash);
  const { isLayer2, connectedChainId } = useConnectedNetwork();
  const { UNISWAP_CONTRACT } = useContract();
  const contractAddress = UNISWAP_CONTRACT?.NONFUNGIBLE_POSITION_MANAGER;

  const { data: totalSupply } = useErc20TotalSupply({
    address: tokenAddress,
  });
  const { config, error, isError } = usePrepareErc20Approve({
    address: tokenAddress,
    args:
      contractAddress && totalSupply
        ? [contractAddress, totalSupply]
        : undefined,
    enabled: Boolean(contractAddress && totalSupply),
  });
  const { data, write } = useErc20Approve(config);
  const { data: usdtRevokeData, write: USDT_APPROVE_REVOKE } = useContractWrite(
    {
      address: tokenAddress,
      abi: USDT_ABI,
      functionName: "approve",
    },
  );
  const { data: usdtApproveData, write: USDT_APPROVE } = useContractWrite({
    address: tokenAddress,
    abi: USDT_ABI,
    functionName: "approve",
  });

  const { allowanceIsBiggerThanZero, allowance } = useAllowance({
    inputTokenAmount: isInToken ? inToken?.amountBN : outToken?.amountBN,
    tokenAddress,
    token: inToken,
    contractAddress,
  });
  const isUSDT = useMemo(() => {
    return connectedChainId
      ? tokenAddress.toLowerCase() ===
          USDT_ADDRESS_BY_CHAINID[connectedChainId].toLowerCase()
      : undefined;
  }, [connectedChainId, tokenAddress, USDT_ADDRESS_BY_CHAINID]);

  const isRevokeForUSDT = useMemo(() => {
    if (isUSDT && allowanceIsBiggerThanZero && !isLayer2) {
      return true;
    }
    return false;
  }, [isUSDT, allowanceIsBiggerThanZero, isLayer2]);

  const approveForUSDT = useCallback(() => {
    if (isRevokeForUSDT) {
      return USDT_APPROVE_REVOKE({
        args: [contractAddress, 0],
      });
    }
    return USDT_APPROVE({
      args: [contractAddress, totalSupply?.toString()],
    });
  }, [
    contractAddress,
    totalSupply,
    USDT_APPROVE,
    USDT_APPROVE_REVOKE,
    isRevokeForUSDT,
  ]);

  const { isLoading } = useTx({
    hash: isUSDT ? usdtApproveData?.hash : data?.hash,
    txSort: "Approve",
    tokenAddress: tokenAddress,
  });
  const { isLoading: usdtRevokeIsLoading } = useTx({
    hash: usdtRevokeData?.hash,
    txSort: "Revoke",
    tokenAddress,
    actionSort: "Pool",
  });

  const { deposit0Disabled, deposit1Disabled } = useV3MintInfo();
  const { isTONatPair } = useIsTon();

  const callApprove = useCallback(() => {
    isUSDT ? approveForUSDT() : write?.();
  }, [
    contractAddress,
    totalSupply,
    isUSDT,
    USDT_APPROVE,
    write,
    approveForUSDT,
  ]);

  const loadingStatus = useMemo(() => {
    return isLoading || usdtRevokeIsLoading;
  }, [isLoading, usdtRevokeIsLoading]);

  if (
    (isInToken && deposit0Disabled) ||
    (!isInToken && deposit1Disabled) ||
    isTONatPair
  )
    return null;

  return (
    <Flex w={"100%"}>
      <Button
        w={"100%"}
        h={"48px"}
        borderRadius={"8px"}
        bg={isLoading || isRevokeForUSDT ? "#17181D" : "#007AFF"}
        borderWidth={isRevokeForUSDT ? "1px" : undefined}
        borderColor={isRevokeForUSDT ? "#007AFF" : undefined}
        fontSize={16}
        fontWeight={600}
        _hover={{}}
        _active={{}}
        _disabled={{}}
        color={"#fff"}
        onClick={callApprove}
        isDisabled={isLoading}
      >
        {loadingStatus && <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />}
        {!loadingStatus && isRevokeForUSDT && <Text>Revoke USDT</Text>}{" "}
        {!loadingStatus && !isRevokeForUSDT && (
          <Text>
            Approve {isInToken ? inToken?.tokenSymbol : outToken?.tokenSymbol}
          </Text>
        )}
      </Button>
    </Flex>
  );
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
      >
        {buttonName}
      </Button>
    </Flex>
  );
}
