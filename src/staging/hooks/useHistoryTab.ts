import { selectedTab } from "@/recoil/history/transaction";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { HISTORY_SORT } from "../types/transaction";

export const useHistoryTab = () => {
  const _selectedTab = useRecoilValue(selectedTab);

  const isOnOfficialStandard = useMemo(() => {
    return _selectedTab === HISTORY_SORT.STANDARD;
  }, [_selectedTab]);

  const isOnCrossTrade = useMemo(() => {
    return _selectedTab === HISTORY_SORT.CROSS_TRADE;
  }, [_selectedTab]);

  return {
    isOnOfficialStandard,
    isOnCrossTrade,
  };
};
