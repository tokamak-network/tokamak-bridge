import { Flex,Text } from "@chakra-ui/layout";
import { Button , Box,keyframes} from "@chakra-ui/react";
import { Erc20Type, EthType } from "@/types/activity/history";
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
import GradientSpinner from "@/components/ui/gradientSpinner";

type TokenData = {
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;
  token0Decimals: number;
  token1Decimals: number;
};

export default function HalfLoadingTx(props: { tx: any }) {
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

      if (tx._l1Token === zero_address) {
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

  const gradientAnimation = keyframes`
  0% { background-position: -200% 0%; }
  100% { background-position: 200% 0%; }
`;


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
    <Flex
        flexDir={"column"}
        rowGap={"8px"}
        cursor={"pointer"}
        
      >
        <Flex justifyContent={"space-between"} w="100%">
          <Text fontSize={"14px"} fontWeight={600}>
            Withdraw
          </Text>
          <Button
            w={tx?.currentStatus > 5 ? "72px" : "57px"}
            h="24px"
            // bg="#007AFF"
            fontSize={"12px"}
            isDisabled={true}
            _hover={{}}
            _focus={{}}
            _active={{}}
            zIndex={1000}
         
            bgGradient="linear(to-r, #2b2f42 8%, #2b2f42 38%, #1c1d25 54%)"
            bgSize="200% 100%"
          
            animation={`${gradientAnimation} 10s linear infinite`}
          >
            
          </Button>
        </Flex>
        <TokenPairTx
          inAmount={ethers.utils.formatUnits(
            tx._amount.toString(),
            tokenData?.token0Decimals
          )}
          action="withdraw"
          outAmount={ethers.utils.formatUnits(
            tx._amount.toString(),
            tokenData?.token1Decimals
          )}
          inTokenSymbol={tokenData?.token0Symbol || "ETH"}
          outTokenSymbol={tokenData?.token1Symbol || "ETH"}
        />
      </Flex>
      <Flex w='100%'  height={'18px'}>
        <GradientSpinner/>
      </Flex>
      <Flex  w='100%'  height={'18px'}>
        <GradientSpinner/>
      </Flex>
    </Flex>
  );
}
