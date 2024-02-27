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
  Link,
} from "@chakra-ui/react";
import { TokenSymbol } from "../image/TokenSymbol";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { trimAmount } from "@/utils/trim";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { confirmDepositStats, confirmDepositData } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import { isBiggerThanMinimumNum } from "@/utils/number/compareNumbers";
import commafy from "@/utils/trim/commafy";
import { useToken } from "wagmi";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import { Hash } from "viem";
import { supportedTokens } from "@/types/token/supportedToken";

import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import ARROW from "assets/icons/arrow.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";
import ETH from "assets/tokens/eth.svg";
import GasStation from "assets/icons/gasStation.svg";
import GuideLink from "assets/icons/link2.svg";
import useConnectedNetwork from "@/hooks/network";

const NewTokenContainer = ({ tx, token }: any) => {
  const { inToken } = useInOutTokens();
  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: tx ? (token?.name as string) : (inToken?.tokenName as string),
    amount: Number(
      tx ? tx._amount : inToken?.parsedAmount?.replaceAll(",", "")
    ),
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
            tokenType={
              tx ? (token?.symbol as string) : (inToken?.tokenSymbol as string)
            }
            w={24}
            h={24}
          />
          <Flex flexDir={"column"} justify={"space-between"}>
            <Text textColor={"#A0A3AD"} fontSize={12}>
              {tx ? token?.symbol : inToken?.tokenSymbol}
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
  const { mobileView } = useMediaView();
  const [depositStatus, setDepositStatus] = useRecoilState(confirmDepositStats);
  const [depositData, setDepositData] = useRecoilState(confirmDepositData);
  const { totalGasCost, gasCostUS } = useGasFee();
  const providers = useGetTxLayers();
  const { inToken } = useInOutTokens();
  const tx = depositData.modalData;

  const { layer } = useConnectedNetwork();
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const ethToken = {
    decimals: supportedTokens[0].decimals,
    symbol: supportedTokens[0].tokenSymbol,
    name: supportedTokens[0].tokenName,
  };

  const { data } = useToken({
    address: layer === "L1" ? (tx?._l1Token as Hash) : (tx?._l2Token as Hash),
    enabled: tx?._l1Token === zeroAddress ? false : true,
  });
  const token =
    layer === "L1" && tx?._l1Token === zeroAddress ? ethToken : data;

  return (
    <Modal
      isOpen={depositStatus.isOpen}
      onClose={() => {
        setDepositStatus({ isOpen: false });
        setDepositData({ modalData: null });
      }}
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
          <NewTokenContainer tx={tx} token={token} />
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
                <Box
                  w={"9px"}
                  h={"9px"}
                  rounded={"full"}
                  bgColor={tx?.l1txHash ? "#03D187" : "#007AFF"}
                />
                <Text fontWeight={500} fontSize={15}>
                  Initiate
                </Text>
              </Flex>

              {!tx ? (
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
              ) : (
                <Link
                  target={"_blank"}
                  href={`${providers.l1BlockExplorer}/tx/${tx.l1txHash}`}
                  _hover={{}}
                  >
                  <Flex columnGap={1} align={"center"}>
                    <Text fontSize={12} color={"#A0A3AD"}>
                      Transaction
                    </Text>
                    <Image alt="link" src={GuideLink} width={14} height={14} />
                  </Flex>
                </Link>
              )}
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
                <Box
                  w={"9px"}
                  h={"9px"}
                  rounded={"full"}
                  bgColor={tx?.l2txHash ? "#03D187" : "#A0A3AD"}
                />
                <Text fontWeight={500} fontSize={15}>
                  Wait for L2
                </Text>
              </Flex>

              <Flex align={"center"} columnGap={2}>
                {!tx ? (
                  <Text fontSize={13} color={"#A0A3AD"}>
                    ~1 min
                  </Text>
                ) : tx.l1txHash && !tx.l2txHash ? (
                  <></>
                ) : tx.l1txHash && tx.l2txHash ? (
                  <Link
                    target={"_blank"}
                    href={`${providers.l2BlockExplorer}/tx/${tx.l2txHash}`}
                    _hover={{}}
                  >
                    <Flex columnGap={1} align={"center"}>
                      <Text fontSize={12} color={"#A0A3AD"}>
                        Transaction
                      </Text>
                      <Image
                        alt="link"
                        src={GuideLink}
                        width={14}
                        height={14}
                      />
                    </Flex>
                  </Link>
                ) : (
                  ""
                )}
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
            // isDisabled={mode === "Withdraw" ? !isWithdrawConfirmed : false}
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
