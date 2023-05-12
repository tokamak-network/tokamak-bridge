import { Center, Text } from "@chakra-ui/layout";
import Image from "next/image";
import WALLET_ICON from "assets/icons/wallet.svg";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { trimAddress } from "@/utils/trim";
import { useMemo } from "react";

export default function Account() {
  const { connector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

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
        isConnected ? disconnect() : connect({ connector: connectors[0] })
      }
    >
      <Image src={WALLET_ICON} alt={""} />
      <Text>{buttonText}</Text>
    </Center>
  );
}
