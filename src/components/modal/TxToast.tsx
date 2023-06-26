import { Flex, useToast } from "@chakra-ui/react";
import CloseButton from "../button/CloseButton";
import { useRecoilState } from "recoil";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { transactionData } from "@/recoil/global/transaction";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useMemo } from "react";

type TransactionToastProp = {
  //   isTop: boolean;
};

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
      test
    </Flex>
  );
}

function TxToast() {
  const toast = useToast();
  const { isLoading } = useGetTransaction();
  const [tx, setTransactionData] = useRecoilState(transactionData);
  const { mode } = useGetMode();

  const testData = {
    hash: "test1",
  };

  // const dd = useMemo(() => {
  //   toast({
  //     position: "top-right",
  //     variant: "solid",
  //     isClosable: false,
  //     id: testData.hash,
  //     duration: 1000 * 60 * 60,
  //     render: () => <TransactionToast />,
  //   });
  // }, [testData]);

  return null;
  // return <>{dd}</>;
}

export default TxToast;
