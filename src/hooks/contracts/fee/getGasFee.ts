import useCallDeposit from "@/hooks/bridge/actions/useCallDeposit";
import useCallWithdraw from "@/hooks/bridge/actions/useCallWithdraw";
import { useInOutNetwork } from "@/hooks/network";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useProvier } from "@/hooks/provider/useProvider";
import { useSwapTokens } from "@/hooks/swap/useSwapTokens";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useSmartRouter } from "@/hooks/uniswap/useSmartRouter";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { supportedTokens } from "@/types/token/supportedToken";
import commafy from "@/utils/trim/commafy";
import { predeploys } from "@eth-optimism/contracts";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useAccount, useFeeData, usePublicClient } from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import { getProvider } from "@/config/getProvider";
import useConnectedNetwork from "@/hooks/network";
import useWrap from "@/hooks/swap/useTonWrap";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useApprove } from "@/hooks/token/useApproval";

export function useGasFee() {
  const { address } = useAccount();
  const [gasLimit, setGasLimit] = useState<BigInt | undefined>(undefined);
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { inToken, outToken } = useInOutTokens();
  const { mode } = useRecoilValue(actionMode);

  const { contract: _depositETH_contract } = useCallDeposit("depositETH");
  const { contract: _depositERC20_contract } = useCallDeposit("depositERC20");
  const { contract: _withdraw_contract } = useCallWithdraw("withdraw");
  const providers = useGetTxLayers();
  const titanSDK = require("@tokamak-network/tokamak-layer2-sdk");

  const [totalGasCost, setTotalGasCost] = useState<string | null>(null);
  const { data: feeData } = useFeeData();
  const { routingPath } = useSmartRouter();
  const { layer } = useConnectedNetwork();
  const { provider } = useProvier();
  const { tokenMarketPrice } = useGetMarketPrice({ tokenName: "ethereum" });
  const l2Pro = layer === "L2" ? provider : getProvider(providers.l2Provider);
  const { estimatedGasUsage: wrapUnwrapGasUsage } = useWrap();
  const { isBalanceOver } = useInputBalanceCheck();
  const { isApproved } = useApprove();

  const swapGasUseEstimate = useMemo(() => {
    if (routingPath && tokenMarketPrice) {
      const { gasUseEstimate } = routingPath;
      return gasUseEstimate;
    }
  }, [routingPath]);

  const wrapUnwrapGasEstimate = useMemo(() => {
    if (wrapUnwrapGasUsage) {
      return wrapUnwrapGasUsage;
    }
  }, [wrapUnwrapGasUsage]);

  const withdrawContract = new ethers.Contract(
    TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    L2BridgeAbi,
    l2Pro
  );

  useEffect(() => {
    const fetchEstimatedGas = async () => {
      if (inToken && inToken.amountBN && inNetwork && outNetwork && address) {
        const isETH = inToken.isNativeCurrency?.includes(
          SupportedChainId.MAINNET
        );
        const parsedAmount = inToken.amountBN;
        switch (mode) {
          case "Swap":
            return swapGasUseEstimate;
          case "ETH-Unwrap":
            return wrapUnwrapGasEstimate;

          case "ETH-Wrap":
            return wrapUnwrapGasEstimate;

          case "Unwrap":
            return wrapUnwrapGasEstimate;
          case "Wrap":
            return wrapUnwrapGasEstimate;
          case "Deposit":
            const supportedOutToken = supportedTokens.filter(
              (token) => token.address === inToken.address
            )[0];
            const outTokenAddress =
              supportedOutToken.address[outNetwork.chainName];

            // Set the gas limit as default value when can't fetch from contract function due to insufficient balance or non-approval
            if (isBalanceOver || !isApproved) {
              return 200000;
            }

            if (isETH) {
              return _depositETH_contract.estimateGas.depositETH({
                //@ts-ignore
                account: address,
                //@ts-ignore
                args: [200000, "0x"],
                //need to put gasAmount with gasOrcale later
                value: parsedAmount as bigint,
              });
            }

            return _depositERC20_contract.estimateGas.depositERC20({
              //@ts-ignore
              account: address,
              //@ts-ignore
              args: [
                inToken.address[inNetwork.chainName],
                outTokenAddress,
                parsedAmount,
                200000,
                "0x",
              ],
            });
          case "Withdraw":
            // Set the gas limit as default value when insufficient balance or non-approval
            if (isBalanceOver || !isApproved) {
              return 1400000;
            }

            if (isETH) {
              const tx = await withdrawContract.populateTransaction.withdraw(
                predeploys.OVM_ETH,
                parsedAmount,
                0,
                "0x"
              );

              tx.from = address;

              const l2ProSDK = titanSDK.asL2Provider(
                getProvider(providers.l2Provider)
              );
              const signer = l2ProSDK?.getSigner(address);

              const estimateProvider = signer?.provider;

              return estimateProvider?.estimateTotalGasCost(tx);
            }
            const tx = await withdrawContract.populateTransaction.withdraw(
              inToken.address[inNetwork.chainName],
              parsedAmount,
              0,
              "0x"
            );
            tx.from = address;
            const l2ProSDK = titanSDK.asL2Provider(
              getProvider(providers.l2Provider)
            );
            const signer = l2ProSDK?.getSigner(address);

            const estimateProvider = signer?.provider;
            return estimateProvider?.estimateTotalGasCost(tx);
          default:
            return;
        }
      }
    };
    fetchEstimatedGas()
      .then((estimatedGasUsage) => {
        if (estimatedGasUsage && feeData) {
          setGasLimit(BigInt(Number(estimatedGasUsage)));
          const { gasPrice } = feeData;
          if (gasPrice) {
            if (mode !== "Withdraw") {
              const totalGasCost = Number(gasPrice) * Number(estimatedGasUsage);
              const parsedTotalGasCost = ethers.utils.formatUnits(
                totalGasCost.toString(),
                "ether"
              );

              return setTotalGasCost(parsedTotalGasCost);
            } else {
              const totalGas = ethers.utils.formatUnits(
                estimatedGasUsage.toString(),
                "ether"
              );
              return setTotalGasCost(totalGas);
            }
          }
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
    // _depositETH_contract,
    // _depositERC20_contract,
    // _withdraw_contract,
    provider,
    feeData,
    swapGasUseEstimate,
  ]);

  const gasCostUS = useMemo(() => {
    if (totalGasCost && tokenMarketPrice) {
      if (mode !== "Withdraw") {
        return commafy(Number(totalGasCost) * Number(tokenMarketPrice), 2);
      } else {
        return commafy(Number(totalGasCost) * Number(tokenMarketPrice), 5);
      }
    }
  }, [totalGasCost, tokenMarketPrice, mode]);

  return { totalGasCost, gasCostUS };
}
