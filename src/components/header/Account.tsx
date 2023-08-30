import { Center, Text } from "@chakra-ui/layout";
import { Flex, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import WALLET_ICON from "assets/icons/wallet.svg";
import { useAccount, useConnect } from "wagmi";
import { trimAddress } from "@/utils/trim";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTransaction, useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { txPendingStatus } from "@/recoil/global/transaction";

export default function Account() {
  const { isConnected, address } = useAccount();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [, setIsOpen] = useRecoilState(accountDrawerStatus);
  // const { isPending } = useTransaction();
  const txPending = useRecoilValue(txPendingStatus);

  const buttonText = isConnected ? trimAddress({ address }) : "Connect Wallet";

  return (
    <Center
      className="header-right-common"
      w={isConnected ? "174px" : "220px"}
      h={"48px"}
      columnGap={"17px"}
      fontSize={18}
      fontWeight={500}
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
      {txPending ? (
        <Flex columnGap={"8px"}>
          <Spinner color={"#007AFF"} />
          <Text fontSize={18} fontWeight={500}>
            {/* {pendingTransaction.length} */}1 Pending
          </Text>
        </Flex>
      ) : (
        <>
          <Image src={WALLET_ICON} alt={""} />
          <Text>{buttonText}</Text>
        </>
      )}
    </Center>
  );
}
