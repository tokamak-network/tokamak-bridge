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

  console.log(connectors);
  console.log(connector);

  return (
    <Center
      className="header-right-common"
      w={isConnected ? "174px" : "220px"}
      h={"48px"}
      columnGap={"17px"}
      fontSize={18}
      onClick={() =>
        isConnected ? disconnect() : connect({ connector: connectors[0] })
      }
    >
      <Image src={WALLET_ICON} alt={""} />
      <Text>{buttonText}</Text>
    </Center>
  );
}
