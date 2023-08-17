import { Flex, Text, Button, Spinner } from "@chakra-ui/react";
import WithdrawTx from "./WithdrawTx";
import DepositTx from "./DepositTx";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { searchTxStatus } from "@/recoil/userHistory/searchTx";
import LoadingTx from "./LoadingTx";
export default function ActivityContainer() {
  const tData = useGetTransaction();
  const [numData, setNumData] = useState(2);
  const searchTxString = useRecoilValue(searchTxStatus);

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
      return tData.depositTxs;
    } else {
      const filteredTx = tData.depositTxs.filter((tx: any) => {
        return (
          tx.l1txHash.includes(searchTxString.id) ||
          tx.l2txHash.includes(searchTxString.id)
        );
      });
      return filteredTx;
    }
  }, [tData.depositTxs, searchTxString]);

  const getPaginatedData = useMemo(() => {
    const startIndex = 0;
    const endIndex = startIndex + numData;
    return filteredTx.slice(startIndex, endIndex);
  }, [filteredTx]);

  const txes = useMemo(() => {
    switch (tData.loadingState) {
      case "absent":
        return <Flex>No txs</Flex>;

      case "present":
        return (
          getPaginatedData.length !== 0 &&
          getPaginatedData.map((tx: any) => {
            if (tx.event === "deposit") {
              return <DepositTx tx={tx} key={tx.transactionHash} />;
            } else {
              return <WithdrawTx tx={tx} key={tx.transactionHash} />;
            }
          })
        );

      case "loading":
        return (
          <Flex flexDir={'column'} rowGap={'8px'}>
            <LoadingTx />
            <LoadingTx />
          </Flex>
        );
    }
  }, [tData.loadingState]);
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
        {/* {getPaginatedData.length !== 0 &&
          getPaginatedData.map((tx: any) => {
            if (tx.event === "deposit") {
              return <DepositTx tx={tx} key={tx.transactionHash} />;
            } else {
              return <WithdrawTx tx={tx} key={tx.transactionHash} />;
            }
          })} */}
        {txes}
      </Flex>
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
    </Flex>
  );
}
