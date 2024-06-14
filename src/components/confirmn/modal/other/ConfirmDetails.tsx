import { Box, Flex, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import NetworkSymbol from "@/components/confirmn/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import {
  TransactionHistory,
  Status,
  Action,
} from "@/components/historyn/types";
import TxLink from "@/assets/icons/confirm/link.svg";
import { BLOCKEXPLORER_CONSTANTS } from "@/components/historyn/constants/index";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import capitalizeFirstLetter from "@/components/confirmn/utils/capitalizeFirstLetter";
import { FwFormatNumber } from "@/components/fw/components/FwFormatNumber";

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
      return tokenPriceWithAmount;
    }
    return "0.00";
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
              <FwFormatNumber
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
                  /** To be updated with the correct values after the proper type design @Robert */
                }/tx/${
                  isInNetwork
                    ? "0xe6854c552980e17af34cb66f7716d76a20b61078f4017bac519a6b119bbfe504"
                    : "0x99276fdfaca49fc2d0874b1ef8b519d54f859c6de66d239c6db204cb8a6e833f"
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
              ${marketPrice}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
