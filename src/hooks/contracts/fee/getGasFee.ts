import useCallDeposit from "@/hooks/bridge/actions/useCallDeposit";
import useCallWithdraw from "@/hooks/bridge/actions/useCallWithdraw";
import { useInOutNetwork } from "@/hooks/network";
import { useProvier } from "@/hooks/provider/useProvider";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedTokens } from "@/types/token/supportedToken";
import { predeploys } from "@eth-optimism/contracts";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useAccount, usePublicClient } from "wagmi";

export function useGasFee() {
  const { address } = useAccount();
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { inToken, outToken } = useInOutTokens();
  const { mode } = useRecoilValue(actionMode);

  const { contract: _depositETH_contract } = useCallDeposit("depositETH");
  const { contract: _depositERC20_contract } = useCallDeposit("depositERC20");
  const { contract: _withdraw_contract } = useCallWithdraw("withdraw");

  //   const { provider } = useProvier();
  const provider = usePublicClient();
  const [totalGasCost, setTotalGasCost] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstimatedGas = async () => {
      if (inToken && inToken.amountBN && inNetwork && outNetwork && address) {
        const isETH = inToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET || SupportedChainId.GOERLI
        );
        const parsedAmount = inToken.amountBN;

        switch (mode) {
          case "Swap":
            return;
          case "Deposit":
            const supportedOutToken = supportedTokens.filter(
              (token) => token.address === inToken.address
            )[0];
            const outTokenAddress =
              supportedOutToken.address[outNetwork.chainName];

            if (isETH) {
              return _depositETH_contract.estimateGas.depositETH({
                //@ts-ignore
                account: address,
                args: [200000, "0x"],
                //need to put gasAmount with gasOrcale later
                value: parsedAmount as bigint,
              });
            }

            return _depositERC20_contract.estimateGas.depositERC20({
              //@ts-ignore
              account: address,
              args: [
                inToken.address[inNetwork.chainName],
                outTokenAddress,
                parsedAmount,
                200000,
                "0x",
              ],
            });
          case "Withdraw":
            if (isETH) {
              return _withdraw_contract.estimateGas.withdraw({
                //@ts-ignore
                account: address,
                args: [predeploys.OVM_ETH, parsedAmount, 1_300_000, "0x"],
              });
            }
            return _withdraw_contract.estimateGas.withdraw({
              //@ts-ignore
              account: address,
              args: [
                inToken.address[inNetwork.chainName],
                parsedAmount,
                0,
                "0x",
              ],
            });
          default:
            return;
        }
      }
    };
    fetchEstimatedGas()
      .then(async (estimatedGasUsage) => {
        if (provider && estimatedGasUsage) {
          const gasPrice = await provider.getGasPrice();
          console.log("gasPrice : ", gasPrice);
          console.log("estimatedGasUsage : ", estimatedGasUsage);

          const totalGasCost = gasPrice * estimatedGasUsage;
          const parsedTotalGasCost = ethers.utils.formatUnits(
            totalGasCost.toString(),
            18
          );

          return setTotalGasCost(parsedTotalGasCost);
        }
      })
      .catch((e) => {
        console.log("**fetchEstimatedGas err*");
        console.log(e);
      });
  }, [
    address,
    mode,
    inToken,
    outToken,
    inNetwork,
    outNetwork,
    _depositETH_contract,
    _depositERC20_contract,
    _withdraw_contract,
    provider,
  ]);

  return { totalGasCost };
}
