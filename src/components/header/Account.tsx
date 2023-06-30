import { Center, Text } from "@chakra-ui/layout";
import { Flex, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import WALLET_ICON from "assets/icons/wallet.svg";
import { useAccount, useConnect } from "wagmi";
import { trimAddress } from "@/utils/trim";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useTransaction } from "@/hooks/tx/useTx";

export default function Account() {
  const { isConnected, address } = useAccount();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const { pendingTransaction } = useTransaction();

  const buttonText = isConnected ? trimAddress({ address }) : "Connect Wallet";

  return (
    <Center
      className="header-right-common"
      w={isConnected ? "174px" : "220px"}
      h={"48px"}
      columnGap={"17px"}
      fontSize={18}
      /**
       * About connectors
       *
       * @param connectors is a list of connects supported on this app.
       * index 0 = metamask
       * index 1 = coinbase wallet
       * index 2 = wallet injected like wallet connet
       */
      onClick={() =>
        isConnected ? setIsOpen(!isOpen) : connetAndDisconntWallet()
      }
    >
      {pendingTransaction && pendingTransaction.length > 0 ? (
        <Flex columnGap={"8px"}>
          <Spinner color={"#007AFF"} />
          <Text fontSize={18} fontWeight={500}>
            {pendingTransaction.length} Pending
          </Text>
        </Flex>
      ) : (
        <>
          <Image src={WALLET_ICON} alt={""} />
          <Text fontWeight={'bold'}>{buttonText}</Text>
        </>
      )}
     
    </Center>
  );
}
