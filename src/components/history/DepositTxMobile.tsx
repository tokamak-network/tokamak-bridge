import Image from "next/image";
import { useMemo } from "react";
import { Flex, Link, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import DepositStatusTx from "./DepositStatusTx";
import { FullWithTx } from "@/types/activity/history";
import { Hash } from "viem";
import { supportedTokens } from "@/types/token/supportedToken";

import LinkIcon from "@/assets/icons/link.svg";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import commafy from "@/utils/trim/commafy";

export default function DepositTx(props: { tx: FullWithTx }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const providers = useGetTxLayers();
  const ethToken = {
    decimals: supportedTokens[0].decimals,
    symbol: supportedTokens[0].tokenSymbol,
  };

  const { data, isError, isLoading } = useToken({
    address: layer === "L1" ? (tx._l1Token as Hash) : (tx._l2Token as Hash),
    enabled: tx._l1Token === zeroAddress ? false : true,
  });

  const token = layer === "L1" && tx._l1Token === zeroAddress ? ethToken : data;
  const txHashLink = useMemo(() => {
    return `${
      tx.l2txHash ? providers.l2BlockExplorer : providers.l1BlockExplorer
    }/tx/${tx.l2txHash ? tx.l2txHash : tx.l1txHash}`;
  }, [tx, providers]);

  return (
    <Flex
      w={{ baes: "100%", lg: "336px" }}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={tx.l2txHash ? "" : "#15161D"}
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Flex justifyContent={"space-between"} w="100%">
        <Link
          href={txHashLink}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Flex columnGap={"4px"} align={"center"}>
            <Text fontSize={"14px"} fontWeight={600} color={tx.l2txHash ? "#A0A3AD" : ""}>
              {
                tx.l2txHash ? "Deposit Completed" : "Deposit"
              }
            </Text>
          </Flex>
        </Link>

        <Link
          href={txHashLink}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Flex align={"center"} columnGap={"4px"}>
            <Text fontSize={"12px"}>
              {commafy(ethers.utils.formatUnits(
                tx._amount === undefined ? "0" : tx._amount.toString(),
                token?.decimals
              ), 2)}{" "}
              {(token?.symbol as string) || " ETH"}
            </Text>
            <Image alt="link" src={LinkIcon} />
          </Flex>
        </Link>
      </Flex>

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
