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
import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import {
  selectedTab,
  selectedTransactionCategory,
} from "@/recoil/history/transaction";
import { CT_ACTION, HISTORY_SORT } from "@/staging/types/transaction";
import { useRouter } from "next/navigation";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { Action, Status } from "@/staging/types/transaction";

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

  const targetChainId = useMemo(() => {
    const isForOtherLayer =
      txSort === "Deposit" ||
      txSort === "Withdraw" ||
      txSort === "Request" ||
      txSort === "Provide";
    const isNotInToken = isToken0 === false;

    if (isForOtherLayer && isNotInToken) return otherLayerChainInfo?.chainId;
    return network;
  }, [txSort, isToken0, otherLayerChainInfo?.chainId, network]);

  const noNeedToShowAmount = useMemo(() => {
    return txSort === "Revoke" || txSort === "UpdateFee";
  }, [txSort]);

  if (
    symbol === "WETH" ||
    tokenData[tokenIndex].tokenAddress === "ETH" ||
    isZeroAddress(tokenData[tokenIndex].tokenAddress)
  ) {
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
          networkSymbolW={16}
          networkSymbolH={16}
          bottom={-0.5}
          right={-0.5}
          chainId={targetChainId}
        />
        <Text fontSize={11} fontWeight={400} textAlign={"center"}>
          {trimAmount(convertParsedAmount)} {symbol === "WETH" ? "WETH" : "ETH"}
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
          chainId={targetChainId}
          networkSymbolW={16}
          networkSymbolH={16}
          bottom={-0.5}
          right={-0.5}
        />
        <Text fontSize={11} fontWeight={400} textAlign={"center"} w={"94px"}>
          {noNeedToShowAmount ? "" : trimAmount(convertParsedAmount)} {symbol}
        </Text>
      </Flex>
    );
  return null;
}

function ToastIcon(props: TransactionToastProp) {
  const { txSort } = props;

  const hasArrow = useMemo(() => {
    return (
      txSort === "Swap" ||
      txSort === "Wrap" ||
      txSort === "Unwrap" ||
      txSort === "Deposit" ||
      txSort === "Withdraw" ||
      txSort === "ETH-Wrap" ||
      txSort === "ETH-Unwrap" ||
      txSort === "Request" ||
      txSort === "Provide"
    );
  }, [txSort]);

  const hasPlus = useMemo(() => {
    return (
      txSort === "Add Liquidity" ||
      txSort === "Collect Fee" ||
      txSort === "Increase Liquidity" ||
      txSort === "Remove Liquidity"
    );
  }, [txSort]);

  if (hasArrow) {
    return (
      <Image
        src={ARROW_ICON}
        alt={"ARROW_ICON"}
        style={{ marginBottom: "6px" }}
      />
    );
  }
  if (hasPlus) {
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
  const [selectedTxCategory, setSeletedTxCategory] = useRecoilState(
    selectedTransactionCategory
  );
  const [, setIsOpen] = useRecoilState(accountDrawerStatus);

  const isForCrossTrade =
    txSort === "Request" ||
    txSort === "Provide" ||
    txSort === "CancelRequest" ||
    txSort === "UpdateFee";
  const needToOpenHistoryTab = useMemo(
    () => txSort === "Deposit" || txSort === "Withdraw" || isForCrossTrade,
    [txSort, isForCrossTrade]
  );

  const [, setSelectedTab] = useRecoilState(selectedTab);
  const [, setSelectedTransactionCategory] = useRecoilState(
    selectedTransactionCategory
  );
  const nativeToHistoryTab = () => setHistoryTabOpen(true);
  const navigateToCrossTrade = () => setSelectedTab(HISTORY_SORT.CROSS_TRADE);

  const router = useRouter();
  const openHistoryTab = () => {
    nativeToHistoryTab();
    if (isForCrossTrade) {
      navigateToCrossTrade();
      if (txSort === "Request") {
        router.push(`/pools`);
        return setSelectedTransactionCategory(CT_ACTION.REQUEST);
      }
      if (txSort === "Provide") {
        return setSelectedTransactionCategory(CT_ACTION.PROVIDE);
      }
      return setSelectedTransactionCategory(CT_ACTION.REQUEST);
    }
  };
  const { closeModal } = useTxConfirmModal();
  const clickTitle = useCallback(() => {
    if (needToOpenHistoryTab) {
      setIsOpen(true);
      setSeletedTxCategory(
        txSort === "Deposit" ? Action.Deposit : Action.Withdraw
      );
      openHistoryTab();
    } else {
      window.open(`${blockExplorer}/tx/${transactionHash}`, "_blank");
      closeModal();
    }
  }, [
    blockExplorer,
    closeModal,
    needToOpenHistoryTab,
    openHistoryTab,
    setIsOpen,
    setSeletedTxCategory,
    transactionHash,
    txSort
  ]);

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
      case "Revoke":
        return "Revoke";
      case "UpdateFee":
        return "Update";
      case "CancelRequest":
        return "Cancel";
      default:
        return txSort;
    }
  }, [txSort]);

  const hasSubTitle = useMemo(() => {
    return (
      txSort === "Approve" ||
      txSort === "Request" ||
      txSort === "Provide" ||
      txSort === "UpdateFee" ||
      txSort === "CancelRequest"
    );
  }, [txSort]);

  return (
    <WagmiProviders>
      {/** 조건문을 통해 null로 리턴 */}
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
          {hasSubTitle && (
            <Text fontSize={12} color={"#A0A3AD"} lineHeight={"26px"}>
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
// 랜더 트리거, 차크라 토스트 활용,
function TxToast() {
  const { mobileView } = useMediaView();
  const toast = useToast();
  const [isToasted, setIsToasted] = useState<string[]>([]);
  const { confirmedTransaction } = useTransaction();

  const [historyTabOpen, setHistoryTabOpen] =
    useRecoilState(accountDrawerStatus);

  const makeToast = useMemo(() => {
    if (mobileView) return null;

    confirmedTransaction?.map((transaction) => {
      const txHash = transaction[0];

      if (
        toast.isActive(txHash) === false &&
        isToasted.includes(txHash) === false
      ) {
        setHistoryTabOpen(false);
        toast({
          position: "top-right",
          variant: "solid",
          isClosable: true,
          id: txHash,
          duration: 5000000000000,
          render: () => <TransactionToast {...transaction[1]} />,
        });
        setIsToasted([...isToasted, txHash]);
      }
    });
  }, [confirmedTransaction]);

  return <>{makeToast}</>;
}

export default TxToast;
