import { useCallback, useEffect } from "react";
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
import { useAccount, usePublicClient } from "wagmi";
import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import useCallDeposit from "@/hooks/bridge/actions/useCallDeposit";
import useCallWithdraw from "@/hooks/bridge/actions/useCallWithdraw";
import { supportedTokens } from "@/types/token/supportedToken";
import { predeploys } from "@eth-optimism/contracts";

import { ethers } from "ethers";
import { useTotalGas } from "@/hooks/contracts/useL2Provider";

export default function ActionButton() {
  const { isConnected, status } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const { mode, isReady } = useRecoilValue(actionMode);
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);
  const network = useRecoilValue(networkStatus);

  const { write: _depositETH } = useCallDeposit("depositETH");
  const { write: _depositERC20, contract } = useCallDeposit("depositERC20");
  const { write: _withdraw, contract: _withdraw_contract } =
    useCallWithdraw("withdraw");

  const isDisabled = !isReady;

  const onClick = useCallback(async () => {
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
          // const result = await _withdraw_contract.estimateGas.withdraw(
          //   inTokenInfo.address[inNetwork.chainName],
          //   parsedAmount,
          //   200000000,
          //   "0x"
          // );
          // console.log(result);

          if (isETH) {
            return _withdraw({
              args: [predeploys.OVM_ETH, parsedAmount, 1_300_000, "0x"],
            });
          }

          return _withdraw({
            args: [
              inTokenInfo.address[inNetwork.chainName],
              parsedAmount,
              0,
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
      _active={{}}
      _hover={{}}
      _disabled={{}}
      bgColor={isDisabled ? "#17181D" : "#007AFF"}
      color={isDisabled ? "#8E8E92" : "#fff"}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {!isConnected && "Connect Wallet"}
      {isConnected && mode === null ? "Select Network" : mode}
    </Button>
  );
}
