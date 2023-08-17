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
import useCallClaim from "@/hooks/user/actions/useCallClaim";
type TokenData = {
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;
  token0Decimals: number;
  token1Decimals: number;
};
export default function WithdrawTx(props: { tx: any}) {
  const { tx } = props;
  const { provider } = useProvier();
  const [tokenData, setTokenData] = useState<TokenData | undefined>();
  const { chain } = useNetwork();
  const { layer, chainName } = useConnectedNetwork();
  const providers = useGetTxLayers();
  const { claim } = useCallClaim();
  const zero_address = "0x0000000000000000000000000000000000000000";
  
  // console.log('tx',tx);
  
  const getTokenData = useCallback(async () => {
    if (tx._l1Token !== undefined && tx._l2Token !== undefined && chain?.id) {
      let token0Symbol, token0Name, token0Decimals;
      let token1Symbol, token1Name, token1Decimals;

      const l2Pro =
        layer === "L2" ? provider : getProvider(providers.l2Provider);
      const l1Pro =
        layer === "L1" ? provider : getProvider(providers.l1Provider);

      if (tx._l1Token === zero_address || tx._l1Token === undefined) {
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

      if (tx._l1Token === zero_address || tx._l1Token === undefined) {
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
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Flex justifyContent={"space-between"} w="100%">
        <Text fontSize={"14px"} fontWeight={600}>
          Withdraw
        </Text>
        <Button
          w="57px"
          h="24px"
          bg="#323442"
          fontSize={"12px"}
          isDisabled={tx.currentStatus ===6 }
          _hover={{}}
          _focus={{}}
          _active={{}}
          onClick={() => {
            return claim(tx);
          }}
        >
          Claim
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
      <StatusTx
        completed={true}
        date={tx.l2timeStamp}
        txHash={tx.l2txHash}
        layer={"L2"}
        tx={{
          ...tx,
          inTokenSymbol: tokenData?.token0Symbol,
          outTokenSymbol: tokenData?.token1Symbol,
          inTokenAmount: ethers.utils.formatUnits(
            tx._amount.toString(),
            tokenData?.token0Decimals
          )
        }}
      />

      <StatusTx
        completed={tx.timeReadyForRelay ? false : false}
        date={tx.l1timeStamp}
        timeStamp={Number(tx.timeReadyForRelay)}
        txHash={tx.l1txHash}
        layer={"L1"}
        tx={{
          ...tx,
          inTokenSymbol: tokenData?.token0Symbol,
          outTokenSymbol: tokenData?.token1Symbol,
          inTokenAmount: ethers.utils.formatUnits(
            tx._amount.toString(),
            tokenData?.token0Decimals
          )
        }}
      />
    </Flex>
  );
}
