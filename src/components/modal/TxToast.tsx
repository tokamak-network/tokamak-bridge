import { Box, Flex, Text, useToast, Link } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import useConnectedNetwork from "@/hooks/network";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { txDataStatus } from "@/recoil/global/transaction";

type TransactionToastProp = TxInterface;

function TxTokenInfo(props: TransactionToastProp & { isToken0: boolean }) {
  const { tokenData, isToken0, network, txSort, actionSort } = props;

  if (
    tokenData === undefined ||
    (isToken0 === false &&
      (tokenData[1] === null || tokenData[1] === undefined))
  ) {
    return <Box w={"136px"}></Box>;
  }

  const { otherLayerChainInfo } = useConnectedNetwork();
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
        {/**
         * need to change with chainId
         * support for multi chain
         */}
        <TokenSymbolWithNetwork
          tokenSymbol={symbol === "WETH" ? "WETH" : "ETH"}
          chainId={
            txSort === "Deposit" && isToken0 === false
              ? otherLayerChainInfo?.chainId
              : txSort === "Withdraw" && isToken0 === false
              ? otherLayerChainInfo?.chainId
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
              ? 55004
              : txSort === "Withdraw" && isToken0 === false
              ? 1
              : network
          }
        />
        <Text fontSize={11} fontWeight={400} textAlign={"center"} w={"94px"}>
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
    props.txSort === "Withdraw" ||
    props.txSort === "ETH-Wrap" ||
    props.txSort === "ETH-Unwrap"
  ) {
    return <Image src={ARROW_ICON} alt={"ARROW_ICON"} />;
  }
  if (
    props.txSort === "Add Liquidity" ||
    props.txSort === "Collect Fee" ||
    props.txSort === "Increase Liquidity" ||
    props.txSort === "Remove Liquidity"
  ) {
    return <Image src={PLUS_ICON} alt={"PLUS_ICON"} />;
  }
  return null;
}

function TransactionToast(props: TransactionToastProp) {
  const { txSort, transactionHash, actionSort } = props;

  const toast = useToast();
  const { blockExplorer } = useConnectedNetwork();
  const [historyTabOpen, setHistoryTabOpen] =
    useRecoilState(accountDrawerStatus);

  const needToOpenHistoryTab = txSort === "Deposit" || txSort === "Withdraw";

  const clickTitle = useCallback(() => {
    needToOpenHistoryTab
      ? setHistoryTabOpen(true)
      : window.open(`${blockExplorer}/tx/${transactionHash}`, "_blank");
  }, [props, blockExplorer, needToOpenHistoryTab]);

  useEffect(() => {
    if (historyTabOpen) toast.closeAll();
  }, [historyTabOpen]);

  const txSortMessage = useMemo(() => {
    switch (txSort) {
      case "ETH-Wrap":
        return "Wrap";
      case "ETH-Unwrap":
        return "Unwrap";
      case "Add Liquidity":
        return "Add";
      case "Increase Liquidity":
        return "Add";
      case "Collect Fee":
        return "Claim";
      case "Remove Liquidity":
        return "Remove";
      default:
        return txSort;
    }
  }, [txSort]);

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
        <Flex
          w={"92px"}
          h={"44px"}
          flexDir={"column"}
          justifyContent={"center"}
        >
          <Text cursor={"pointer"} onClick={clickTitle}>
            {txSortMessage}
          </Text>
          {txSort !== "Approve" && actionSort && (
            <Text fontSize={12} color={"#A0A3AD"}>
              ({actionSort})
            </Text>
          )}
        </Flex>

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
          duration: 5000000000,
          render: () => <TransactionToast {...transaction[1]} />,
        });
        setIsToasted([...isToasted, txHash]);
      }
    });
  }, [confirmedTransaction]);

  return <>{makeToast}</>;
}

export default TxToast;
