import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Button,
  Flex,
  Circle,
} from "@chakra-ui/react";
import useFxOptionModal from "@/components/fw/hooks/useFwOptionModal";
import CloseButton from "@/components/button/CloseButton";
import FwComingOptionDetail from "../../modal/option/FwComingOptionDetail";
import { FwTooltip } from "@/components/fw/components/FwTooltip";
import { useRecoilState } from "recoil";
import { confirmWithdrawStats } from "@/recoil/modal/atom";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useMediaView from "@/hooks/mediaView/useMediaView";
import commafy from "@/utils/trim/commafy";

export default function FwComingModal() {
  const { mobileView } = useMediaView();
  const { fwOptionModal, onCloseFwOptionModal } = useFxOptionModal();
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);
  const { inToken } = useInOutTokens();

  const handleConfirm = () => {
    setWithdrawStatus({ isOpen: true });
    onCloseFwOptionModal();
  };

  function formatNumber(value: string | number | undefined | null) {
    // 숫자를 받아 문자열로 변환
    if (value === undefined || value === null) {
      return "-";
    }

    const num = parseFloat(value.toString());

    // 만약 num이 0이면 0 반환
    if (num === 0) {
      return "0";
    }

    // 숫자를 소수점 기준으로 나눔
    const parts = value.toString().split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";

    // 정수 부분을 3자리마다 콤마 추가
    const formattedInteger = parseInt(integerPart, 10).toLocaleString("en-US");

    // 소수 부분 포맷팅
    let formattedDecimal;
    if (parseInt(integerPart, 10) === 0) {
      // 정수 부분이 0인 경우 소수점 6자리
      formattedDecimal = decimalPart.padEnd(6, "0").slice(0, 6);
    } else {
      // 정수 부분이 0이 아닌 경우 소수점 4자리
      formattedDecimal = decimalPart.padEnd(4, "0").slice(0, 4);
    }

    return formattedInteger + (formattedDecimal ? "." + formattedDecimal : "");
  }

  // 테스트 케이스
  console.log(formatNumber("1111.598840")); // 1,111.5988
  console.log(formatNumber("1000000.1980123")); // 1,000,000.1980
  console.log(formatNumber("0.1234567")); // 0.123456
  console.log(formatNumber("0")); // 0
  console.log(formatNumber("0.0")); // 0
  console.log(formatNumber("0.00")); // 0
  console.log(formatNumber("0.000")); // 0

  return (
    <Modal
      isOpen={fwOptionModal}
      onClose={onCloseFwOptionModal}
      motionPreset={mobileView ? "slideInBottom" : "none"}
      isCentered={mobileView ? false : true}
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        marginTop={mobileView ? "auto" : undefined}
        marginBottom={mobileView ? "0" : undefined}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Withdraw Option
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseFwOptionModal} />
        </Box>
        <ModalBody p={0}>
          <FwComingOptionDetail />
          <Flex
            alignItems='center'
            justifyContent='space-between'
            mt={"12px"}
            border={"1px solid #007AFF"}
            py={"16px"}
            px={"20px"}
            borderRadius={"8px"}
            cursor={"pointer"}
          >
            <Box>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Official Standard Bridge
              </Text>
              <Box mt={"12px"}>
                <Flex alignItems='center'>
                  <Text
                    fontWeight={400}
                    fontSize={"10px"}
                    lineHeight={"20px"}
                    color={"#A0A3AD"}
                  >
                    Receive
                  </Text>
                  <FwTooltip
                    tooltipLabel={"text will be changed"}
                    style={{ marginLeft: "2px" }}
                  />
                </Flex>
                <Text
                  fontWeight={600}
                  fontSize={"22px"}
                  lineHeight={"33px"}
                  color={"#007AFF"}
                >
                  {formatNumber(inToken?.parsedAmount)} {inToken?.tokenSymbol}
                </Text>
              </Box>
              <Box mt={"12px"}>
                <Text
                  fontSize={"10px"}
                  fontWeight={400}
                  lineHeight={"15px"}
                  color={"#A0A3AD"}
                >
                  Crosstrade is a common bridge service.
                </Text>
                <Text
                  fontSize={"10px"}
                  fontWeight={400}
                  lineHeight={"15px"}
                  color={"#A0A3AD"}
                >
                  Network fee is more expensive than service fee
                </Text>
              </Box>
            </Box>
            <Circle
              size='56px'
              border='1px solid #007AFF'
              bg='#15161D'
              pb={"8px"}
              pt={"6px"}
            >
              <Box>
                <Text
                  fontWeight={600}
                  fontSize={"22px"}
                  height={"29px"}
                  lineHeight={"33px"}
                  letterSpacing={"-0.05em"}
                  color={"#007AFF"}
                  textAlign='center'
                >
                  7
                </Text>
                <Text
                  fontWeight={400}
                  fontSize={"10px"}
                  lineHeight={"15px"}
                  color={"#007AFF"}
                  textAlign='center'
                >
                  days
                </Text>
              </Box>
            </Circle>
          </Flex>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            mt={"12px"}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: "#007AFF",
              color: "#FFFFFF",
            }}
            _active={{}}
            _hover={{}}
            _focus={{}}
            onClick={handleConfirm}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
              Next
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
