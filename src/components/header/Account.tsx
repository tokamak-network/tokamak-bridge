import { Center, Text } from "@chakra-ui/layout";
import { Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
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
import useMediaView from "@/hooks/mediaView/useMediaView";
import HISTORYICON from "assets/icons/header/history.svg";
import { useMemo } from "react";

export default function Account() {
  const { isConnected, address } = useAccount();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [, setIsOpen] = useRecoilState(accountDrawerStatus);
  // const { isPending } = useTransaction();
  const txPending = useRecoilValue(txPendingStatus);
  const { mobileView, pcView } = useMediaView();

  const buttonText = isConnected ? trimAddress({ address }) : mobileView ? "Connect" : "Connect Wallet";


  const ImageContainer = useMemo(() => {
    return (
      <>
        <Image src={WALLET_ICON} alt={""} />
        <Text>{buttonText}</Text>
      </>
    );
  }, [WALLET_ICON, buttonText]);

  return (
    <Center
      className="header-right-common"
      w={mobileView ? "106px" : isConnected ? "174px" : "220px"}
      h={{ base: "32px", md: "48px" }}
      bg={!isConnected ? "#007AFF" : ""}
      columnGap={{ base: "8px", lg: "17px" }}
      fontSize={18}
      fontWeight={500}
      _hover={{ bg: isConnected ? "#313442" : "" }}
      /**
       * About connectors
       *
       * @param connectors is a list of connects supported on this app.
       * index 0 = metamask
       * index 1 = coinbase wallet
       * index 2 = wallet injected like wallet connet
       */
      onClick={() =>
        isConnected ? setIsOpen((prev) => !prev) : connetAndDisconntWallet()
      }
    >
      {isConnected && txPending ? (
        <Flex columnGap={"8px"}>
          <Spinner color={"#007AFF"} />
          <Text fontSize={18} fontWeight={500}>
            {/* {pendingTransaction.length} */} Pending
          </Text>
        </Flex>
      ) : (
        <>
          {mobileView && isConnected ? (
            ""
          ) : (
            <Image src={WALLET_ICON} width={mobileView ? 16 : 24} alt={""} />
          )}
          <Text fontSize={{ base: 12, md: 18 }}>{buttonText}</Text>
          {isConnected && mobileView && <Image src={HISTORYICON} alt={""} />}
        </>
      )}
    </Center>
  );
}
