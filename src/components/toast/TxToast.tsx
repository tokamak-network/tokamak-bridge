import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { Token } from "@uniswap/sdk-core";
import CloseButton from "../button/CloseButton";
import Add from "assets/icons/addIcon.svg";
import Arrow from "assets/icons/arrow.svg";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { supportedTokens } from "@/types/token/supportedToken";
import {
  transactionData,
  TransactionDataType,
} from "@/recoil/global/transaction";

import { TransactionType } from "@/types/transactions/transactionTypes";
import { type } from "os";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { SupportedChainProperties } from "@/types/network/supportedNetwork";
import { ActionMode } from "@/types/bridgeSwap";
import { ethers } from "ethers";
import { trimAmount } from "@/utils/trim";
import warning from 'assets/icons/warningRed.svg'
function CustomToastComponent(props: {
  tx: TransactionDataType;
  mode: ActionMode;
  setData(): void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { tx, setData, mode } = props;
  function close() {
    console.log("close");

    setIsOpen(false);
    setData();
  }

  function DoubleTokens(props: {
    funcName: string;
    functSub?: string;
    token0?: any;
    token1?: any;
    type?: string;
    network0: SupportedChainProperties | null;
    network1: SupportedChainProperties | null;
    amount1: any;
    amount0: any;
    error: boolean
  }) {
    const {
      funcName,
      functSub,
      token0,
      token1,
      type,
      amount1,
      amount0,
      network0,
      network1,
      error
    } = props;

    // const amount0Parsed = ethers.utils.formatUnits(amount0,token0.decimals)
    // const amount1Parsed = ethers.utils.formatUnits(amount1,token1.decimals)

    return (
      <Flex position={"relative"} top={"-7px"}>
        <Flex
          ml="12px"
          flexDir={"column"}
          justifyContent={"center"}
          h="44px"
          w="92px"
        >
          <Flex>
          <Text fontSize={"14px"} color={error? '#DD3A44': "#FFFFFF"}>
            {funcName}
          </Text>
        {error &&  <Flex h='15px' w='17px' ml='6px'>
            <Image src={warning} alt="error"/>
          </Flex>}
          </Flex>
         
          {functSub && (
            <Text fontSize={"10px"} color={error? '#DD3A44':"#A0A3AD"}>
              ({functSub})
            </Text>
          )}
        </Flex>
        <Flex mt={"-2px"} justifyContent="center" alignItems={"center"}>
          <Flex
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            w="90px"
          >
            <Box zIndex={100}>
              <TokenSymbol
                tokenType={token0.name || token0.tokenSymbol}
                w={32}
                h={32}
              />
              <Box pos={"relative"} top={"-14px"} left={"23px"}>
                <NetworkSymbol
                  network={network0 ? network0?.chainId : 1}
                  w={14}
                  h={14}
                  style={{
                    borderRadius: "4px",
                    position: "absolute",
                    right: 0,
                  }}
                />
              </Box>
            </Box>
            <Text fontSize={"11px"} mt={"-8px"}>
              {trimAmount({ amount: amount0 })} {token0.name}
            </Text>
          </Flex>

          <Flex h="14px" w="14px" mx={"7px"} mt={"-8px"}>
            <Image src={type === "arrow" ? Arrow : Add} alt="Add" />
          </Flex>
          <Flex
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            w="90px"
          >
            <Box>
              <TokenSymbol
                tokenType={token1.name || token1.tokenSymbol}
                w={32}
                h={32}
              />
              <Box pos={"relative"} top={"-14px"} left={"23px"}>
                <NetworkSymbol
                  network={network1 ? network1?.chainId : 1}
                  w={14}
                  h={14}
                  style={{
                    borderRadius: "4px",
                    position: "absolute",
                    right: 0,
                  }}
                />
              </Box>
            </Box>
            <Text fontSize={"11px"} mt={"-8px"}>
              {trimAmount({ amount: amount1 })} {token1.name}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  function SingleToken(props: {
    funcName: string;
    functSub?: string;
    token0: any;
    token1?: any;
    type?: string;
    network: SupportedChainProperties | null;
    amount: string;
    error: boolean
  }) {
    const { funcName, functSub, token0, token1, type, amount, network, error } = props;
    console.log("amount", amount);

    return (
      <Flex position={"relative"} top={"-8px"}>
        <Flex
          ml="12px"
          flexDir={"column"}
          justifyContent={"center"}
          h="44px"
          w="92px"
        >
          <Flex>
          <Text fontSize={"14px"} color={error? '#DD3A44':"#FFFFFF"}>
            {funcName}
          </Text>
         {error && <Flex h='15px' w='17px' ml='6px'>
            <Image src={warning} alt="error"/>
          </Flex>}
          </Flex>
         
          <Text fontSize={"10px"} color={error? '#DD3A44':"#A0A3AD"}>
            ({functSub})
          </Text>
        </Flex>
        <Flex mt={"-2px"} justifyContent="center" alignItems={"center"}>
          <Flex
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box zIndex={100}>
              <TokenSymbol
                tokenType={token0?.tokenSymbol as string}
                w={32}
                h={32}
              />
              <Box pos={"relative"} top={"-14px"} left={"23px"}>
                <NetworkSymbol
                  network={network ? network?.chainId : 1}
                  w={14}
                  h={14}
                  style={{
                    borderRadius: "4px",
                    position: "absolute",
                    right: 0,
                  }}
                />
              </Box>
            </Box>
            <Text fontSize={"11px"} mt={"-8px"}>
              {trimAmount({ amount: amount })} {token0.name}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  const txComp = useMemo(() => {
    switch (tx.info?.type) {
      case TransactionType.APPROVAL:
        return (
          <SingleToken
            funcName={"Approve"}
            functSub={mode as string}
            token0={tx.info.token}
            network={tx.info.inNetwork}
            amount={tx.info.amount.toString()}
            error={tx.txReceipt.status === 'success'? false: true}
          />
        );

      case TransactionType.SWAP:
        return (
          <DoubleTokens
            funcName={"Swap"}
            type="arrow"
            token0={tx.info.inputCurrency}
            token1={tx.info.outputCurrency}
            network0={tx.info.inNetwork}
            network1={tx.info.outNetwork}
            amount1={ethers.utils.formatUnits(
              tx.info.expectedOutputCurrencyAmountRaw,
              tx.info.inputCurrency?.decimals
            )}
            amount0={ethers.utils.formatUnits(
              tx.info.inputCurrencyAmountRaw,
              tx.info.outputCurrency?.decimals
            )}
            error={tx.txReceipt.status === 'success'? false: true}
          />
        );

      case TransactionType.DEPOSIT:
        return (
          <DoubleTokens
            funcName={"Deposit"}
            type="arrow"
            token0={tx.info.token0}
            token1={tx.info.token0}
            network0={tx.info.inNetwork}
            network1={tx.info.outNetwork}
            amount1={tx.info.currencyAmountRaw}
            amount0={tx.info.currencyAmountRaw}
            error={tx.txReceipt.status === 'success'? false: true}
          />
        );
      case TransactionType.WITHDRAW:
        return (
          <DoubleTokens
            funcName={"Withdraw"}
            type="arrow"
            token0={tx.info.token0}
            token1={tx.info.token0}
            network0={tx.info.inNetwork}
            network1={tx.info.outNetwork}
            amount1={tx.info.currencyAmountRaw}
            amount0={tx.info.currencyAmountRaw}
            error={tx.txReceipt.status === 'success'? false: true}
          />
        );

      case TransactionType.UNWRAP:
        return (
          <DoubleTokens
            funcName={"Unwrap"}
            type="arrow"
            token0={tx.info.inputCurrency}
            token1={tx.info.outputCurrency}
            network0={tx.info.inNetwork}
            network1={tx.info.outNetwork}
            amount1={tx.info.currencyAmountRaw}
            amount0={tx.info.currencyAmountRaw}
            error={tx.txReceipt.status === 'success'? false: true}
          />
        );
        case TransactionType.WRAP:
          return (
            <DoubleTokens
              funcName={"Wrap"}
              type="arrow"
              token0={tx.info.inputCurrency}
              token1={tx.info.outputCurrency}
              network0={tx.info.inNetwork}
              network1={tx.info.outNetwork}
              amount1={tx.info.currencyAmountRaw}
              amount0={tx.info.currencyAmountRaw}
              error={tx.txReceipt.status === 'success'? false: true}
            />
          );
      default:
        <></>;
    }
  }, []);

  return (
    <Flex
      h="84px"
      w="340px"
      border={"1px solid #313442"}
      bg="#1F2128"
      borderRadius={"8px"}
      transition={"none"}
      position={"absolute"}
      top={"80px"}
      right={"38px"}
      flexDir={"column"}
      justifyContent={"flex-start"}
      p="8px"
      display={isOpen ? "flex" : "none"}
    >
      <Flex w="100%" alignItems={"flex-end"} flexDir={"column"}>
        <Flex h="16px" w="16px">
          <CloseButton onClick={close} />
        </Flex>
      </Flex>
      {txComp}
    </Flex>
  );
}

function TxToast() {
  const toast = useToast();
  const { isLoading, isSuccess } = useGetTransaction();
  const [tx, setTransactionData] = useRecoilState(transactionData);
  const { mode } = useGetMode();
  const callToast = () => {
    try {
      if (isSuccess === 1) {
        toast({
          position: "top-right",
          variant: "solid",
          isClosable: false,
          id: "xx",
          // duration: 20000,
          render: () => (
            <CustomToastComponent
              tx={tx}
              mode={mode}
              setData={() =>
                setTransactionData({
                  isLoading: false,
                  isSuccess: undefined,
                  txReceipt: undefined,
                  info: undefined,
                })
              }
            />
          ),
        });
      }
    } finally {
    }
  };
  return <>{callToast()}</>;
}

export default TxToast;
