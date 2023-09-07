import { Flex, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import TokenPairTx from "./TokenPairTx";
import StatusTx from "./StatusTx";
import { useEffect, useCallback, useState } from "react";
import { ethers } from "ethers";
import ERC20_ABI from "@/abis/erc20.json";
import { useProvier } from "@/hooks/provider/useProvider";
import { supportedChain } from "@/types/network/supportedNetwork";
import { l2RpcProvider } from "@/config/l2Provider";
import { getL1Provider } from "@/config/l1Provider";
import { useNetwork } from "wagmi";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "@/hooks/network";
import { getProvider } from "@/config/getProvider";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import DepositStatusTx from "./DepositStatusTx";
import { FullWithTx } from "@/types/activity/history";

type TokenData = {
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;
  token0Decimals: number;
  token1Decimals: number;
};

export default function DepositTx(props: { tx: FullWithTx }) {

  
  const { tx } = props;
  const { provider } = useProvier();
  const [tokenData, setTokenData] = useState<TokenData | undefined>();
  const l1RpcProvider = getL1Provider();
  const { chain } = useNetwork();
  const { layer, chainName } = useConnectedNetwork();
  const { blockExplorer } = useConnectedNetwork();
  const providers = useGetTxLayers();

  const zero_address = "0x0000000000000000000000000000000000000000";

  const getTokenData = useCallback(async () => {
    if (tx._l1Token !== undefined && tx._l2Token !== undefined && chain?.id) {
      const chainName = getKeyByValue(SupportedChainId, chain.id);

      let token0Symbol, token0Name, token0Decimals;
      let token1Symbol, token1Name, token1Decimals;

      const l2Pro =
        layer === "L2" ? provider : getProvider(providers.l2Provider);
      const l1Pro =
        layer === "L1" ? provider : getProvider(providers.l1Provider);

      if (tx._l1Token === zero_address) {
        token0Symbol = "ETH";
        token0Name = "ETH";
        token0Decimals = 18;
      } else {
        const l1TokenContract = new ethers.Contract(
          tx._l1Token,
          ERC20_ABI.abi,
          l1Pro
        );
        [token0Symbol, token0Name, token0Decimals] = await Promise.all([
          l1TokenContract.symbol(),
          l1TokenContract.name(),
          l1TokenContract.decimals(),
        ]);
      }

      if (tx._l1Token === zero_address ) {
        token0Symbol = "ETH";
        token0Name = "ETH";
        token0Decimals = 18;
      } else {
        const l2TokenContract = new ethers.Contract(
          tx._l2Token,
          ERC20_ABI.abi,
          l2Pro
        );

        [token1Symbol, token1Name, token1Decimals] = await Promise.all([
          l2TokenContract.symbol(),
          l2TokenContract.name(),
          l2TokenContract.decimals(),
        ]);
      }

      return {
        token0Symbol: token0Symbol,
        token1Symbol: token1Symbol,
        token0Name: token0Name,
        token1Name: token1Name,
        token0Decimals: token0Decimals,
        token1Decimals: token1Decimals,
      };
    }

    return;
  }, [chain]);

  useEffect(() => {
    const fetchTokenData = async () => {
      const result = await getTokenData();
      setTokenData(result);
      return;
    };

    fetchTokenData();
  }, []);
  
  return (
    <Flex
      h={"160px"}
      w="336px"
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Flex justifyContent={"space-between"} w="100%">
        <Text fontSize={"14px"} fontWeight={600}>
          Deposit
        </Text>
      </Flex>
      <TokenPairTx
        action="deposit"
        inAmount={ethers.utils.formatUnits(
          tx._amount.toString(),
          tokenData?.token0Decimals
        )}
        outAmount={ethers.utils.formatUnits(
          tx._amount.toString(),
          tokenData?.token1Decimals
        )}
        inTokenSymbol={tokenData?.token0Symbol || "ETH"}
        outTokenSymbol={tokenData?.token1Symbol || "ETH"}
      />
      <DepositStatusTx
        completed={true}
        date={Number(tx.l1timeStamp)}
        layer={"L1"}
        txHash={tx.l1txHash}
        tx={tx}
      />
      <DepositStatusTx
        completed={tx.l2txHash?true:false}
        date={Number(tx.l2timeStamp)}
        layer={"L2"}
        txHash={tx.l2txHash}
        tx={tx}
      />
    </Flex>
  );
}
