const thanosSDK = require("@tokamak-network/thanos-sdk");

import { SupportedChainId } from "@/types/network/supportedNetwork";
import { useCallback } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import {
  Action,
  DepositWithdrawType,
  StandardHistory,
  Status,
  WithdrawTransactionHistory,
} from "../types/transaction";
import { BigNumber, ethers } from "ethers";
import { providerByChainId } from "@/config/getProvider";
import { CrossChainMessenger } from "@tokamak-network/thanos-sdk";
import {
  getBridgeL1ChainId,
  getBridgeL2ChainId,
  getDepositWithdrawType,
} from "../components/new-confirm/utils";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";
import { useRecoilState } from "recoil";
import { thanosDepositWithdrawConfirmModalStatus } from "@/recoil/modal/atom";
export const useThanosGasFee = () => {
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const [
    thanosDepositWithdrawConfirmModal,
    setThanosDepositWithdrawConfirmModal,
  ] = useRecoilState(thanosDepositWithdrawConfirmModalStatus);
  const getGasEstimation = useCallback(
    async (tx: StandardHistory) => {
      const l1ChainId = getBridgeL1ChainId(tx);
      const l2ChainId = getBridgeL2ChainId(tx);
      const amount = (tx as WithdrawTransactionHistory).amount;
      const type = getDepositWithdrawType(tx.inToken.symbol);
      if (!isConnected || !l1ChainId || !l2ChainId) return null;
      const l1Provider = providerByChainId[l1ChainId];
      const l2Provider = providerByChainId[l2ChainId];
      const currentProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = await currentProvider.getSigner();
      const from = await signer.getAddress();
      const cm: CrossChainMessenger = new thanosSDK.CrossChainMessenger({
        bedrock: true,
        l1ChainId: l1ChainId,
        l2ChainId: l2ChainId,
        l1SignerOrProvider: l1Provider,
        l2SignerOrProvider: l2Provider,
        nativeTokenAddress: getTokenAddressByChainId("TON", l1ChainId),
      });
      const gasPrice =
        tx.status === Status.Prove ||
        tx.status === Status.Finalize ||
        tx.action === Action.Deposit
          ? await l1Provider.getGasPrice()
          : await l2Provider.getGasPrice();

      const estimageGas = async () => {
        const provider = thanosSDK.asL2Provider(l2Provider);
        if (tx.action === Action.Deposit) {
          return null; // will be updated once deposit comes here
        } else {
          if (tx.status === Status.Initiate) {
            if (!amount) return null;
            switch (type) {
              case DepositWithdrawType.ETH:
                const withdrawETHTxRequest =
                  await cm.populateTransaction.withdrawETH(amount);
                return await provider.estimateTotalGasCost({
                  ...withdrawETHTxRequest,
                  from: from,
                  type: 2,
                });
              case DepositWithdrawType.NativeToken:
                const withdrawNTTxRequest =
                  await cm.populateTransaction.withdrawNativeToken(amount);
                return await provider.estimateTotalGasCost({
                  ...withdrawNTTxRequest,
                  from: from,
                  type: 2,
                });
              default:
                const withdrawERC20TxRequest =
                  await cm.populateTransaction.withdrawERC20(
                    tx.outToken.address,
                    tx.inToken.address,
                    amount
                  );
                return await provider.estimateTotalGasCost({
                  ...withdrawERC20TxRequest,
                  from: from,
                  type: 2,
                });
            }
          } else if (tx.status === Status.Prove) {
            return (
              await cm.estimateGas.proveMessage(
                tx.transactionHashes.initialTransactionHash,
                {
                  overrides: {
                    from: from,
                  },
                }
              )
            ).mul(gasPrice);
          } else if (tx.status === Status.Finalize) {
            return (
              await cm.estimateGas.finalizeMessage(
                tx.transactionHashes.initialTransactionHash,
                {
                  overrides: {
                    from: from,
                  },
                }
              )
            ).mul(gasPrice);
          }
        }
        return null;
      };
      const gasEstimation = await estimageGas();
      if (!gasEstimation) return null;
      const gasFee = ethers.utils.formatEther(gasEstimation);
      return {
        amount: +(+gasFee).toFixed(4),
        tokenSymbol:
          tx.action === Action.Withdraw && tx.status === Status.Initiate
            ? "TON"
            : "ETH",
      };
    },
    [isConnected, chain, address, thanosDepositWithdrawConfirmModal]
  );
  return { getGasEstimation };
};
