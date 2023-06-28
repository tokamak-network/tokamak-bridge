import { Flex, useToast } from "@chakra-ui/react";
import CloseButton from "../button/CloseButton";
import { useRecoilState } from "recoil";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { transactionData } from "@/recoil/global/transaction";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useMemo, useState } from "react";
import { useTransaction } from "@/hooks/tx/useTx";
import "@/css/toast.css";
import { TxInterface } from "@/types/tx/txType";

type TransactionToastProp = TxInterface;

function TransactionToast(props: TransactionToastProp) {
  const {} = props;
  return (
    <Flex
      w={"340px"}
      h={"84px"}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bgColor={"#1F2128"}
    >
      {props.transactionHash}
    </Flex>
  );
}

function TxToast() {
  const toast = useToast();
  const { isLoading } = useGetTransaction();
  const [tx, setTransactionData] = useRecoilState(transactionData);
  const { mode } = useGetMode();
  const [isToasted, setIsToasted] = useState<string[]>([]);

  const { confirmedTransaction } = useTransaction();

  console;
  console.log(confirmedTransaction);

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
          isClosable: false,
          id: txHash,
          duration: 5000,
          render: () => <TransactionToast {...transaction[1]} />,
        });
        setIsToasted([...isToasted, txHash]);
      }
    });
  }, [confirmedTransaction]);

  return <>{makeToast}</>;
}

export default TxToast;
