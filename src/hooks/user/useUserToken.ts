import { UserToken } from "@/types/user/userTokens";
import { useMemo, useState, useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { useCallContract } from "@/hooks/contracts/useCallContract";

export default function useUserToken() {
  const [userTokens, setUserTokens] = useState<UserToken | null>(null);

  const { data } = useBlockNumber({ watch: true });
  const { TON_CONTRACT } = useCallContract();

  useEffect(() => {}, [data]);

  return { userTokens };
}
