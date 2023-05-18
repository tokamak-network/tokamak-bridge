import useConnectWallet from "@/hooks/account/useConnectWallet";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Button } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useAccount } from "wagmi";

export default function ActionButton() {
  const { isConnected } = useAccount();
  const { connetAndDisconntWallet } = useConnectWallet();
  const mode = useRecoilValue(actionMode);

  return (
    <Button
      w={"100%"}
      h={"48px"}
      fontSize={16}
      fontWeight={600}
      bgColor={"#17181D"}
      _active={{}}
      _hover={{}}
      color={"#8E8E92"}
      onClick={() => connetAndDisconntWallet()}
    >
      {!isConnected && "Connect Wallet"}
      {isConnected && mode !== null && mode}
    </Button>
  );
}
