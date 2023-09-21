import AccountHistory from "@/components/history/AccountHistory";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { tData } from "@/types/activity/history";
import useConnectedNetwork from "@/hooks/network";
import useCrosschainMessenger from "@/hooks/user/useCrosschainMessenger";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import { txListStatus } from "@/recoil/userHistory/transaction";
import { useRecoilState } from "recoil";

export default function Drawers() {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { crossMessenger, crossMessengerTokamak } = useCrosschainMessenger();
  const { address } = useAccount();
const [txList, setTxList] = useRecoilState(txListStatus)

  useEffect(() => {
    const getTxs = async () => {
      if (isConnectedToMainNetwork !== undefined && crossMessenger !== undefined) {
        const txs = await fetchUserTransactions(
          address,
          isConnectedToMainNetwork,
          crossMessenger
        );
        console.log('txs',txs);
    
        setTxList(txs)
         
      }
    };

   
    getTxs();
  }, [isConnectedToMainNetwork, address,crossMessenger]);

  console.log('txList',txList);
  
  return <AccountHistory />;
}

