import { Flex, Text, Button } from "@chakra-ui/react";
import WithdrawTx from "./WithdrawTx";
import DepositTx from "./DepositTx";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { useEffect, useState } from "react";

export default function ActivityContainer() {
  const tData = useGetTransaction();
  const [numData, setNumData] = useState(2);
    
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

  const getPaginatedData = () => {
    const startIndex = 0;
    const endIndex = startIndex + numData;
    return tData.depositTxs.slice(startIndex, endIndex);
  };
  

  return (
    <Flex
      flexDir={"column"}
      rowGap={"8px"}
      justifyContent={"space-between"}
      h={"calc(100vh - 250px)"}
      bg={"transparent"}
      w="100%"
      //   alignItems={'center'}
    >
      <Flex
        id={"tx-history"}
        flexDir={"column"}
        bg={"transparent"}
        overflow={"scroll"}
        overflowX={"hidden"}
        // css={{
        //   "&::-webkit-scrollbar": {
        //     // border:'1px solid blue',
        //     position: "absolute",
        //     left: "14px",
        //     background: "transparent",
        //     height: "100%",
        //     width: "8px",
        //     marginLeft: "14px",
        //     zIndex: 10000,
        //   },
        //   "::-webkit-scrollbar-thumb": {
        //     background: "#0F0F12",
        //     borderRadius: "4px",
        //   },
        //   "::-webkit-scrollbar-thumb:hover": {
        //     background: "#0F0F12",
        //   },
        //   "&::-webkit-scrollbar-track:hover": {
        //     background: "transparent",
        //   },
        // }}
        rowGap={"8px"}
        h={"calc(100vh - 356px)"}
      >
        {getPaginatedData().length !== 0 &&
          getPaginatedData().map((tx: any) => {
            if (
              tx.event === "deposit"
            ) {
              return <DepositTx tx={tx}  key={tx.transactionHash}/>;
            } 
            else {
              return <WithdrawTx tx={tx} key={tx.transactionHash} messenger={tData.crossChainMessenger}/>;
            }
          })}
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
