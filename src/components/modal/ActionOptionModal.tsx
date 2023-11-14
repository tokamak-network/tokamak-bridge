import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  Flex,
  useTheme,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import { actionMethod } from "@/recoil/bridgeSwap/atom";
import { actionMethodStatus } from "@/recoil/modal/atom";
import { networkStatus } from "@/recoil/bridgeSwap/atom";

import TITAN_CIRCLE from "@/assets/icons/network/circle/Titan_circle.svg";
import ETH_CIRCLE from "@/assets/icons/network/circle/Ethereum_circle.svg";
import Arrow from "@/assets/icons/arrow.svg";
import Image from "next/image";

import "@fontsource/poppins/400.css";
import { ActionMethod } from "@/types/bridgeSwap";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useConnectedNetwork from "@/hooks/network";
import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { switchNetwork } from "wagmi/dist/actions";
import { useAccount, useSwitchNetwork } from "wagmi";

interface MethodItemProps {
  from?: Number;
  to?: Number;
  title: string;
}

const ActionMethodItem = ({ from, to, title }: MethodItemProps) => {
  const [network, setNetwork] = useRecoilState(networkStatus);
  const [, setActionMethod] = useRecoilState(actionMethod);
  const [, setActionMethodStatus] = useRecoilState(actionMethodStatus);
  const { connectedChainId, isConnectedToMainNetwork } = useConnectedNetwork();
  const { switchNetworkAsync, isError, switchNetwork } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const [outTokenSelected, setOutTokenSelected] =
    useState<SupportedChainProperties>();
  const theme = useTheme();

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

      setOutTokenSelected(selectedOutNetwork);

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
      setActionMethodStatus(false);
      if (isError) {
        console.error(`Couldn't switch network`);
      }
    }
  };

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
          <Image
            width={20}
            height={20}
            alt="from_network"
            src={from === 1 ? ETH_CIRCLE : TITAN_CIRCLE}
          />
          <Image width={16} alt="arrow" src={Arrow} />
          <Image
            width={20}
            height={20}
            alt="to_network"
            src={to === 1 ? ETH_CIRCLE : TITAN_CIRCLE}
          />
        </Flex>
      )}
      <Text fontFamily={theme.fonts.body} fontSize={16} fontWeight={400}>
        {title}
      </Text>
    </Flex>
  );
};

const ActionOptionModal = () => {
  const [, setActionMethod] = useRecoilState(actionMethod);
  const [methodStatus, setActionMethodStatus] =
    useRecoilState(actionMethodStatus);

  const { mobileView } = useMediaView();

  return (
    <Modal
      size={"xl"}
      isOpen={methodStatus && mobileView}
      onClose={() => setActionMethodStatus(false)}
    >
      <ModalOverlay opacity={0.1} />
      <ModalContent
        bg={"#1F2128"}
        mt={"auto"}
        mb={0}
        p={"16px 12px"}
        roundedTop={"2xl"}
      >
        <Text fontWeight={500} fontSize={16}>
          Bridge
        </Text>

        <Flex columnGap={"8px"}>
          <ActionMethodItem from={1} to={55004} title="Deposit" />
          <ActionMethodItem from={55004} to={1} title="Withdraw" />
        </Flex>

        <Text fontWeight={500} fontSize={16} mt={"20px"}>
          Swap
        </Text>

        <Flex columnGap={"8px"}>
          <ActionMethodItem from={1} to={1} title="Swap" />
          <ActionMethodItem from={55004} to={55004} title="Swap" />
          <ActionMethodItem title="Pool" />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ActionOptionModal;
function setNetwork(arg0: any) {
  throw new Error("Function not implemented.");
}
