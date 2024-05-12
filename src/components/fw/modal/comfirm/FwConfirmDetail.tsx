import { Box, HStack, Flex, Center, Text } from "@chakra-ui/react";
import { ModalType } from "@/types/fw";
import TipSymbol from "assets/icons/fw/tip_fw.svg";
import GasStationSymbol from "assets/icons/fw/gas_station_fw.svg";
import Pencil from "assets/icons/fw/pencil.svg";
import EthSymbol from "assets/icons/fw/eth_fw.svg";
import ThanosSymbol from "assets/icons/fw/thanos_symbol.svg";
import Image from "next/image";

interface TransactionDetailProps {
  title: string;
  mainValue: string;
  subValue: string;
  iconSrc: any;
}

const FwTransactionDetail: React.FC<TransactionDetailProps> = ({
  title,
  mainValue,
  subValue,
  iconSrc,
}) => {
  return (
    <Box mt={title !== "Send" ? "24px" : "0"}>
      <Text
        fontSize={"12px"}
        fontWeight={500}
        color={"#A0A3AD"}
        lineHeight={"18px"}
      >
        {title}
      </Text>
      <Box>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"32px"} fontWeight={600} lineHeight={"48px"}>
            {mainValue}
          </Text>
          <Center
            width='32px'
            height='32px'
            bg={title != "Send" ? "#383736" : "#FFFFFF"}
            borderRadius='2px'
          >
            <Image
              src={iconSrc}
              alt={title !== "Send" ? "ThanosSymbol" : "EthSymbol"}
            />
          </Center>
        </Flex>
      </Box>
      <Text
        fontWeight={400}
        fontSize={"14px"}
        lineHeight={"21px"}
        color={"#E3E4C0"}
      >
        <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>(</span>
        {subValue}
        <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>)</span>
      </Text>
    </Box>
  );
};

interface FeeDetailProps {
  title: string;
  mainAmount: string;
  subAmount: string;
  modalType?: ModalType; // ModalType을 직접 사용
}

interface FwConfirmDetailProps {
  modalType: ModalType;
}

const FeeDetail: React.FC<FeeDetailProps> = ({
  title,
  mainAmount,
  subAmount,
  modalType,
}) => {
  return (
    <HStack
      justify='space-between'
      lineHeight={"18px"}
      mt={title !== "Service fee" ? "6px" : "0"}
    >
      <Flex>
        <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"} mr={"2px"}>
          {title}
        </Text>
        {title == "Service fee" && (
          <Box ml={"2px"}>
            <Image src={TipSymbol} alt={"TipSymbol"} />
          </Box>
        )}
      </Flex>
      <Flex>
        {title == "Service fee" && modalType === ModalType.History && (
          <Image src={Pencil} alt={"Pencil"} />
        )}
        {title == "Network fee" && (
          <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
        )}
        <Text fontWeight={600} fontSize={"12px"} mx={"4px"}>
          {mainAmount}
        </Text>
        <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
          <span style={{ fontSize: "10px", lineHeight: "15px" }}>(</span>
          {subAmount}
          <span style={{ fontSize: "10px", lineHeight: "15px" }}>)</span>
        </Text>
      </Flex>
    </HStack>
  );
};

export default function FwConfirmDetail({ modalType }: FwConfirmDetailProps) {
  return (
    <Box
      bg='#15161D'
      px={"20px"}
      py={"16px"}
      border={"1px, 1px, 0px, 1px"}
      borderRadius={"8px"}
    >
      <FwTransactionDetail
        title='Send'
        mainValue='10 USDC'
        subValue='$99.00'
        iconSrc={ThanosSymbol}
      />
      <FwTransactionDetail
        title='Receive'
        mainValue='9.988 USDC'
        subValue='$99.00'
        iconSrc={EthSymbol}
      />

      <Box mt={"24px"} borderTop='1px solid #313442' pt={"16px"} px={0} pb={0}>
        <FeeDetail
          title='Service fee'
          mainAmount='0.012 USDC'
          subAmount='$0.43'
          modalType={modalType}
        />
        <FeeDetail
          title='Network fee'
          mainAmount='0.16 TON'
          subAmount='$0.43'
        />
      </Box>
    </Box>
  );
}
