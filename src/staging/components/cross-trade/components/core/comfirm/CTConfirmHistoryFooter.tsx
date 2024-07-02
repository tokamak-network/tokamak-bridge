import { Box, Text, Flex, Center } from "@chakra-ui/react";
import ThanosSymbol_bg from "assets/icons/ct/thanos_symbol_bg_white.svg";
import txlink from "@/assets/icons/ct/txlink.svg";
import Image from "next/image";
import CTTimeline from "./CTTimeLine";
import { CT_History, isInCT_REQUEST } from "@/staging/types/transaction";
import { useMemo } from "react";

interface TransactionItemProps {
  title: string;
  isActive: boolean;
}
const TransactionItem = (props: TransactionItemProps) => {
  const { title, isActive } = props;
  return (
    <Flex justifyContent={"space-between"} mb={isActive ? undefined : "24px"}>
      <Text
        fontWeight={600}
        fontSize={"15px"}
        lineHeight={"20px"}
        color={isActive ? "#FFFFFF" : "#A0A3AD"}
      >
        {title}
      </Text>
      {!isActive && (
        <Flex>
          <Text
            fontWeight={400}
            fontSize={"13px"}
            lineHeight={"20px"}
            color={"#A0A3AD"}
            mr={"4px"}
          >
            Transaction
          </Text>
          <Flex cursor="pointer">
            <Image src={txlink} alt={"txlink"} />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default function CTConfirmHistoryFooter(props: {
  txData: CT_History | null;
}) {
  const { txData } = props;

  if (txData === null) return null;
  const keyLength = Object.keys(txData.transactionHashes).length;
  const TransactionHistory = useMemo(() => {
    return (
      <Box ml={"18px"} flex={1}>
        {Object.entries(txData.transactionHashes).map(([key, hash], index) => {
          const isActive = keyLength - 1 === index;
          if (typeof hash === "string") {
            return <TransactionItem title={key} isActive={isActive} />;
          }
          return hash.map((tx, index) => {
            const isActiveOnUpdateFee = isActive && index === hash.length - 1;
            return (
              <TransactionItem title={key} isActive={isActiveOnUpdateFee} />
            );
          });
        })}
      </Box>
    );
  }, [txData.transactionHashes, keyLength]);

  return (
    <>
      <Box
        mt={"16px"}
        bg="#15161D"
        py={"16px"}
        px={"20px"}
        border={"1px, 1px, 0px, 1px"}
        borderRadius={"8px"}
      >
        <Flex>
          <Box width={"auto"}>
            <CTTimeline lineType={keyLength} />
          </Box>
          {TransactionHistory}
        </Flex>
      </Box>
      <Box mt={"12px"} pb={"4px"}>
        <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
          Estimated Time of Arrival: ~1 day
        </Text>
        <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
          Estimated Time of Arrival: ~1 day
        </Text>
      </Box>
    </>
  );
}
