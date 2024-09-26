import Image from "next/image";
import { Box, Flex, Text, Center, HStack } from "@chakra-ui/react";
import ThanosSymbol from "assets/icons/ct/thanos_symbol.svg";
import GasStationSymbol from "assets/icons/ct/gas_station_ct.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { CT_History } from "@/staging/types/transaction";
import { formatUnits } from "@/utils/trim/convertNumber";
import useConnectedNetwork from "@/hooks/network";
import formatNumber from "@/staging/utils/formatNumbers";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import commafy from "@/utils/trim/commafy";

export default function CTRefundDetail(props: { txData: CT_History | null }) {
  const { txData } = props;
  if (!txData) return null;
  const { inToken, inNetwork } = txData;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const tokenAmount = txData.L2_subgraphData?._totalAmount;
  const { tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: inToken.name,
    amount: formatUnits(tokenAmount, inToken.decimals),
  });

  return (
    <Box mt={"16px"}>
      <Box>
        <Text
          fontSize={"12px"}
          fontWeight={500}
          color={"#A0A3AD"}
          lineHeight={"18px"}
        >
          Refund
        </Text>
        <Box>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"32px"} fontWeight={600} lineHeight={"48px"}>
              {formatNumber(formatUnits(tokenAmount, inToken.decimals))}{" "}
              {inToken?.symbol}
            </Text>
            <TokenSymbolWithNetwork
              tokenSymbol={inToken?.symbol}
              chainId={inNetwork}
              networkSymbolW={22}
              networkSymbolH={22}
              symbolW={40}
              symbolH={40}
              bottom={-0.5}
              right={-0.5}
            />
          </Flex>
        </Box>
        <Text
          fontWeight={400}
          fontSize={"14px"}
          lineHeight={"21px"}
          py={"1px"}
          color={"#E3E4C0"}
        >
          <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>(</span>$
          {commafy(tokenPriceWithAmount)}
          <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>)</span>
        </Text>
      </Box>
      <Box mt={"16px"} borderTop="1px solid #313442" pt={"16px"} px={0} pb={0}>
        <HStack justify="space-between">
          <Flex>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              color={"#A0A3AD"}
              mr={"2px"}
            >
              Refund network
            </Text>
          </Flex>
          <Flex>
            <Flex w={"14px"} maxW={"14px"} h={"14px"} maxH={"14px"}>
              <Image src={TitanNetworkSymbol} alt={"TitanNetworkSymbol"} />
            </Flex>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              lineHeight={"14px"}
              ml={"4px"}
            >
              {isConnectedToMainNetwork ? "Titan" : "Titan Sepolia"}
            </Text>
          </Flex>
        </HStack>
        <HStack justify="space-between" mt={"6px"}>
          <Flex>
            <Text
              fontWeight={400}
              fontSize={"12px"}
              color={"#A0A3AD"}
              mr={"2px"}
            >
              Network fee
            </Text>
          </Flex>
          <Flex>
            <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
            <Text fontWeight={600} fontSize={"12px"} mx={"4px"}>
              0.16 ETH
            </Text>
            <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>(</span>
              $0.43
              <span style={{ fontSize: "10px", lineHeight: "15px" }}>)</span>
            </Text>
          </Flex>
        </HStack>
      </Box>
    </Box>
  );
}
