import {
  useErc20Approve,
  useErc20TotalSupply,
  usePrepareErc20Approve,
} from "@/generated";
import useContract from "@/hooks/contracts/useContract";
import { useApproveToken } from "@/hooks/pool/useApproveToken";
import { usePool } from "@/hooks/pool/usePool";
import { usePoolMint } from "@/hooks/pool/usePoolContract";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useTx } from "@/hooks/tx/useTx";
import { PoolState } from "@/types/pool/pool";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Hash } from "viem";
import { useWaitForTransaction } from "wagmi";

const ApproveButton = (props: { isInToken: boolean }) => {
  const { isInToken } = props;
  const { inToken, outToken } = useInOutTokens();
  const tokenAddress = isInToken
    ? (inToken?.tokenAddress as Hash)
    : (outToken?.tokenAddress as Hash);
  const { UNISWAP_CONTRACT } = useContract();
  const contractAddress = UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER;

  const { data: totalSupply } = useErc20TotalSupply({
    address: tokenAddress,
  });
  const { config, error, isError } = usePrepareErc20Approve({
    address: tokenAddress,
    args:
      contractAddress && totalSupply
        ? [UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER, totalSupply]
        : undefined,
    enabled: Boolean(contractAddress && totalSupply),
  });
  const { data, write } = useErc20Approve(config);
  const {} = useTx({ hash: data?.hash, txSort: "Approve" });
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { deposit0Disabled, deposit1Disabled } = useV3MintInfo();

  if ((isInToken && deposit0Disabled) || (!isInToken && deposit1Disabled))
    return null;

  return (
    <Flex w={"100%"}>
      <Button
        w={"100%"}
        h={"48px"}
        borderRadius={"8px"}
        bg={isLoading ? "#17181D" : "#007AFF"}
        fontSize={16}
        fontWeight={600}
        _hover={{}}
        _active={{}}
        _disabled={{}}
        onClick={() => write?.()}
        isDisabled={isLoading}
      >
        {isLoading && <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />}
        {!isLoading && (
          <Text>
            Approve {isInToken ? inToken?.tokenSymbol : outToken?.tokenSymbol}
          </Text>
        )}
      </Button>
    </Flex>
  );
};

const ApproveButtonsContrainer = () => {
  const { inTokenApproved, outTokenApproved } = useApproveToken();
  const { inToken, outToken } = useInOutTokens();

  return (
    <Flex columnGap={"12px"}>
      {inToken && !inTokenApproved && <ApproveButton isInToken={true} />}
      {outToken && !outTokenApproved && <ApproveButton isInToken={false} />}
    </Flex>
  );
};

export default function ActionButton() {
  const [poolState] = usePool();
  const { tokensPairHasAmount } = useInOutTokens();

  const buttonName = useMemo(() => {
    switch (poolState) {
      case PoolState.EXISTS:
        return tokensPairHasAmount ? "Preview" : "Enter an amount";
      case PoolState.INVALID:
        return "Invalid pair";
      case PoolState.NOT_EXISTS:
        return "Invalid pair";
    }
    return "Invalid pair";
  }, [poolState, tokensPairHasAmount]);

  const { mintPosition } = usePoolMint();
  const {
    isOpen,

    onClosePreviewModal,
    setPreviewModalStatus,
  } = usePreview();

  const handleAction = () => {
    setPreviewModalStatus(true);
    switch (page) {
      case "Add":
        return setPoolModal("collectFee");
      case "Remove":
        return setPoolModal("removeLiquidity");
      case "Increase":
        return setPoolModal("increaseLiquidity");
      default:
        return setPoolModal("increaseLiquidity");
    }

    
  };
  return (
    <Flex flexDir={"column"} rowGap={"12px"} mt={"auto"}>
      <ApproveButtonsContrainer />
      <Button
        w={"100%"}
        h={"48px"}
        color={"#8E8E92"}
        bgColor={"#17181D"}
        borderRadius={"8px"}
        _hover={{}}
        _active={{}}
        onClick={mintPosition}
      >
        {buttonName}
      </Button>
    </Flex>
  );
}
