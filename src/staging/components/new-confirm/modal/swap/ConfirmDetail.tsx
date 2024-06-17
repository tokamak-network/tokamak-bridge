import { Box, Flex, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import NetworkSymbol from "@/staging/components/new-confirm/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  TransactionHistory,
  Status,
  Action,
} from "@/staging/components/new-history/types";
import TxLink from "@/assets/icons/confirm/link.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/components/new-history/constants/index";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { CTFormatNumber } from "@/staging/components/cross-trade/components/CTFormatNumber";
import { TokenInfo } from "types/token/supportedToken";
import getBlockExplorerUrl from "@/staging/components/new-confirm/utils/getBlockExplorerUrl";

interface Token {
  chainId: number;
}

interface ConfirmDetailProps {
  isInNetwork: boolean;
  inToken:
    | (TokenInfo & {
        token: Token;
        amountBN: BigInt | null;
        parsedAmount: string | null;
        tokenAddress: string | null;
      })
    | null;
}

export default function ConfirmDetails(props: ConfirmDetailProps) {
  const { isInNetwork, inToken } = props;

  const { tokenPriceWithAmount: tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: inToken?.tokenSymbol as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  const marketPrice = useMemo(() => {
    if (tokenPriceWithAmount) {
      return tokenPriceWithAmount;
    }
    return "0.00";
  }, [tokenPriceWithAmount]);

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
          {isInNetwork ? "Sell" : "Receive"}
        </Text>
      </Box>
      <Box>
        <Flex>
          <Flex alignItems={"center"}>
            <TokenSymbol
              w={24}
              h={24}
              tokenType={inToken?.tokenSymbol as string}
            />
          </Flex>
          <Box ml={"8px"}>
            <Flex>
              <CTFormatNumber
                style={{
                  marginRight: "6px",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                }}
                value={inToken?.parsedAmount}
                tokenSymbol={inToken?.tokenSymbol}
              />
              <Link
                target='_blank'
                href={
                  inToken?.token.chainId
                    ? `${
                        getBlockExplorerUrl(inToken?.token.chainId)
                        /** To be updated with the correct values after the proper type design @Robert */
                      }/tx/${
                        isInNetwork
                          ? "0x99276fdfaca49fc2d0874b1ef8b519d54f859c6de66d239c6db204cb8a6e833f"
                          : "0x99276fdfaca49fc2d0874b1ef8b519d54f859c6de66d239c6db204cb8a6e833f"
                      }`
                    : ""
                }
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
              ${marketPrice}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
