import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGetMode } from "@/hooks/mode/useGetMode";
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalContent,
  ModalOverlay,
  CloseButton,
} from "@chakra-ui/react";
import { TokenSymbol } from "../image/TokenSymbol";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { trimAmount } from "@/utils/trim";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import { confirmDepositStats } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";

import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import ARROW from "assets/icons/arrow.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";
import ETH from "assets/tokens/eth.svg";
import GasStation from "assets/icons/gasStation.svg";
import { isBiggerThanMinimumNum } from "@/utils/number/compareNumbers";
import commafy from "@/utils/trim/commafy";

const NewTokenContainer = () => {
  const { inToken } = useInOutTokens();

  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  return (
    <Box pos={"relative"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        p={"6px 12px"}
        border={"1px solid #313442"}
        bgColor={"#0F0F12"}
        rounded={"8px"}
      >
        <Flex columnGap={2} align={"center"}>
          <TokenSymbol
            tokenType={inToken?.tokenSymbol as string}
            w={24}
            h={24}
          />
          <Flex flexDir={"column"} justify={"space-between"}>
            <Text textColor={"#A0A3AD"} fontSize={12}>
              {inToken?.tokenSymbol}
            </Text>
            <Flex align={"center"}>
              <Text fontSize={16} fontWeight={600}>
                {trimAmount(inToken?.parsedAmount, 8)}
              </Text>
              <Text ml={"6px"} fontSize={12} fontWeight={400} color={"#A0A3AD"}>
                ${inTokenWithPrice || "0"}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify={"space-between"} align={"center"} columnGap={"6px"}>
          <Image alt="eth" src={Ethereum} width={24} height={24} />
          <Image alt="eth" src={ARROW} width={16} height={16} />
          <Image alt="eth" src={Titan} width={24} height={24} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default function ConfirmDeposit() {
  const { mode } = useGetMode();
  const { onClick } = useCallBridgeSwapAction();
  const isWithdrawConfirmed = useRecoilValue(confirmWithdrawStatus);
  const { mobileView } = useMediaView();
  const [withdrawStatus, setDepositStatus] =
    useRecoilState(confirmDepositStats);
  const { totalGasCost, gasCostUS } = useGasFee();

  return (
    <Modal
      isOpen={withdrawStatus.isOpen}
      onClose={() => setDepositStatus({ isOpen: false })}
      size={"xl"}
      isCentered
    >
      <ModalOverlay opacity={0.1} />
      <ModalContent
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        mb={{ base: 0, lg: "auto" }}
      >
        <Flex
          w={{ base: "full", lg: "404px" }}
          p={{ base: "16px 12px", lg: "20px" }}
          bgColor={"#1f2128"}
          borderRadius={{ base: "16px 16px 0px 0px", lg: "16px" }}
          flexDir={"column"}
          flexDirection={"column"}
          rowGap={"16px"}
        >
          <Flex justifyContent={"space-between"} pos={"relative"}>
            <Text fontSize={{ base: 16, lg: 20 }} fontWeight={500}>
              Confirm {mode}
            </Text>
            {!mobileView && (
              <Box pos={"absolute"} right={0} top={"-6px"}>
                <CloseButton
                  onClick={() => {
                    setDepositStatus({ isOpen: false });
                  }}
                />
              </Box>
            )}
          </Flex>
          {/* <TokenContainer /> */}
          <NewTokenContainer />
          {/* <Box pl={"7px"}>
            <TransactionDetail isOnConfirm={true} isMobile />
          </Box> */}

          <Flex
            pos={"relative"}
            flexDir={"column"}
            rounded={"16px"}
            p={5}
            bgColor={"#15161D"}
            justify={"space-between"}
            align={"center"}
            rowGap={"32px"}
          >
            <Flex w={"full"} justify={"space-between"}>
              <Flex align={"center"} columnGap={3}>
                <Box w={"9px"} h={"9px"} rounded={"full"} bgColor={"#007AFF"} />
                <Text fontWeight={500} fontSize={15}>
                  Initiate
                </Text>
              </Flex>

              <Flex align={"center"} columnGap={2}>
                <Flex columnGap={1} align={"center"}>
                  <Image
                    alt="gas station"
                    src={GasStation}
                    width={14}
                    height={14}
                  />
                  <Text fontSize={13}>
                    ~
                    {`${
                      isBiggerThanMinimumNum(Number(totalGasCost))
                        ? commafy(totalGasCost, 4)
                        : "< 0.0001"
                    } ETH`}{" "}
                  </Text>
                </Flex>

                <Text fontSize={13} color={"#A0A3AD"}>
                  ${gasCostUS}
                </Text>
              </Flex>
            </Flex>

            <Box
              pos={"absolute"}
              top={"36px"}
              left={"24px"}
              height={"44px"}
              w={"1px"}
              bgColor={"#313442"}
            />

            <Flex w={"full"} justify={"space-between"}>
              <Flex align={"center"} columnGap={3}>
                <Box w={"9px"} h={"9px"} rounded={"full"} bgColor={"#A0A3AD"} />
                <Text fontWeight={500} fontSize={15}>
                  Wait for L2
                </Text>
              </Flex>

              <Flex align={"center"} columnGap={2}>
                <Text fontSize={13} color={"#A0A3AD"}>
                  ~1 min
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Button
            w={"100%"}
            h={"48px"}
            fontSize={16}
            fontWeight={600}
            _active={{}}
            _hover={{}}
            bgColor={"#007AFF"}
            color={"#fff"}
            onClick={onClick}
            isDisabled={mode === "Withdraw" ? !isWithdrawConfirmed : false}
            _disabled={{
              color: "#8E8E92",
              bgColor: "#17181D",
            }}
          >
            Confirm {mode}
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
