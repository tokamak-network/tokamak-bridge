import Image from "next/image";
import { useEffect, useCallback, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  Flex,
  useTheme,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { useAccount, useSwitchNetwork } from "wagmi";

import { actionMethodStatus } from "@/recoil/modal/atom";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useGetMode } from "@/hooks/mode/useGetMode";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import dayjs from "dayjs";

import TITAN_CIRCLE from "@/assets/icons/network/circle/Titan_circle.svg";
import ETH_CIRCLE from "@/assets/icons/network/circle/Ethereum_circle.svg";
import Arrow from "@/assets/icons/arrow.svg";

import "@fontsource/poppins/300.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/400.css";

import useMobileChainIds from "@/hooks/mobile/useMobileChainIds";

interface MethodItemProps {
  from?: Number;
  to?: Number;
  title: string;
  handleClose: () => void;
}

const Footer = () => {
  return (
    <Flex
      bottom={0}
      w={"full"}
      h={"15px"}
      mt={"20px"}
      mb={"16px"}
      justify={"center"}
      alignItems={"center"}
      // To be removed after ad ends. @Robert
    >
      <Text fontSize={10} color={"#A0A3AD"}>
        Copyright © {dayjs().year()}{" "}
        <span style={{ color: "#007AFF" }}>Tokamak Network</span> All Rights
        Reserved.
      </Text>
    </Flex>
  );
};

const ActionMethodItem = ({
  from,
  to,
  title,
  handleClose,
}: MethodItemProps) => {
  const [, setNetwork] = useRecoilState(networkStatus);
  const [, setActionMethodStatus] = useRecoilState(actionMethodStatus);
  const { connectedChainId } = useConnectedNetwork();
  const { switchNetworkAsync, isError } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const theme = useTheme();
  const router = useRouter();

  const handleMethodItem = async () => {
    try {
      const value: SupportedChainProperties["chainId"] = Number(from);
      const outValue: SupportedChainProperties["chainId"] = Number(to);

      const selectedInNetwork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === value;
      })[0];

      const selectedOutNetwork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === outValue;
      })[0];

      if (
        selectedInNetwork.chainId !== connectedChainId &&
        !(title === "Pools")
      ) {
        return isConnected
          ? (await switchNetworkAsync?.(selectedInNetwork.chainId),
            setNetwork({
              inNetwork: selectedInNetwork,
              outNetwork: selectedOutNetwork,
            }),
            handleClose())
          : (setNetwork({
              inNetwork: selectedInNetwork,
              outNetwork: selectedOutNetwork,
            }),
            handleClose());
      } else if (
        selectedInNetwork.chainId === connectedChainId &&
        !(title === "Liquidity")
      ) {
        return (
          setNetwork({
            inNetwork: selectedInNetwork,
            outNetwork: selectedOutNetwork,
          }),
          handleClose()
        );
      }
    } finally {
      if (title === "Liquidity") {
        router.push("pools");
      }
      if (isError) {
        console.error(`Couldn't switch network`);
      }
    }
  };

  const fromIcon = useMemo(
    () => (from === 1 || from === 11155111 ? ETH_CIRCLE : TITAN_CIRCLE),
    [from]
  );

  const toIcon = useMemo(
    () => (to === 55004 || to === 55007 ? TITAN_CIRCLE : ETH_CIRCLE),
    [to]
  );

  return (
    <Flex
      flexDir={"column"}
      justify={"center"}
      align={"center"}
      w={"full"}
      rounded={"8px"}
      border={"1px solid #313442"}
      mt={"12px"}
      h={"96px"}
      _hover={{ borderColor: "#007AFF" }}
      cursor={"pointer"}
      onClick={handleMethodItem}
    >
      {from && to && (
        <Flex columnGap={"6px"} align={"center"} mb={"8px"}>
          <Image width={20} height={20} alt="from_network" src={fromIcon} />
          {title !== "Pools" && <Image width={16} alt="arrow" src={Arrow} />}
          <Image width={20} height={20} alt="to_network" src={toIcon} />
        </Flex>
      )}
      <Text fontFamily={theme.fonts.body} fontSize={16} fontWeight={400}>
        {title}
      </Text>
    </Flex>
  );
};

