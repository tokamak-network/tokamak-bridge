import { useCallback } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import {
  actionMode,
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useAccount } from "wagmi";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import useCallDeposit from "@/hooks/bridge/actions/useCallDeposit";
import useCallWithdraw from "@/hooks/bridge/actions/useCallWithdraw";
import { supportedTokens } from "@/types/token/supportedToken";
import { ethers } from "ethers";

export default function ActionButton() {
  const { isConnected, status } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const mode = useRecoilValue(actionMode);
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);
  const network = useRecoilValue(networkStatus);

  const { write: _depositETH } = useCallDeposit("depositETH");
  const {
    data,
    isLoading,
    isSuccess,
    write: _depositERC20,
  } = useCallDeposit("depositERC20");
  const { write: _withdraw } = useCallWithdraw("withdraw");

  const onClick = useCallback(() => {
    if (!isConnected) {
      return connectToWallet();
    }
    if (
      inTokenInfo &&
      inTokenInfo.amountBN &&
      network?.inNetwork &&
      network?.outNetwork
    ) {
      const isETH = inTokenInfo.isNativeCurrency?.includes(
        SupportedChainId.MAINNET || SupportedChainId.GOERLI
      );

      const parsedAmount = inTokenInfo.amountBN;
      const { inNetwork, outNetwork } = network;

      console.log(inTokenInfo);

      switch (mode) {
        case "Deposit":
          const supportedOutToken = supportedTokens.filter(
            (token) => token.address === inTokenInfo.address
          )[0];
          const outTokenAddress =
            supportedOutToken.address[outNetwork.chainName];

          console.log(
            inTokenInfo.address[inNetwork.chainName],
            outTokenAddress,
            parsedAmount,
            1_300_000,
            "0x"
          );

          if (isETH) {
            return _depositETH({
              args: [1_300_000, "0x"],
              //need to put gasAmount with gasOrcale later
              value: parsedAmount as bigint,
            });
          }
          return _depositERC20({
            args: [
              inTokenInfo.address[inNetwork.chainName],
              outTokenAddress,
              parsedAmount,
              1_300_000,
              "0x",
            ],
          });
        case "Withdraw":
          if (isETH) {
            return _withdraw({ args: [] });
          }
          console.log([inTokenInfo.address, parsedAmount, 2000000, "0x"]);
          return _withdraw({
            args: [inTokenInfo.address, parsedAmount, 2000000, "0x"],
          });
        case "Swap":
          return;
        default:
          return console.error("action mode is not founded");
      }
    }
  }, [isConnected, connectToWallet, mode, inTokenInfo]);

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
