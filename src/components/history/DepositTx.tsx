import Image from "next/image";
import { Flex, Text, Link } from "@chakra-ui/react";
import TokenPairTx from "./TokenPairTx";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import DepositStatusTx from "./DepositStatusTx";
import { FullWithTx } from "@/types/activity/history";
import { Hash } from "viem";
import { supportedTokens } from "@/types/token/supportedToken";

import TxLink from "assets/icons/accountHistory/TxLink.svg";
import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";
import Arrow from "assets/icons/arrow.svg";

export default function DepositTx(props: { tx: FullWithTx }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const ethToken = {
    decimals: supportedTokens[0].decimals,
    symbol: supportedTokens[0].tokenSymbol,
  };

  const { data, isError, isLoading } = useToken({
    address: layer === "L1" ? (tx._l1Token as Hash) : (tx._l2Token as Hash),
    enabled: tx._l1Token === zeroAddress ? false : true,
  });

  const token = layer === "L1" && tx._l1Token === zeroAddress ? ethToken : data;

  return (
    <Flex
      h={"160px"}
      w={{ baes: "100%", lg: "336px" }}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      borderColor={tx.l2txHash ? "#15161D" : "#313442"}
      bg={"#15161D"}
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Flex justifyContent={"space-between"} align={"center"} w="100%">
        <Text
          color={tx.l2txHash ? "#A0A3AD" : "#FFFFFF"}
          fontSize={tx.l2txHash ? "12px" : "14px"}
          fontWeight={tx.l2txHash ? 500 : 600}
        >
          {tx.l2txHash ? "Deposit Completed" : "Deposit"}
        </Text>

        {tx.l2txHash ? (
          <Flex columnGap={1} align={"center"}>
            <Image alt="ethereum" src={Ethereum} width={16} height={16} />
            <Image alt="arrow" src={Arrow} width={12} height={12} />
            <Image alt="titan" src={Titan} width={16} height={16} />
          </Flex>
        ) : (
          <Link href="#">
            <Image alt="tx" src={TxLink} width={14} height={14} />
          </Link>
        )}
      </Flex>

      <TokenPairTx
        action="deposit"
        inAmount={ethers.utils.formatUnits(
          tx._amount === undefined ? "0" : tx._amount.toString(),
          token?.decimals
        )}
        outAmount={ethers.utils.formatUnits(
          tx._amount === undefined ? "0" : tx._amount.toString(),
          token?.decimals
        )}
        inTokenSymbol={(token?.symbol as string) || "ETH"}
        tx={tx}
        outTokenSymbol={(token?.symbol as string) || "ETH"}
      />

      {!tx.l2txHash && (
        <>
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
        </>
      )}
    </Flex>
  );
}
