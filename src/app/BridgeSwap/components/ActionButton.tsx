import { useCallback, useEffect, useMemo, useState } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import {
  actionMode,
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useAccount, usePublicClient } from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useCallDeposit from "@/hooks/bridge/actions/useCallDeposit";
import useCallWithdraw from "@/hooks/bridge/actions/useCallWithdraw";
import { supportedTokens } from "@/types/token/supportedToken";
import { predeploys } from "@eth-optimism/contracts";

import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { useApprove } from "@/hooks/token/useApproval";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useConfirmModal from "@/hooks/modal/useConfirmModal";
import useWrap from "@/hooks/swap/useTonWrap";

export default function ActionButton() {
  const { isConnected, status, address } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const { mode, isReady } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();
  const { isLoading } = useGetTransaction();
  const { isNotSupportForSwap } = useBridgeSupport();

  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);
  const network = useRecoilValue(networkStatus);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { write: _depositETH } = useCallDeposit("depositETH");
  const { write: _depositERC20, contract } = useCallDeposit("depositERC20");
  const { write: _withdraw, contract: _withdraw_contract } =
    useCallWithdraw("withdraw");

  const { callTokenSwap } = useAmountOut();
  const { wrapTON, unwrapWTON } = useWrap();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const disabled =
        !isReady || isApproved === false || isLoading || isNotSupportForSwap;
      setIsDisabled(disabled);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [!isReady || isApproved === false || isLoading || isNotSupportForSwap]);

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
              args: [200000, "0x"],
              //need to put gasAmount with gasOrcale later
              value: parsedAmount as bigint,
            });
          }

          return _depositERC20({
            args: [
              inTokenInfo.address[inNetwork.chainName],
              outTokenAddress,
              parsedAmount,
              200000,
              "0x",
            ],
          });
        case "Withdraw":
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
          return callTokenSwap();
        case "Wrap":
          return wrapTON();
        case "Unwrap":
          return unwrapWTON();
        default:
          return console.error("action mode is not founded");
      }
    }
  }, [isConnected, connectToWallet, mode, inTokenInfo, address]);

  const { isOpen, onOpenConfirmModal } = useConfirmModal();

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
      onClick={isOpen ? onClick : onOpenConfirmModal}
    >
      {!isConnected && "Connect Wallet"}
      {isOpen
        ? `Confirm ${mode}`
        : isConnected && mode === null
        ? "Select Network"
        : mode}
    </Button>
  );
}
