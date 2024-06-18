import { Box, Flex, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import NetworkSymbol from "@/staging/components/new-confirm/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  TransactionHistory,
  Status,
  Action,
} from "@/staging/types/transaction";
import TxLink from "@/assets/icons/confirm/link.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import capitalizeFirstLetter from "@/staging/utils/capitalizeFirstLetter";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { getTokenAddress } from "@/staging/utils/getAddressByNetworkAndToken";

interface ConfirmDetailProps {
  isInNetwork: boolean;
  transactionHistory: TransactionHistory | undefined;
}

export default function ConfirmDetails(props: ConfirmDetailProps) {
  const { isInNetwork, transactionHistory } = props;

  if (!transactionHistory) {
    return null;
  }
  const { tokenPriceWithAmount: tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: transactionHistory.tokenSymbol as string,
    amount: Number(transactionHistory.amount.replaceAll(",", "")),
  });

  const marketPrice = useMemo(() => {
    if (transactionHistory && tokenPriceWithAmount) {
      return `$${tokenPriceWithAmount}`;
    }
    return "NA";
  }, [tokenPriceWithAmount, transactionHistory]);

  const networkName = isInNetwork
    ? transactionHistory.inNetwork
    : transactionHistory.outNetwork;

  const displayNetworkName =
    networkName === "MAINNET" ? "Ethereum" : capitalizeFirstLetter(networkName);

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      mt={isInNetwork ? undefined : "16px"}
    >
      <Box>
        <Text
          fontWeight={500}
          fontSize={"14px"}
          lineHeight={"21px"}
          color={"#FFFFFF"}
        >
          {isInNetwork ? "Send" : "Receive"}
        </Text>
        <Flex mt={"4px"}>
          <NetworkSymbol
            networkI={
              isInNetwork
                ? transactionHistory.inNetwork
                : transactionHistory.outNetwork
            }
            networkH={14}
            networkW={14}
          />
          <Text
            ml={"6px"}
            fontWeight={400}
            fontSize={"11px"}
            lineHeight={"14px"}
            color={"#A0A3AD"}
          >
            {displayNetworkName}
          </Text>
        </Flex>
      </Box>
      <Box>
        <Flex>
          <Flex alignItems={"center"}>
            <TokenSymbol
              w={24}
              h={24}
              tokenType={transactionHistory.tokenSymbol as string}
            />
          </Flex>
          <Box ml={"8px"}>
            <Flex>
              <FormatNumber
                style={{
                  marginRight: "6px",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                }}
                value={transactionHistory.amount}
                tokenSymbol={transactionHistory.tokenSymbol}
              />
              <Link
                target='_blank'
                href={`${
                  BLOCKEXPLORER_CONSTANTS[
                    isInNetwork
                      ? transactionHistory.inNetwork
                      : transactionHistory.outNetwork
                  ]
                }/address/${
                  isInNetwork
                    ? getTokenAddress(
                        transactionHistory.inNetwork,
                        transactionHistory.tokenSymbol as string
                      )
                    : getTokenAddress(
                        transactionHistory.outNetwork,
                        transactionHistory.tokenSymbol as string
                      )
                }`}
                textDecor={"none"}
                _hover={{ textDecor: "none" }}
                display={"flex"}
              >
                <Image src={TxLink} alt={"TxLink"} />
              </Link>
            </Flex>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              lineHeight={"18px"}
              color={"#A0A3AD"}
            >
              {marketPrice}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
