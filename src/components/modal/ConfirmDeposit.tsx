import Image from "next/image";
import TransactionDetail from "@/app/BridgeSwap/TransactionDetail";
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
import { useSwapTokens } from "@/hooks/swap/useSwapTokens";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { trimAmount } from "@/utils/trim";
import useConfirm from "@/hooks/modal/useConfirmModal";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { useRecoilState, useRecoilValue } from "recoil";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";

import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import ArrowDown from "assets/icons/arrow_down.svg";
import ARROW from "assets/icons/arrow.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";
import ETH from "assets/tokens/eth.svg";
import { confirmDepositStats, confirmWithdrawStats } from "@/recoil/modal/atom";

const NewTokenContainer = () => {
  const { inToken, outToken } = useInOutTokens();
  const { amountOut } = useSwapTokens();

  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  const { tokenPriceWithAmount: outTokenWithPrice } = useGetMarketPrice({
    tokenName: outToken?.tokenName as string,
    amount: Number(amountOut),
  });

  return (
    <Box pos={"relative"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        p={"6px 12px"}
        border={"1px solid #313442"}
        borderBottom={"none"}
        bgColor={"#0F0F12"}
        rounded={"8px 8px 0px 0px"}
      >
        <Flex columnGap={2} align={"center"}>
          <Image alt="eth" src={ETH} width={24} height={24} />
          <Flex flexDir={"column"} justify={"space-between"}>
            <Text textColor={"#A0A3AD"} fontSize={12}>
              ETH
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
          <Image alt="eth" src={ARROW} width={24} height={24} />
          <Image alt="eth" src={Titan} width={24} height={24} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default function ConfirmDeposit() {
  const { mode } = useGetMode();
  const { isOpen, onCloseConfirmModal } = useConfirm();
  const { onClick } = useCallBridgeSwapAction();
  const isWithdrawConfirmed = useRecoilValue(confirmWithdrawStatus);
  const { mobileView } = useMediaView();
  const [withdrawStatus, setDepositStatus] =
    useRecoilState(confirmDepositStats);

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
