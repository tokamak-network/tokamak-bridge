import { Box, Text, Flex, Button } from "@chakra-ui/react";
import Image from "next/image";
import FwUpdateInput from "./FwUpdateInput";
import FwDownArrow from "assets/icons/fw/fwDownArrow.svg";
import GasStationSymbol from "assets/icons/fw/gas_station_fw.svg";
import FwUsdcSymbol from "assets/icons/fw/fwUsdcSymbol.svg";
import { FwInputProps } from "@/components/fw/types";

enum FeeDetailType {
  Receive,
  Time,
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
      justifyContent='space-between'
      my={type == FeeDetailType.Time ? "6px" : ""}
    >
      <Text
        color={"#A0A3AD"}
        fontSize={"12px"}
        fontWeight={400}
        lineHeight={"normal"}
      >
        {title}
      </Text>
      {type == FeeDetailType.Receive && (
        <Flex>
          <Text
            color={"#FFFFFF"}
            fontSize={"12px"}
            fontWeight={600}
            lineHeight={"normal"}
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
              lineHeight={"normal"}
              letterSpacing={"1px"}
            >
              {inputValue ? "98.31" : "-"}
            </Text>
            <Text
              color={"#FFFFFF"}
              fontSize={"10px"}
              fontWeight={400}
              lineHeight={"normal"}
              letterSpacing={"1px"}
            >
              %
            </Text>
          </Flex>
        </Flex>
      )}
      {type == FeeDetailType.Time && (
        <Text
          color={"#DB00FF"}
          fontSize={"12px"}
          fontWeight={600}
          lineHeight={"normal"}
        >
          {inputValue ? "~ 1 day" : "-"}
        </Text>
      )}
      {type == FeeDetailType.Network && (
        <Flex>
          <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
          <Text
            color={"#FFFFFF"}
            fontSize={"12px"}
            fontWeight={600}
            lineHeight={"normal"}
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

export default function FwUpdateFeeDetail(props: FwInputProps) {
  const inputValueCheck = props.inputValue != "";
  return (
    <Box
      width={"364px"}
      bg='#15161D'
      px={"16px"}
      py={"16px"}
      borderRadius={"8px"}
    >
      {/** 상위 버튼 */}
      <Flex
        width={"332px"}
        bg={"#1F2128"}
        border={"1px solid #DB00FF"}
        borderRadius={"32px"}
      >
        <Button
          width={"162px"}
          height={"32px"}
          bg='#DB00FF'
          borderRadius='16px'
          p={"6px 56.5px"}
          _active={{}}
          _hover={{}}
        >
          <Text
            color='#FFFFFF'
            fontSize={"12px"}
            lineHeight={"normal"}
            fontWeight={400}
          >
            Update Fee
          </Text>
        </Button>
        <Button
          width={"162px"}
          height={"32px"}
          borderRadius={"16px"}
          bg={"#transparent"}
          p={"6px 69.5px"}
          _active={{}}
          _hover={{}}
        >
          <Text
            color='#A0A3AD'
            fontSize={"12px"}
            lineHeight={"normal"}
            fontWeight={400}
          >
            Refund
          </Text>
        </Button>
      </Flex>

      <Box
        mt={"16px"}
        p={"6px 16px"}
        border={"1px solid #313442"}
        borderRadius={"8px"}
      >
        <Text
          color={"#A0A3AD"}
          fontSize={"12px"}
          fontWeight={500}
          lineHeight={"normal"}
        >
          Current fee
        </Text>
        <Flex mt={"4px"} justifyContent='space-between'>
          <Text fontSize={"16px"} fontWeight={400} lineHeight={"normal"}>
            0.012
          </Text>
          <Flex>
            <Image src={FwUsdcSymbol} alt={"FwUsdcSymbol"} />
            <Text
              ml={"4px"}
              fontSize={"16px"}
              fontWeight={400}
              lineHeight={"normal"}
            >
              USDC
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex justifyContent={"center"} alignItems={"center"} my={"8px"}>
        <Image src={FwDownArrow} alt={"FwDownArrow"} />
      </Flex>
      <FwUpdateInput
        inputValue={props.inputValue}
        inputWarningCheck={props.inputWarningCheck}
        onInputChange={props.onInputChange}
      />
      <Box mt={"16px"}>
        <FeeDetail
          type={FeeDetailType.Receive}
          title={"Receive"}
          inputValue={inputValueCheck}
        />
        <FeeDetail
          type={FeeDetailType.Time}
          title={"Estimated Time of Arrival"}
          inputValue={inputValueCheck}
        />
        <FeeDetail
          type={FeeDetailType.Network}
          title={"Network fee"}
          inputValue={inputValueCheck}
        />
      </Box>
    </Box>
  );
}
