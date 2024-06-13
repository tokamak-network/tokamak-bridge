import { Box, Flex, Text, Link, Stat } from "@chakra-ui/react";
import TxLink from "@/assets/icons/confirm/link.svg";
import Image from "next/image";
import {
  TransactionHistory,
  Action,
  Status,
} from "@/components/historyn/types";
import GasStationSymbol from "assets/icons/confirm/gas-station.svg";
import GasStationWhiteSymbol from "assets/icons/confirm/gas-station-white.svg";

interface StatusComponentProps {
  label: string;
  transactionData: TransactionHistory;
  lineType: number;
}

export default function StatusComponent(props: StatusComponentProps) {
  const { label, transactionData, lineType } = props;
  const isActive =
    transactionData.status === label &&
    //롤업은 활성화(#FFFFFF) 되지 않는다. - monica
    transactionData.status !== Status.Rollup &&
    // Finalize이면서, 시간이 진행 중(lineType2, 101)이면  활성화 되지 않는다.
    !(lineType === 2 && transactionData.status === Status.Finalize) &&
    !(lineType === 101 && transactionData.status === Status.Finalize);

  const isRelay =
    (lineType === 1 &&
      label === Status.Rollup &&
      transactionData.action === Action.Withdraw) ||
    (lineType === 101 &&
      label === Status.Finalize &&
      transactionData.action === Action.Deposit);

  const isGasFee =
    ((lineType === 0 || lineType === 100) && label === Status.Initiate) ||
    ((lineType === 1 || lineType === 2 || lineType === 3) &&
      label === Status.Finalize);

  const isTransaction = !isRelay && !isGasFee;

  return (
    <Flex h={"38px"} justifyContent={"space-between"} alignItems={"flex-start"}>
      <Text
        fontWeight={600}
        fontSize={"17px"}
        lineHeight={"20px"}
        color={isActive ? "#FFFFFF" : "#A0A3AD"}
      >
        {label}
      </Text>
      {isRelay && (
        <Flex alignItems={"center"}>
          <Flex
            w={"16px"}
            h={"16px"}
            px={"0.88px"}
            py={"1px"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
          </Flex>
          <Text
            ml={"6px"}
            fontWeight={400}
            fontSize={"14px"}
            lineHeight={"20px"}
            color={"#A0A3AD"}
          >
            Relay
          </Text>
        </Flex>
      )}
      {isGasFee && (
        <Box>
          <Flex alignItems={"center"}>
            <Flex
              w={"16px"}
              h={"16px"}
              px={"0.88px"}
              py={"1px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {lineType === 3 ? (
                <Image
                  src={GasStationWhiteSymbol}
                  alt={"GasStationWhiteSymbol"}
                />
              ) : (
                <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
              )}
            </Flex>
            <Text
              ml={"6px"}
              fontWeight={400}
              fontSize={"14px"}
              lineHeight={"20px"}
              color={lineType === 3 ? "#FFFFFF" : "#A0A3AD"}
            >
              0.0099 ETH
            </Text>
          </Flex>
          <Text
            fontWeight={400}
            fontSize={"11px"}
            lineHeight={"16.5px"}
            color={"#A0A3AD"}
            textAlign={"right"}
          >
            $30.63
          </Text>
        </Box>
      )}
      {isTransaction && (
        <Flex alignItems={"center"}>
          <Text
            mr={"6px"}
            fontWeight={400}
            fontSize={"13px"}
            lineHeight={"20px"}
            color={"#A0A3AD"}
          >
            Transaction
          </Text>
          <Flex w={"14px"} h={"14px"}>
            <Image src={TxLink} alt={"TxLink"} />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
