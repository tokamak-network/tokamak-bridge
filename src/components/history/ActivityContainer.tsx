import { Flex, Text, Button, Spinner } from "@chakra-ui/react";
import WithdrawTx from "./WithdrawTx";
import DepositTx from "./DepositTx";
// import useGetTransaction from "@/hooks/user/useGetTransaction";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { searchTxStatus } from "@/recoil/userHistory/searchTx";
import LoadingTx from "./LoadingTx";
import noActivityIcon from "assets/icons/accountHistory/noActivityIcon.svg";
import Image from "next/image";
import { supportedChain } from "@/types/network/supportedNetwork";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { tData, FullWithTx, FullDepTx } from "@/types/activity/history";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import useConnectedNetwork from "@/hooks/network";
import { useAccount } from "wagmi";
import { L1TxType,Erc20Type, EthType } from "@/types/activity/history";
import HalfLoadingTx from "./HalfLoadingTx";
import useGetTransaction from "@/hooks/user/useGetTransaction";

type ChainName = "MAINNET" | "GOERLI" | "TITAN" | "DARIUS" | undefined;

type SelectOption = {
  chainId: number;
  chainName: ChainName;
  networkImage: any;
};

export default function ActivityContainer(props: {
  network: SelectOption;
}) {
  const { network } = props;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const [preLoadData, setPreLoadData] = useState<L1TxType[]>([]);
  // const tData = useGetTransaction();
  const [numData, setNumData] = useState(2);
  const searchTxString = useRecoilValue(searchTxStatus);
  const zero_address = "0x0000000000000000000000000000000000000000";
  const tData = useGetTransaction();

  useEffect(() => {
    const updateNumData = () => {
      const element = document.getElementById("tx-history");
      const height = element?.offsetHeight;
      if (height !== undefined) {
        const numTxs = parseInt((height / 160).toString());
        setNumData(numTxs);
      }
    };

    updateNumData();

    const handleResize = () => {
      updateNumData();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredTx = useMemo(() => {
    if (searchTxString?.id === "" || searchTxString === null) {
      return tData.depositTxs.length > 0 ? tData.depositTxs : preLoadData;
    } else {
      if (tData.depositTxs.length > 0) {
        const filteredTx = tData.depositTxs.filter(
          (tx: FullDepTx | FullWithTx) => {
            return (
              tx.l1txHash.includes(searchTxString.id) ||
              tx.l2txHash.includes(searchTxString.id)
            );
          }
        );
        return filteredTx;
      } else {
        return preLoadData;
      }
    }
  }, [tData, searchTxString,preLoadData]);

  const getLayerFiltered = useMemo(() => {
    const depSelected =
      network.chainId === SupportedChainId["MAINNET"] ||
      network.chainId === SupportedChainId["GOERLI"];
    const withSelected =
      network.chainId === SupportedChainId["DARIUS"] ||
      network.chainId === SupportedChainId["TITAN"];
    const allSelected = network.chainId === undefined;

    if (depSelected === true) {
      const txs = filteredTx.filter((tx: FullDepTx) => tx.event === "deposit");
      return txs;
    } else if (withSelected === true) {
      const txs = filteredTx.filter(
        (tx: FullWithTx) => tx.event === "withdraw"
      );
      return txs;
    } else {
      return filteredTx;
    }
  }, [searchTxString, tData, network, filteredTx,preLoadData]);

  const getPaginatedData = useMemo(() => {
    const startIndex = 0;
    const endIndex = startIndex + numData;
    return getLayerFiltered.slice(startIndex, endIndex);
  }, [filteredTx, tData, numData, getLayerFiltered,preLoadData]);

  useEffect(() => {
    const getTxs = async () => {
      if (isConnectedToMainNetwork !== undefined) {
        const txs = await fetchUserTransactions(
          address,
          isConnectedToMainNetwork
        );

        const depTx = txs?.formattedL1DepositResults.map((tx: any) => {
          return {
            ...tx,
            event: "deposit",

          };
        });

        const wthTx = txs?.formattedL1WithdrawResults.map((tx: any) => {
          return {
            ...tx,
            event: "withdraw",
          };
        });

        const allTxs = depTx
          .concat(wthTx)
          .sort(
            (tx1: L1TxType, tx2: L1TxType) =>
              Number(tx2.blockTimestamp) - Number(tx1.blockTimestamp)
          );
        setPreLoadData(allTxs);
      }
    };

    getTxs();
  }, [isConnectedToMainNetwork, address]);

  const txes = useMemo(() => {
    switch (tData.loadingState) {
      case "absent":
        return (
          <Flex
            w="100%"
            h={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDir={"column"}
          >
            <Image
              alt="noActivityIcon"
              src={noActivityIcon}
              height={75}
              width={60}
            />
            <Text
              color={"#e3f3ff"}
              fontWeight={500}
              fontSize={"16px"}
              mt="24px"
            >
              No activity yet
            </Text>
            <Text
              color={"#7B7F8F"}
              fontWeight={400}
              fontSize={"11px"}
              mt="7px"
              w="191px"
            >
              Your onchain transactions and crypto purchases will appear here.
            </Text>
          </Flex>
        );

      case "present":
        return (
          getPaginatedData.length !== 0 &&
          getPaginatedData.map((tx: any, index:number) => {
            if (tx.event === "deposit") {
              return <DepositTx tx={tx} key={tx.transactionHash}  />;
            } else {
              return <WithdrawTx tx={tx} key={tx.transactionHash} />;
            }
          })
        );

      case "loading":
        if (preLoadData.length > 0) {          
          return (
            getPaginatedData.length !== 0 &&
            getPaginatedData.map((tx: any) => {
             
                return <HalfLoadingTx tx={tx} key={tx.transactionHash} />;
            
            })
          );
        } else {
          return (
            <Flex flexDir={"column"} rowGap={"8px"}>
              <LoadingTx />
              <LoadingTx />
            </Flex>
          );
        }
    }
  }, [tData.loadingState, getPaginatedData, preLoadData]);

  return (
    <Flex
      flexDir={"column"}
      rowGap={"8px"}
      justifyContent={"space-between"}
      h={"calc(100vh - 250px)"}
      bg={"transparent"}
      w="100%"
    >
      <Flex
        id={"tx-history"}
        flexDir={"column"}
        bg={"transparent"}
        overflow={"scroll"}
        overflowX={"hidden"}
        rowGap={"8px"}
        h={"calc(100vh - 356px)"}
      >
        {txes}
      </Flex>
      {getLayerFiltered.length > 2 && tData.loadingState === "present" && (
        <Flex h="100px" justifyContent={"center"} alignItems={"center"}>
          <Button
            bg="transparent"
            border={"1px solid #313442"}
            fontSize={"12px"}
            fontWeight={500}
            _hover={{}}
            _active={{}}
            onClick={() => setNumData(numData + 2)}
          >
            Load more
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
