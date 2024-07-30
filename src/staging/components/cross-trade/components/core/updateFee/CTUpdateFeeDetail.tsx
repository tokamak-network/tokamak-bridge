import { Box, Text, Flex, Button } from "@chakra-ui/react";
import Image from "next/image";
import CTUpdateInput from "./CTUpdateInput";
import CTDownArrow from "assets/icons/ct/ctDownArrow.svg";
import GasStationSymbol from "assets/icons/ct/gas_station_ct.svg";
import CTUsdcSymbol from "assets/icons/ct/ctUsdcSymbol.svg";
import { CTInputProps } from "@/staging/components/cross-trade/types";
import { CT_History } from "@/staging/types/transaction";
import { useMemo } from "react";
import { formatUnits } from "@/utils/trim/convertNumber";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { TokenInfo } from "@/types/token/supportedToken";

enum FeeDetailType {
  Receive,
  Network,
}

interface FeeDetailProps {
  type: FeeDetailType;
  title: string;
  inputValue: boolean;
}

const FeeDetail: React.FC<FeeDetailProps> = ({ type, title, inputValue }) => {
  return (
    <Flex
      justifyContent="space-between"
      mt={type == FeeDetailType.Network ? "6px" : undefined}
    >
      <Text
        color={"#A0A3AD"}
        fontSize={"12px"}
        fontWeight={400}
        lineHeight={"18px"}
      >
        {title}
      </Text>
      {type == FeeDetailType.Receive && (
        <Flex>
          <Text
            color={"#FFFFFF"}
            fontSize={"12px"}
            fontWeight={600}
            lineHeight={"18px"}
          >
            {inputValue ? "9.998" : "-"} USDC
          </Text>
          <Flex
            ml={"6px"}
            px={"4px"}
            borderRadius={"4px"}
            alignItems={"center"}
            bg={"#DB00FF"}
          >
            <Text
              color={"#FFFFFF"}
              fontSize={"10px"}
              fontWeight={500}
              lineHeight={"18px"}
            >
              {inputValue ? "98.31" : "-"}
            </Text>
            <Text
              color={"#FFFFFF"}
              fontSize={"10px"}
              fontWeight={400}
              lineHeight={"18px"}
              mx="1px"
            >
              %
            </Text>
          </Flex>
        </Flex>
      )}

      {type == FeeDetailType.Network && (
        <Flex>
          <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
          <Text
            color={"#FFFFFF"}
            fontSize={"12px"}
            fontWeight={600}
            lineHeight={"18px"}
            mx={"4px"}
          >
            {inputValue ? "0.16" : "- "}
            ETH
          </Text>
          <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
            <span style={{ fontSize: "10px", lineHeight: "15px" }}>(</span>$
            {inputValue ? "0.43" : "-"}
            <span style={{ fontSize: "10px", lineHeight: "15px" }}>)</span>
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

interface AdditionalDetailProps {
  recommendCheck: boolean;
  recommendValue: string;
  onRecommendRefresh: () => void;
  txData: CT_History;
}

export default function CTUpdateFeeDetail(
  props: CTInputProps & AdditionalDetailProps
) {
  const { txData } = props;
  // update fee 상세
  // 공백일때는 값이 들어가면 안된다.
  // 하지만, recommendCheck가 true이면 값이 들어가야 한다.
  const inputValueCheck = props.inputValue != "" || props.recommendCheck;
  const currentServiceFee = useMemo(() => {
    return formatUnits(txData.serviceFee.toString(), txData.inToken.decimals);
  }, [txData.serviceFee, txData.inToken]);

  return (
    <>
      <Box
        mt={"16px"}
        p={"8px 16px"}
        border={"1px solid #313442"}
        borderRadius={"8px"}
      >
        <Text
          color={"#A0A3AD"}
          fontSize={"12px"}
          fontWeight={500}
          lineHeight={"18px"}
        >
          Current fee
        </Text>
        <Flex mt={"4px"} justifyContent="space-between">
          <Text fontSize={"16px"} fontWeight={400} lineHeight={"24px"}>
            {currentServiceFee}
          </Text>
          <Flex alignItems={"center"}>
            <TokenSymbol
              tokenType={txData.inToken.symbol as TokenInfo["tokenSymbol"]}
              w={20}
              h={20}
            />
            <Text
              ml={"4px"}
              fontSize={"16px"}
              fontWeight={400}
              lineHeight={"24px"}
            >
              {txData.inToken.symbol}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        p={"4px"}
        my={"6px"}
      >
        <Image src={CTDownArrow} alt={"CTDownArrow"} />
      </Flex>
      <CTUpdateInput
        // input 관련 props
        inputValue={props.inputValue}
        inputWarningCheck={props.inputWarningCheck}
        onInputChange={props.onInputChange}
        onInputFocus={props.onInputFocus}
        // input 관련 recommend 관련 props
        recommendCheck={props.recommendCheck}
        recommendValue={props.recommendValue}
        onRecommendRefresh={props.onRecommendRefresh}
        tokenInfo={txData.inToken}
      />
      <Box mt={"16px"}>
        <FeeDetail
          type={FeeDetailType.Receive}
          title={"Receive"}
          inputValue={inputValueCheck}
        />
        <FeeDetail
          type={FeeDetailType.Network}
          title={"Network fee"}
          inputValue={inputValueCheck}
        />
      </Box>
    </>
  );
}
