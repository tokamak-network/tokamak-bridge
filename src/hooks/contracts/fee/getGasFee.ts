import useCallDeposit from "@/hooks/bridge/actions/useCallDeposit";
import useCallWithdraw from "@/hooks/bridge/actions/useCallWithdraw";
import { useInOutNetwork } from "@/hooks/network";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useProvier } from "@/hooks/provider/useProvider";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useSmartRouter } from "@/hooks/uniswap/useSmartRouter";
import { supportedTokens } from "@/types/token/supportedToken";
import commafy from "@/utils/trim/commafy";
import { predeploys } from "@eth-optimism/contracts";
import { BigNumber, ethers, Signer } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useFeeData } from "wagmi";
import { TOKAMAK_CONTRACTS } from "@/constant/contracts";
import L2TitanBridgeAbi from "@/abis/L2StandardBridge.json";
import L2ThanosStandardBridgeAbi from "@/abis/L2ThanosStandardBridge.json";
import useConnectedNetwork from "@/hooks/network";
import useWrap from "@/hooks/swap/useTonWrap";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useApprove } from "@/hooks/token/useApproval";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { isETH as checkIsETH } from "@/utils/token/isETH";
import {
  asL2Provider,
  asL2Provider as asL2TitanProvider,
  estimateTotalGasCost,
} from "@tokamak-network/titan-sdk";
import { asL2Provider as asL2ThanosProvider } from "@tokamak-network/thanos-sdk";
import { THANOS_SEPOLIA_CHAIN_ID } from "@/constant/network/thanos";
import { isThanosChain } from "@/utils/network/checkNetwork";
import useContract from "../useContract";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { chainId } from "@/types/wagmi";
const thanosSDK = require("@tokamak-network/thanos-sdk");
import { getL1Provider } from "@/config/l1Provider";
import { getProvider } from "@/config/getProvider";
import useIsTon from "@/hooks/token/useIsTon";

export function useGasFee() {
  const { address } = useAccount();
  const [gasLimit, setGasLimit] = useState<bigint | undefined>(undefined);
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { inToken, outToken } = useInOutTokens();
  const { isTONIn, isTONOut, isTONatPair } = useIsTon();
  const { mode } = useGetMode();
  const { contract: _depositETH_contract } = useCallDeposit("depositETH");
  const { contract: _depositERC20_contract } = useCallDeposit("depositERC20");
  const { contract: _depositNativeToken_contract } =
    useCallDeposit("depositNativeToken");
  const { contract: _withdraw_contract } = useCallWithdraw("withdraw");
  const [totalGasCost, setTotalGasCost] = useState<string | null>(null);
  const { data: feeData } = useFeeData();
  const { routingPath } = useSmartRouter();
  const { estimatedGasUsageGwei } = useAmountOut();
  const { layer, isLayer2 } = useConnectedNetwork();
  const { provider } = useProvier();
  const { tokenMarketPrice } = useGetMarketPrice({ tokenName: "ethereum" });
  const { estimatedGasUsage: wrapUnwrapGasUsage } = useWrap();
  const { isBalanceOver } = useInputBalanceCheck();
  const { isApproved } = useApprove();
  const { L2BRIDGE_CONTRACT } = useContract();
  // const { estimatedGasUsageGwei } = useAmountOut();

  const swapGasUseEstimate = useMemo(() => {
    if (routingPath && mode === "Swap") {
      const { gasUseEstimate } = routingPath;
      if (gasUseEstimate) {
        return isLayer2
          ? estimatedGasUsageGwei
          : calculateGasMargin(BigNumber.from(gasUseEstimate));
      }
    }
  }, [routingPath, isLayer2, estimatedGasUsageGwei, mode]);

  const wrapUnwrapGasEstimate = useMemo(() => {
    if (
      wrapUnwrapGasUsage &&
      (mode === "ETH-Wrap" ||
        mode === "ETH-Unwrap" ||
        mode === "Wrap" ||
        mode === "Unwrap")
    ) {
      return wrapUnwrapGasUsage;
    }
  }, [wrapUnwrapGasUsage, mode]);
  const { L1Provider } = useProvier();
  useEffect(() => {
    const fetchEstimatedGas = async () => {
      if (inToken && inToken.amountBN && inNetwork && outNetwork && address) {
        const isETH = checkIsETH(inToken);
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
              const estimatedGasUsage =
                await _depositETH_contract.estimateGas.depositETH({
                  //@ts-ignore
                  account: address,
                  args: [200000, "0x"],
                  //need to put gasAmount with gasOrcale later
                  value: parsedAmount as bigint,
                });

              return calculateGasMargin(
                BigNumber.from(estimatedGasUsage)
              ).toBigInt();
            }
            // deposite TON to thanos
            if (isThanosChain(outNetwork.chainId) && isTONIn) {
              const estimatedGasUsage =
                await _depositNativeToken_contract.estimateGas.depositNativeToken(
                  {
                    //@ts-ignore
                    account: address,
                    args: [parsedAmount as bigint, 200000, "0x"],
                  }
                );
              return calculateGasMargin(
                BigNumber.from(estimatedGasUsage)
              ).toBigInt();
            }

            const estimatedGasUsage =
              await _depositERC20_contract.estimateGas.depositERC20({
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
            return calculateGasMargin(
              BigNumber.from(estimatedGasUsage)
            ).toBigInt();
          case "Withdraw":
            // Set the gas limit as default value when insufficient balance or non-approval
            if (isBalanceOver || !isApproved || !provider) {
              return 1400000;
            }

            const withdrawContract = new ethers.Contract(
              TOKAMAK_CONTRACTS.L2Bridge,
              L2TitanBridgeAbi,
              provider
            );
            const l2Provider = asL2Provider(provider);

            if (isETH) {
              const tx = await withdrawContract.populateTransaction.withdraw(
                predeploys.OVM_ETH,
                parsedAmount,
                1_300_000,
                "0x"
              );
              const estimateTotalGasCost =
                await l2Provider.estimateTotalGasCost({ ...tx, from: address });
              return estimateTotalGasCost;
            }
            const tx = await withdrawContract.populateTransaction.withdraw(
              inToken.address[inNetwork.chainName],
              parsedAmount,
              0,
              "0x"
            );
            // TODO: need to check the value to pass to the estimate gas function
            const estimateTotalGasCost = await l2Provider?.estimateTotalGasCost(
              { ...tx, from: address }
            );
            return estimateTotalGasCost;
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
                layer === "L2" ? estimatedGasUsage : totalGasCost.toString(),
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
    provider,
    feeData,
    swapGasUseEstimate,
    wrapUnwrapGasEstimate,
    layer,
  ]);

  const gasCostUS = useMemo(() => {
    if (totalGasCost && tokenMarketPrice) {
      return commafy(Number(totalGasCost) * Number(tokenMarketPrice), 2);
    }
  }, [totalGasCost, tokenMarketPrice, mode]);

  return { totalGasCost, gasCostUS, gasLimit };
}
