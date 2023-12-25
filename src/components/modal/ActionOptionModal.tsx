import Image from "next/image";
import { useEffect, useCallback, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  Flex,
  useTheme,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { useAccount, useSwitchNetwork } from "wagmi";

import { actionMethodStatus } from "@/recoil/modal/atom";
import { networkStatus, welcomeMsgStatus } from "@/recoil/bridgeSwap/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useGetMode } from "@/hooks/mode/useGetMode";

import TITAN_CIRCLE from "@/assets/icons/network/circle/Titan_circle.svg";
import ETH_CIRCLE from "@/assets/icons/network/circle/Ethereum_circle.svg";
import Arrow from "@/assets/icons/arrow.svg";

import "@fontsource/poppins/300.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/400.css";

interface MethodItemProps {
  from?: Number;
  to?: Number;
  title: string;
  handleClose: () => void;
}

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

      if (selectedInNetwork.chainId !== connectedChainId) {
        return isConnected
          ? (await switchNetworkAsync?.(selectedInNetwork.chainId),
            setNetwork({
              inNetwork: selectedInNetwork,
              outNetwork: selectedOutNetwork,
            }),
            setActionMethodStatus(false))
          : setNetwork({
              inNetwork: selectedInNetwork,
              outNetwork: selectedOutNetwork,
            });
      } else if (selectedInNetwork.chainId === connectedChainId) {
        setNetwork({
          inNetwork: selectedInNetwork,
          outNetwork: selectedOutNetwork,
        });
      }
    } finally {
      if (title === "Pool") {
        router.push("pools");
      }
      handleClose();
      if (isError) {
        console.error(`Couldn't switch network`);
      }
    }
  };

  const fromIcon = useMemo(
    () => (from === 1 || from === 5 ? ETH_CIRCLE : TITAN_CIRCLE),
    [from]
  );

  const toIcon = useMemo(
    () => (to === 55004 || to === 5050 ? TITAN_CIRCLE : ETH_CIRCLE),
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
          {title !== "Pool" && <Image width={16} alt="arrow" src={Arrow} />}
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
  const [welcomeMsg, setWelcomeMsgStatus] = useRecoilState(welcomeMsgStatus);
  const { isConnected } = useAccount();
  const { switchNetworkAsync, isError } = useSwitchNetwork();
  const [, setNetwork] = useRecoilState(networkStatus);
  const { mode } = useGetMode();
  console.log(mode)

  const { mobileView } = useMediaView();

  const ethChainId = useMemo(
    () =>
      connectedNetwork.connectedChainId === 1 ||
      connectedNetwork.connectedChainId === 55004
        ? 1
        : 5,
    [connectedNetwork]
  );

  const titanChainId = useMemo(
    () =>
      connectedNetwork.connectedChainId === 1 ||
      connectedNetwork.connectedChainId === 55004
        ? 55004
        : 5050,
    [connectedNetwork]
  );
  const isWelcomeMsg = welcomeMsg && mobileView;

  const closeModal = useCallback(() => {
    setActionMethodStatus(false);
    setWelcomeMsgStatus(false);
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
      size={"xl"}
      isOpen={methodStatus && mobileView}
      onClose={() => closeModal()}
    >
      <ModalOverlay bg={isWelcomeMsg ? "#0F0F12" : "#0F0F12F0"} />
      <ModalContent
        bg={"#1F2128"}
        mt={"auto"}
        mb={0}
        p={"16px 12px"}
        roundedTop={"2xl"}
      >
        <Box pos={"relative"}>
          <Box w={"100%"} pos={"absolute"} top={"-45px"}>
            <Text textAlign={"center"} fontWeight={300} fontSize={14}>
              Please select a transaction
            </Text>
          </Box>

          {isWelcomeMsg && (
            <Box pos={"fixed"} w={"100%"} top={"100px"} left={0}>
              <Text
                fontWeight={300}
                fontSize={24}
                lineHeight={"36px"}
                textAlign={"center"}
              >
                Welcome to
              </Text>
              <Text
                fontWeight={700}
                fontSize={32}
                letterSpacing={"2px"}
                textAlign={"center"}
              >
                TOKAMAK BRIDGE
              </Text>
            </Box>
          )}

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
              title="Pool"
              handleClose={closeModal}
            />
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default ActionOptionModal;
