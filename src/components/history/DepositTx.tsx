import { Flex, Text } from "@chakra-ui/react";
import TokenPairTx from "./TokenPairTx";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import DepositStatusTx from "./DepositStatusTx";
import { FullWithTx } from "@/types/activity/history";
import { Hash } from "viem";

export default function DepositTx(props: { tx: FullWithTx }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const { data, isError, isLoading } = useToken({
    address: layer === "L1" ? (tx._l1Token as Hash) : (tx._l2Token as Hash),
  });

  return (
    <Flex
      h={"160px"}
      w="336px"
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Flex justifyContent={"space-between"} w="100%">
        <Text fontSize={"14px"} fontWeight={600}>
          Deposit
        </Text>
      </Flex>
      <TokenPairTx
        action="deposit"
        inAmount={ethers.utils.formatUnits(
          tx._amount === undefined? '0':tx._amount.toString(),
          data?.decimals
        )}
        outAmount={ethers.utils.formatUnits(
          tx._amount === undefined? '0':tx._amount.toString(),
          data?.decimals
        )}
        inTokenSymbol={data?.symbol || "ETH"}
        outTokenSymbol={data?.symbol || "ETH"}
      />
      <DepositStatusTx
        completed={true}
        date={Number(tx.l1timeStamp)}
        layer={"L1"}
        txHash={tx.l1txHash}
        tx={tx}
      />
      <DepositStatusTx
        completed={tx.l2txHash ? true : false}
        date={Number(tx.l2timeStamp)}
        layer={"L2"}
        txHash={tx.l2txHash}
        tx={tx}
      />
    </Flex>
  );
}
