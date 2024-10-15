import { Box, Flex, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import NetworkSymbol from "@/staging/components/new-confirm/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { TransactionHistory } from "@/staging/types/transaction";
import TxLink from "@/assets/icons/confirm/link.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { convertNumber } from "@/utils/trim/convertNumber";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import commafy from "@/utils/trim/commafy";
import { formatNetworkName } from "@/utils/network/convertNetworkName";

interface ConfirmDetailProps {
  isInNetwork: boolean;
  transactionHistory: TransactionHistory;
}

export default function ConfirmDetails(props: ConfirmDetailProps) {
  const { isInNetwork, transactionHistory } = props;

  const { tokenPriceWithAmount: tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: transactionHistory.inToken.name as string,
    amount: convertNumber(
      transactionHistory.inToken.amount,
      transactionHistory.inToken.decimals,
    ),
  });

  const marketPrice = useMemo(() => {
    if (transactionHistory && tokenPriceWithAmount) {
      return `$${commafy(tokenPriceWithAmount)}`;
    }
    return "NA";
  }, [tokenPriceWithAmount, transactionHistory]);

  const networkChainId = isInNetwork
    ? transactionHistory.inNetwork
    : transactionHistory.outNetwork;

  const chainName = getKeyByValue(SupportedChainId, networkChainId) || "";

  const displayNetworkName =
    chainName === "MAINNET" ? "Ethereum" : formatNetworkName(chainName);

  const tokenAddress = isInNetwork
    ? transactionHistory.inToken.address
    : transactionHistory.outToken.address;

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
              tokenType={
                isInNetwork
                  ? (transactionHistory.inToken.symbol as string)
                  : (transactionHistory.outToken.symbol as string)
              }
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
                value={
                  isInNetwork
                    ? convertNumber(
                        transactionHistory.inToken.amount,
                        transactionHistory.inToken.decimals,
                      )
                    : convertNumber(
                        transactionHistory.outToken.amount,
                        transactionHistory.outToken.decimals,
                      )
                }
                tokenSymbol={
                  isInNetwork
                    ? transactionHistory.inToken.symbol
                    : transactionHistory.outToken.symbol
                }
              />
              {tokenAddress && tokenAddress !== "" && (
                <Link
                  target="_blank"
                  href={`${
                    BLOCKEXPLORER_CONSTANTS[
                      isInNetwork
                        ? transactionHistory.inNetwork
                        : transactionHistory.outNetwork
                    ]
                  }/address/${tokenAddress}`}
                  textDecor={"none"}
                  _hover={{ textDecor: "none" }}
                  display={"flex"}
                >
                  <Image src={TxLink} alt={"TxLink"} />
                </Link>
              )}
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
