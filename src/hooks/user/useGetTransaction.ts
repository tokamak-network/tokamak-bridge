import { transactionData } from "@/recoil/global/transaction";
import { useRecoilValue, useRecoilState } from "recoil";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect } from "react";
import { getContract } from "viem";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import useContract from "@/hooks/contracts/useContract";

import { useContractWrite, usePublicClient } from "wagmi";
import { ethers } from "ethers";

export default function useGetTransaction() {
  const [tData, setTData] = useRecoilState(transactionData);
  const { provider } = useProvier();
  const { L1BRIDGE_CONTRACT } = useContract();

  const fetchTransactions = useCallback(async () => {
   
    const bridge = new ethers.Contract(
      L1BRIDGE_CONTRACT,L1BridgeAbi, provider
    )

  
    // const endBlock = await provider.getBlockNumber();
    // const startBlock = endBlock - 100;
    // let txs = [];
    // for (let i = startBlock; i <= endBlock; i++) {
    //   if (i % 500 === 0) {
    //     console.log(`Searching block ${i}`);
    //   }
    //   const block = await provider.getBlockWithTransactions(i);
    //   if (block.transactions) {
    //     txs.push(block.transactions);
    //   }
    // }

   

    console.log('bridge',bridge.filters);

    const filter = bridge
    console.log('filter',filter);
   
    const xx = await bridge.queryFilter(filter)
  
    // const zero = xx.slice(-20)
    const bb = xx.filter((event) => event.args?._from === '0xfA36995FC6B4E9C17E35191A802901741d929960')
 console.log('bb',bb);
 
    console.log(xx);

    // return console.log("txs", txs);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);
  return tData;
}
