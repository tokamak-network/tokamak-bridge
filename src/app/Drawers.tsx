import AccountHistory from "@/components/history/AccountHistory";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { tData } from "@/types/activity/history";

export default function Drawers() {
  // const tData = useGetTransaction();

  // const data = useMemo(() => {
  //   return tData
  // },[tData])

  return <AccountHistory />;
}
