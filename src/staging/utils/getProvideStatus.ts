import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import {
  T_FETCH_ProvideCTs_L1,
  T_FETCH_ProviderClaimCTs,
  T_provideCTs_L1,
  T_ProviderClaimCTs,
} from "../hooks/useCrossTrade";
import {
  CT_PROVIDE,
  CT_PROVIDE_HISTORY_blockTimestamps,
  CT_PROVIDE_HISTORY_transactionHashes,
} from "../types/transaction";

export const getProvideStatus = (params: {
  provideCT: T_provideCTs_L1;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
}): CT_PROVIDE => {
  const { provideCT, providerClaimCTs } = params;
  const saleCount = provideCT._saleCount;

  const isCompleted = isProvideCompleted({
    providerClaimCTs,
    saleCount,
  });
  if (isCompleted) return CT_PROVIDE.Completed;

  return CT_PROVIDE.Return;
};

export const isProvideCompleted = (params: {
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  saleCount: string;
}) => {
  const { providerClaimCTs, saleCount } = params;
  return providerClaimCTs.some(
    (providerClaimCT) => providerClaimCT._saleCount === saleCount
  );
};

export const getL2TransactionsBySaleCount = (params: {
  saleCount: string;
  transactions: T_FETCH_ProviderClaimCTs;
}) => {
  const { saleCount, transactions } = params;
  const result = transactions.filter(
    (transaction) => transaction._saleCount === saleCount
  );
  return result ? result[0] : null;
};

export const getProvideBlockTimestamp = (params: {
  status: CT_PROVIDE;
  provideCT: T_provideCTs_L1;
  providerClaimCT: T_ProviderClaimCTs | null;
}): CT_PROVIDE_HISTORY_blockTimestamps => {
  const { status, provideCT, providerClaimCT } = params;
  if (status === CT_PROVIDE.Completed && providerClaimCT) {
    return {
      provide: Number(provideCT.blockTimestamp),
      return: Number(providerClaimCT.blockTimestamp),
    };
  }
  return {
    provide: Number(provideCT.blockTimestamp),
    return: Number(provideCT.blockTimestamp + 500),
  };
};

export const getProvideTransactionHash = (params: {
  status: CT_PROVIDE;
  provideCT: T_provideCTs_L1;
  providerClaimCT: T_ProviderClaimCTs | null;
}): CT_PROVIDE_HISTORY_transactionHashes => {
  const { status, provideCT, providerClaimCT } = params;

  if (status === CT_PROVIDE.Completed && providerClaimCT) {
    return {
      provide: provideCT.transactionHash,
      return: providerClaimCT.transactionHash,
    };
  }

  return {
    provide: provideCT.transactionHash,
    return: "",
  };
};
