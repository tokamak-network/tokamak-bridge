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

import TITAN_CIRCLE from "@/assets/icons/network/circle/Titan_circle.svg";
import ETH_CIRCLE from "@/assets/icons/network/circle/Ethereum_circle.svg";
import Arrow from "@/assets/icons/arrow.svg";
import Image from "next/image";

import "@fontsource/poppins/400.css";
import { ActionMethod } from "@/types/bridgeSwap";

interface MethodItemProps {
  from?: string;
  to?: string;
  title: string;
  method: ActionMethod;
}

const ActionMethodItem = ({ from, to, title, method }: MethodItemProps) => {
  const [, setActionMethod] = useRecoilState(actionMethod);
  const [, setActionMethodStatus] =
    useRecoilState(actionMethodStatus);
  const theme = useTheme();
  
  const handleMethodItem = () => {
    setActionMethod(method);
    setActionMethodStatus(false);
  }

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
      onClick={handleMethodItem}
    >
      {from && to && (
        <Flex columnGap={"6px"} align={"center"} mb={"8px"}>
          <Image width={20} height={20} alt="from_network" src={from} />
          <Image width={16} alt="arrow" src={Arrow} />
          <Image width={20} height={20} alt="to_network" src={to} />
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

  return (
    <Modal isOpen={methodStatus} onClose={() => setActionMethodStatus(false)}>
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
          <ActionMethodItem
            from={ETH_CIRCLE}
            to={TITAN_CIRCLE}
            title="Deposit"
            method={ActionMethod.Deposit}
          />
          <ActionMethodItem
            from={TITAN_CIRCLE}
            to={ETH_CIRCLE}
            title="Withdraw"
            method={ActionMethod.Withdraw}
          />
        </Flex>

        <Text fontWeight={500} fontSize={16} mt={"20px"}>
          Swap
        </Text>

        <Flex columnGap={"8px"}>
          <ActionMethodItem
            from={ETH_CIRCLE}
            to={ETH_CIRCLE}
            title="Swap"
            method={ActionMethod.Swap_ETH}
          />
          <ActionMethodItem
            from={TITAN_CIRCLE}
            to={TITAN_CIRCLE}
            title="Swap"
            method={ActionMethod.Swap_Titan}

          />
          <ActionMethodItem
            title="Pool"
            method={ActionMethod.Pool}

          />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ActionOptionModal;
