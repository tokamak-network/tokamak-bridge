import { Center, Text } from "@chakra-ui/layout";
import { Flex, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { useAccount } from "wagmi";

import useConnectWallet from "@/hooks/account/useConnectWallet";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { txPendingStatus } from "@/recoil/global/transaction";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { trimAddress } from "@/utils/trim";

import HISTORYICON from "assets/icons/header/history.svg";
import WALLET_ICON from "assets/icons/wallet.svg";

export default function Account() {
  const { isConnected, address } = useAccount();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [, setIsOpen] = useRecoilState(accountDrawerStatus);
  const txPending = useRecoilValue(txPendingStatus);
  const { mobileView } = useMediaView();

  const buttonText = isConnected ? trimAddress({ address }) : mobileView ? "Connect" : "Connect Wallet";

  return (
    <Center
      className="header-right-common"
      w={mobileView ? "106px" : isConnected ? "174px" : "220px"}
      h={{ base: "32px", lg: "48px" }}
      bg={!isConnected ? "#007AFF" : ""}
      columnGap={{ base: "8px", lg: "17px" }}
      fontSize={18}
      fontWeight={500}
      _hover={{ bg: isConnected && !mobileView ? "#313442" : "" }}
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
          <Spinner size={{base: "sm", lg:"md"}} color={"#007AFF"} />
          <Text fontSize={{ base: 12, lg: 18 }} fontWeight={500}>
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
          <Text fontSize={{ base: 12, lg: 18 }}>{buttonText}</Text>
          {isConnected && mobileView && <Image src={HISTORYICON} alt={""} />}
        </>
      )}
    </Center>
  );
}
