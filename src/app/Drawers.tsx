import AccountHistory from "@/components/history/AccountHistory";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export default function Drawers() {
  const tData = useGetTransaction();
  const [data, setData] = useState<any>();
  const { address } = useAccount();

  const xx = useMemo(() => {
    return tData
  },[tData])

  return <AccountHistory tData={xx} />;
}
