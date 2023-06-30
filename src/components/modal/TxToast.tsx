import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTransaction } from "@/hooks/tx/useTx";
import "@/css/toast.css";
import { TxInterface } from "@/types/tx/txType";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import { useErc20Decimals, useErc20Symbol } from "@/generated";
import { ethers } from "ethers";
import { WagmiProviders } from "@/providers/wagmiProvider";
import { trimAmount } from "@/utils/trim";
import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import PLUS_ICON from "assets/icons/toast/toastPlus.svg";
import CLOSE_ICON from "assets/icons/toast/close.svg";

import Image from "next/image";
import { useRecoilState } from "recoil";
import { txDataStatus } from "@/recoil/global/transaction";

type TransactionToastProp = TxInterface;

function TxTokenInfo(props: TransactionToastProp & { isToken0: boolean }) {
  const { tokenData, isToken0, network, txSort } = props;

  if (
    tokenData === undefined ||
    (isToken0 === false &&
      (tokenData[1] === null || tokenData[1] === undefined))
  ) {
    return <Box w={"136px"}></Box>;
  }

  const tokenIndex = isToken0 ? 0 : 1;
  const { data: symbol } = useErc20Symbol({
    address: tokenData[tokenIndex].tokenAddress as `0x${string}`,
  });
  const { data: decimals } = useErc20Decimals({
    address: tokenData[tokenIndex].tokenAddress as `0x${string}`,
  });
  const parsedAmount = ethers.utils.formatUnits(
    tokenData[tokenIndex].amount.toString(),
    (tokenIndex === 1 && txSort === "Wrap"
      ? 18
      : tokenIndex === 1 && txSort === "Unwrap"
      ? 27
      : decimals) ?? 18
  );
  const convertParsedAmount = parsedAmount.replaceAll("-", "");

  if (symbol === "WETH" || tokenData[tokenIndex].tokenAddress === "ETH") {
    return (
      <Flex
        w={"92px"}
        minW={"92px"}
        rowGap={"8px"}
        flexDir={"column"}
        py={"18px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TokenSymbolWithNetwork
          tokenSymbol={"ETH"}
          chainId={
            txSort === "Deposit" && isToken0 === false
              ? 5050
              : txSort === "Withdraw" && isToken0 === false
              ? 1
              : network
          }
        />
        <Text fontSize={11} fontWeight={400} textAlign={"center"}>
          {trimAmount(convertParsedAmount)} {"ETH"}
        </Text>
      </Flex>
    );
  }

  if (symbol && decimals)
    return (
      <Flex
        w={"92px"}
        minW={"92px"}
        rowGap={"8px"}
        flexDir={"column"}
        py={"18px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TokenSymbolWithNetwork
          tokenSymbol={symbol}
          chainId={
            txSort === "Deposit" && isToken0 === false
              ? 5050
              : txSort === "Withdraw" && isToken0 === false
              ? 1
              : network
          }
        />
        <Text fontSize={11} fontWeight={400} textAlign={"center"}>
          {trimAmount(convertParsedAmount)} {symbol}
        </Text>
      </Flex>
    );
  return null;
}

function ToastIcon(props: TransactionToastProp) {
  if (
    props.txSort === "Swap" ||
    props.txSort === "Wrap" ||
    props.txSort === "Unwrap" ||
    props.txSort === "Deposit" ||
    props.txSort === "Withdraw"
  ) {
    return <Image src={ARROW_ICON} alt={"ARROW_ICON"} />;
  }
  if (
    props.txSort === "Add Liquidity" ||
    props.txSort === "Collect Fee" ||
    props.txSort === "Remove Liquidity"
  ) {
    return <Image src={PLUS_ICON} alt={"PLUS_ICON"} />;
  }
  return null;
}

function TransactionToast(props: TransactionToastProp) {
  const { txSort, transactionHash } = props;

  const toast = useToast();

  return (
    <WagmiProviders>
      <Flex
        w={"340px"}
        h={"84px"}
        borderRadius={"8px"}
        border={"1px solid #313442"}
        bgColor={"#1F2128"}
        alignItems={"center"}
        pl={"20px"}
        pr={"25px"}
        // columnGap={"25px"}
        pos={"relative"}
        justifyContent={"space-between"}
      >
        <Text>{txSort}</Text>
        <Flex w={"208px"}>
          <TxTokenInfo isToken0={true} {...props} />
          <ToastIcon {...props} />
          <TxTokenInfo isToken0={false} {...props} />
        </Flex>
        <Box pos={"absolute"} right={"8px"} bottom={"60px"} cursor={"pointer"}>
          <Image
            src={CLOSE_ICON}
            alt={"CLOSE_ICON"}
            onClick={() => toast.close(transactionHash as string)}
          />
        </Box>
      </Flex>
    </WagmiProviders>
  );
}

function TxToast() {
  const toast = useToast();
  const [isToasted, setIsToasted] = useState<string[]>([]);
  const [txData, setTxData] = useRecoilState(txDataStatus);

  const { confirmedTransaction } = useTransaction();

  const makeToast = useMemo(() => {
    confirmedTransaction?.map((transaction) => {
      const txHash = transaction[0];

      if (
        toast.isActive(txHash) === false &&
        isToasted.includes(txHash) === false
      ) {
        toast({
          position: "top-right",
          variant: "solid",
          isClosable: true,
          id: txHash,
          duration: 5000,
          render: () => <TransactionToast {...transaction[1]} />,
        });
        setIsToasted([...isToasted, txHash]);
      }
    });
  }, [confirmedTransaction]);

  // useEffect(() => {
  //   if (txData) {
  //     const d = isToasted.filter((hashKey) => {
  //       return txData[hashKey].transactionHash !== undefined;
  //     });
  //   }
  // }, [isToasted]);

  return <>{makeToast}</>;
}

export default TxToast;
