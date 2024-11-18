import { StandardHistory } from "@/staging/types/transaction";
import { Box, Flex, Text } from "@chakra-ui/react";
import ConfirmDetails from "../../new-confirm/components/core/other/ConfirmDetails";
import NetworkSymbol from "../../new-confirm/components/NetworkSymbol";
import { getBridgeL2ChainId } from "../../new-confirm/utils";
import {
  NetworkDisplayName,
  SupportedChainId,
} from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";

type TransactionInfoProps = {
  transaction: StandardHistory;
};

const TransactionInfo: React.FC<TransactionInfoProps> = ({ transaction }) => {
  const l2ChainId = getBridgeL2ChainId(transaction) ?? SupportedChainId.TITAN;
  const chainName = getKeyByValue(SupportedChainId, l2ChainId) || "";
  const displayNetworkName = NetworkDisplayName[chainName];
  return (
    <Flex flexDir={"column"}>
      <Box
        px={"16px"}
        py={"12px"}
        border={"1px solid #313442"}
        borderRadius={"8px 8px 0 0"}
        bg="#0F0F12"
      >
        <ConfirmDetails isInNetwork={false} transactionHistory={transaction} />
      </Box>
      <Box
        px={"16px"}
        py={"12px"}
        border={"1px solid #313442"}
        borderTop={"0px"}
        borderRadius={"0 0 8px 8px"}
        bg="#0F0F12"
      >
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
            <NetworkSymbol networkI={l2ChainId} networkH={16} networkW={16} />
            <Text
              ml={"4px"}
              fontWeight={500}
              fontSize={"12px"}
              lineHeight={"18px"}
              color={"#FFFFFF"}
            >
              {`${displayNetworkName} Standard Bridge`}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default TransactionInfo;
