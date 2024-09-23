import { Action, TransactionHistory } from "@/staging/types/transaction";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import ConfirmDetails from "./ConfirmDetails";
import NetworkSymbol from "../../NetworkSymbol";
import Link from "next/link";
import { trimAddress } from "@/utils/trim";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import {
  NetworkDisplayName,
  SupportedChainId,
} from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";

interface TransactionInfoProps {
  address: `0x${string}` | undefined;
  tx: TransactionHistory;
}

export const TransactionInfo: React.FC<TransactionInfoProps> = (props) => {
  const { tx, address } = props;
  const bridgeChainId =
    tx.action === Action.Deposit ? tx.outNetwork : tx.inNetwork;

  const bridgeChainName = getKeyByValue(SupportedChainId, bridgeChainId) || "";

  const bridgeName = NetworkDisplayName[bridgeChainName];
  return (
    <Box
      px={"16px"}
      py={"12px"}
      border={"1px solid #313442"}
      borderRadius={"8px"}
      bg="#0F0F12"
    >
      <Box>
        <ConfirmDetails isInNetwork={true} transactionHistory={tx} />
        <ConfirmDetails isInNetwork={false} transactionHistory={tx} />
      </Box>
      <Box borderTop="1px solid #313442" mt={"16px"} pt={"16px"}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"18px"}
            color={"#A0A3AD"}
          >
            Bridge
          </Text>
          <Flex>
            <NetworkSymbol
              networkI={bridgeChainId}
              networkH={16}
              networkW={16}
            />
            <Text
              ml={"4px"}
              fontWeight={500}
              fontSize={"12px"}
              lineHeight={"18px"}
              color={"#FFFFFF"}
            >
              {`${bridgeName} Standard Bridge`}
            </Text>
          </Flex>
        </Flex>
        <Flex mt={"6px"} justifyContent={"space-between"} alignItems={"center"}>
          <Text
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"18px"}
            color={"#A0A3AD"}
          >
            {tx?.action === Action.Withdraw ? "Withdraw" : "Deposit"}
            {/** Add a space */ " "}
            to
          </Text>
          <Link
            target="_blank"
            href={`${
              BLOCKEXPLORER_CONSTANTS[tx.outNetwork]
            }/address/${address}`}
          >
            <Text
              fontWeight={600}
              fontSize={"12px"}
              lineHeight={"18px"}
              color={"#FFFFFF"}
              cursor={"pointer"}
            >
              {trimAddress({ address: address, firstChar: 6 })}
            </Text>
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};
