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
type TokenData = {
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;
  token0Decimals: number;
  token1Decimals: number;
};
export default function WithdrawTx(props: { tx: any }) {
  const { tx } = props;
  const { provider } = useProvier();
  const [tokenData, setTokenData] = useState<TokenData | undefined>();
  const l1RpcProvider = getL1Provider();
  const { chain } = useNetwork();
  const { layer, chainName } = useConnectedNetwork();
  const { blockExplorer } = useConnectedNetwork();

  const returnProvider = (chainName: string | undefined) => {
    let l1Provider, l2Provider;
    switch (chainName) {
      case "DARIUS":
        l1Provider = supportedChain.filter((e) => e.chainName === "GOERLI")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "DARIUS")[0];

        return { l1Provider, l2Provider };

      case "TITAN":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        return { l1Provider, l2Provider };

      case "GOERLI":
        l1Provider = supportedChain.filter((e) => e.chainName === "GOERLI")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "DARIUS")[0];
        return { l1Provider, l2Provider };

      case "MAINNET":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];

        return { l1Provider, l2Provider };
      default:
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        return { l1Provider, l2Provider };
    }
  };
  const getTokenData = useCallback(async () => {
    if (
      tx.args._l1Token !== undefined &&
      tx.args._l2Token !== undefined &&
      chain?.id
    ) {
      const chainName = getKeyByValue(SupportedChainId, chain.id);

      const providers = returnProvider(chainName);

      const l2Provider = getProvider(providers?.l2Provider);

      const l1TokenContract = new ethers.Contract(
        tx.args._l1Token,
        ERC20_ABI.abi,
        getProvider(providers?.l1Provider)
      );
      const l2TokenContract = new ethers.Contract(
        tx.args._l2Token,
        ERC20_ABI.abi,
        l2Provider
      );      

      const [token0Symbol, token0Name, token0Decimals] = await Promise.all([
        l1TokenContract.symbol(),
        l1TokenContract.name(),
        l1TokenContract.decimals(),
      ]);

      const [token1Symbol, token1Name, token1Decimals] = await Promise.all([
        l2TokenContract.symbol(),
        l2TokenContract.name(),
        l2TokenContract.decimals(),
      ]);

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
  }, []);

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
      p='12px'
      flexDir={'column'}
      rowGap={'8px'}
    >
        <Flex justifyContent={'space-between'} w='100%'>
            <Text fontSize={'14px'} fontWeight={600}>Withdraw</Text>
            <Button w='57px' h='24px' bg='#323442' fontSize={'12px'} _hover={{}} _focus={{}} _active={{}}>Claim</Button>
        </Flex>
        <TokenPairTx inAmount="23.435" action="withdraw"
       
        outAmount={'23.435'}
        inTokenSymbol={ "ETH"}
        outTokenSymbol={ "ETH"}/>
        <StatusTx completed={true} date={1330515905} layer={'L1'}/>
        <StatusTx completed={false} date={1330515905} layer={'L2'}/>
    </Flex>
  );
}
