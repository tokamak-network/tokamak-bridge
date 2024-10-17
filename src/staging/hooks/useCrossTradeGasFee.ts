import { BigNumber } from "ethers";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { useMemo } from "react";
import { recommendFeeConfig } from "../constants/fee";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { formatUnits } from "@/utils/trim/convertNumber";
import useConnectedNetwork from "@/hooks/network";
import { useFeeData } from "wagmi";
import JSBI from "jsbi";
import { useRecoilValue } from "recoil";
import {
  ATOM_CT_GAS_cancelCT,
  ATOM_CT_GAS_editCT,
  ATOM_CT_GAS_provideCT,
} from "@/recoil/crosstrade/networkFee";
import { calculateGasMargin } from "@/utils/txn/calculateGasMargin";

export const useCrossTradeGasFee = (trasnactionType: CTTransactionType) => {
  const provideCTgasUsage = useRecoilValue(ATOM_CT_GAS_provideCT);
  const editCTgasUsage = useRecoilValue(ATOM_CT_GAS_editCT);
  const cancelCTgasUsage = useRecoilValue(ATOM_CT_GAS_cancelCT);
  const estimatedGasUsage = useMemo(() => {
    switch (trasnactionType) {
      case CTTransactionType.provideCT:
        return provideCTgasUsage;
      case CTTransactionType.requestRegisteredToken:
        return recommendFeeConfig.gas[CTTransactionType.requestRegisteredToken];
      case CTTransactionType.editFee:
        return editCTgasUsage;
      case CTTransactionType.cancel:
        return cancelCTgasUsage;
      case CTTransactionType.strandardWithdrawERC20:
        return recommendFeeConfig.gas[CTTransactionType.strandardWithdrawERC20];
      default:
        return 0;
    }
  }, [trasnactionType, provideCTgasUsage, editCTgasUsage, cancelCTgasUsage]);

  const { connectedChainId } = useConnectedNetwork();
  const { data: feeData } = useFeeData({ chainId: connectedChainId });
  const { tokenMarketPrice } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: 1,
  });

  const estimatedGasFeeETH = useMemo(() => {
    switch (trasnactionType) {
      case CTTransactionType.requestRegisteredToken: {
        return 0.00014167255;
      }
      default: {
        if (feeData) {
          const { gasPrice } = feeData;
          return (Number(estimatedGasUsage) * Number(gasPrice)) / 1e18;
        }
      }
    }
  }, [trasnactionType, estimatedGasUsage, feeData]);

  const estimatedGasFeeUSD = useMemo(() => {
    if (tokenMarketPrice && estimatedGasFeeETH) {
      const precision = 1e18; // Adjust this value based on the required precision
      const bi_estimatedGasFee = JSBI.BigInt(
        Math.round(Number(estimatedGasFeeETH) * precision),
      );
      const bi_tokenMarketPrice = JSBI.BigInt(
        Math.round(Number(tokenMarketPrice) * precision),
      );
      const resultWithWei = JSBI.divide(
        JSBI.multiply(bi_estimatedGasFee, bi_tokenMarketPrice),
        JSBI.BigInt(precision),
      );
      const result = formatUnits(resultWithWei.toString(), 18);
      return result.toString();
    }
  }, [tokenMarketPrice, estimatedGasFeeETH]);

  return { estimatedGasFeeUSD, estimatedGasFeeETH };
};
