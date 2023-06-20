import { Center, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import Image from "next/image";
import WALLET_ICON from "assets/icons/wallet.svg";
import { useAccount, useConnect } from "wagmi";
import { trimAddress } from "@/utils/trim";
import { useMemo } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import useGetTransaction from "@/hooks/user/useGetTransaction";

export default function Account() {
  const { isConnected, address } = useAccount();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const buttonText = isConnected ? trimAddress({ address }) : "Connect Wallet";
  const { isLoading } = useGetTransaction();
  
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
        isConnected ? setIsOpen(true) : connetAndDisconntWallet()
      }
    >

    
      {isLoading ? (
        <>
          <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
          <Text>Pending</Text>
        </>
      ) : (
        <>
          <Image src={WALLET_ICON} alt={""} />
          <Text>{buttonText}</Text>
        </>
      )}
    </Center>
  );
}
