import { useCallback, useMemo } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import {
  actionMode,
  inTokenSelector,
  networkStatus,
  outTokenSelector,
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
  const { inTokenHasAmount } = useRecoilValue(inTokenSelector);
  const { outTokenHasAmount } = useRecoilValue(outTokenSelector);

  const { write: _depositETH } = useCallDeposit("depositETH");
  const {
    data,
    isLoading,
    isSuccess,
    write: _depositERC20,
  } = useCallDeposit("depositERC20");
  const { write: _withdraw } = useCallWithdraw("withdraw");

  const isDisabled = useMemo(() => {
    if ((mode === "Deposit" || mode === "Withdraw") && inTokenHasAmount) {
      return false;
    }
    if (mode === "Swap" && inTokenHasAmount && outTokenHasAmount) {
      return false;
    }
    return true;
  }, [mode, inTokenInfo, outTokenInfo]);

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

      switch (mode) {
        case "Deposit":
          const supportedOutToken = supportedTokens.filter(
            (token) => token.address === inTokenInfo.address
          )[0];
          const outTokenAddress =
            supportedOutToken.address[outNetwork.chainName];

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
          return _withdraw({
            args: [
              inTokenInfo.address[inNetwork.chainName],
              parsedAmount,
              200000000,
              "0x",
            ],
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
      bgColor={isDisabled ? "#17181D" : "#007AFF"}
      _active={{}}
      _hover={{}}
      color={isDisabled ? "#8E8E92" : "#fff"}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {!isConnected && "Connect Wallet"}
      {isConnected && mode === null ? "Select Network" : mode}
    </Button>
  );
}
