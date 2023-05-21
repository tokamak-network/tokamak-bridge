import { useCallback } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import {
  actionMode,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useAccount, useContractWrite } from "wagmi";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useCallBridge from "@/hooks/bridge/useCallBridge";

export default function ActionButton() {
  const { isConnected, status } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const mode = useRecoilValue(actionMode);
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);

  const L1config = {
    address: "0x7377F3D0F64d7a54Cf367193eb74a052ff8578FD",
    abi: L1BridgeAbi,
  };

  const functionName = "depositETH";

  const {
    data: _depositETH_data,
    isLoading: _depositETH_isLoading,
    isSuccess: _depositETH_isSuccess,
    write: _depositETH,
  } = useCallBridge({
    functionName: "depositETH",
  });
  const { data, isLoading, isSuccess, write } = useCallBridge({
    functionName: "depositERC20",
  });

  const onClick = useCallback(() => {
    if (!isConnected) {
      return connectToWallet();
    }
    const isETH = inTokenInfo?.isNativeCurrency?.includes(
      SupportedChainId.MAINNET || SupportedChainId.GOERLI
    );
    switch (mode) {
      case "Deposit":
        if (isETH) {
          console.log("go?");
          return _depositETH({
            args: [
              1_300_000,
              "0x",
              {
                value: "100000000000000000",
                gasLimit: 330_000,
              },
            ],
          });
        }
        return write({
          args: [
            "0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00",
            "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
            "100000000",
            1_300_000,
            "0x",
          ],
        });
      case "Withdraw":
        return;
      case "Swap":
        return;
      default:
        return console.error("action mode is not founded");
    }
  }, [isConnected, connectToWallet, mode]);

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
      onClick={onClick}
    >
      {!isConnected && "Connect Wallet"}
      {isConnected && mode === null ? "Select Network" : mode}
    </Button>
  );
}