const ActionOptionModal = () => {
  const [methodStatus, setActionMethodStatus] =
    useRecoilState(actionMethodStatus);
  const connectedNetwork = useConnectedNetwork();
  const { isConnected } = useAccount();
  const { switchNetworkAsync, isError } = useSwitchNetwork();
  const [, setNetwork] = useRecoilState(networkStatus);
  const { mode } = useGetMode();
  const { mobileView } = useMediaView();
  const [, setSelectedInToken] = useRecoilState(selectedInTokenStatus);
  const [, setSelectedOutToken] = useRecoilState(selectedOutTokenStatus);

  ////////////////////////
  const { ethChainId, titanChainId } = useMobileChainIds(connectedNetwork);
  /////////////////////////

  const closeModal = useCallback(() => {
    setActionMethodStatus(false);
    setSelectedInToken(null);
    setSelectedOutToken(null);
  }, []);

  // useEffect(() => {
  //   console.log(mode)
  //   const handleDefaultMode = async () => {
  //     try {
  //       const value: SupportedChainProperties["chainId"] = Number(1);
  //       const outValue: SupportedChainProperties["chainId"] = Number(1);
  //       const selectedInNetwork = supportedChain.filter((supportedChain) => {
  //         return supportedChain.chainId === value;
  //       })[0];

  //       const selectedOutNetwork = supportedChain.filter((supportedChain) => {
  //         return supportedChain.chainId === outValue;
  //       })[0];

  //       if (selectedInNetwork.chainId !== connectedNetwork.connectedChainId) {
  //         return isConnected
  //           ? (await switchNetworkAsync?.(selectedInNetwork.chainId),
  //             setNetwork({
  //               inNetwork: selectedInNetwork,
  //               outNetwork: selectedOutNetwork,
  //             }),
  //             setActionMethodStatus(false))
  //           : setNetwork({
  //               inNetwork: selectedInNetwork,
  //               outNetwork: selectedOutNetwork,
  //             });
  //       } else if (selectedInNetwork.chainId === connectedNetwork.connectedChainId) {
  //         setNetwork({
  //           inNetwork: selectedInNetwork,
  //           outNetwork: selectedOutNetwork,
  //         });
  //       }
  //     } finally {
  //       if (isError) {
  //         console.error(`Couldn't switch network`);
  //       }
  //     }
  //   }
  //   if (mode === null) {
  //     handleDefaultMode();
  //   }
  // }, [])

  return (
    <Modal
      isOpen={methodStatus && mobileView && !(mode == "Pool")}
      onClose={() => closeModal()}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg={"#0F0F12"} />
      <ModalContent
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        h="calc(100vh - 64px)"
        bg={"transparent"}
        mb={0}
      >
        <Box />
        <Flex
          flexDir={"column"}
          bg={"#0F0F12"}
          textAlign={"center"}
          my={"20px"}
        >
          <Flex flexDir={"column"} textAlign={"center"} my={"20px"}>
            <Text fontWeight={300} fontSize={30} lineHeight={"36px"}>
              Welcome to
            </Text>
            <Text fontWeight={700} fontSize={34} letterSpacing={"2px"}>
              TOKAMAK BRIDGE
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          bg={"#1F2128"}
          px={4}
          pt={2}
          pb={4}
          roundedTop={"2xl"}
        >
          <Text fontWeight={500} fontSize={16}>
            Bridge
          </Text>
          <Flex columnGap={"8px"}>
            <ActionMethodItem
              from={ethChainId}
              to={titanChainId}
              title="Deposit"
              handleClose={closeModal}
            />
            <ActionMethodItem
              from={titanChainId}
              to={ethChainId}
              title="Withdraw"
              handleClose={closeModal}
            />
          </Flex>

          <Text fontWeight={500} fontSize={16} mt={"20px"}>
            Swap
          </Text>

          <Flex columnGap={"8px"}>
            <ActionMethodItem
              from={ethChainId}
              to={ethChainId}
              title="Swap"
              handleClose={closeModal}
            />
            <ActionMethodItem
              from={titanChainId}
              to={titanChainId}
              title="Swap"
              handleClose={closeModal}
            />
            <ActionMethodItem
              from={ethChainId}
              to={titanChainId}
              title="Liquidity"
              handleClose={closeModal}
            />
          </Flex>
          <Footer />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ActionOptionModal;
