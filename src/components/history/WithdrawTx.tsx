import { Flex, Text, Button } from "@chakra-ui/react";
import TokenPairTx from "./TokenPairTx";
import StatusTx from "./StatusTx";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import useCallClaim from "@/hooks/user/actions/useCallClaim";
import { FullWithTx, FullDepTx } from "@/types/activity/history";
import { txDataStatus } from "@/recoil/global/transaction";

import { claimTx } from "@/recoil/userHistory/claimTx";
import { useRecoilState } from "recoil";
import { confirmWithdrawStats, confirmWithdrawData } from "@/recoil/modal/atom";
import { Hash } from "viem";
import { supportedTokens } from "@/types/token/supportedToken";

export default function WithdrawTx(props: { tx: FullWithTx }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const { claim } = useCallClaim("relayMessage");
  const [, setClaimTx] = useRecoilState(claimTx);
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);
  
  const [txData] = useRecoilState(txDataStatus);
const zeroAddress = '0x0000000000000000000000000000000000000000'
  const { data, isError, isLoading } = useToken({
    address: layer === "L1" ? ( tx._l1Token as Hash) : (tx._l2Token as Hash),
    enabled:tx._l1Token ===  zeroAddress? false :true,
  });
  const ethToken = {
    symbol: supportedTokens[0].tokenSymbol,
    decimals: supportedTokens[0].decimals
  }  
  const token = layer === "L1" &&  tx._l1Token === zeroAddress?ethToken :data

  return (
    <Flex
      h={"160px"}
      w={{ baes:"100%", lg:"336px" }}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}>
      <Flex
        flexDir={"column"}
        rowGap={"8px"}
        cursor={tx !== undefined && tx.currentStatus < 6?"pointer":'default'}
        onClick={() => {
          if (tx !== undefined && tx.currentStatus < 6) {
            setClaimTx(tx);
            setWithdrawStatus({
              isOpen: true,
            });
            setWithdrawData({
              modalData: {
                ...tx,
                inTokenSymbol: token?.symbol,
                outTokenSymbol: token?.symbol,
                inTokenAmount: ethers.utils.formatUnits(
                  tx._amount.toString(),
                  token?.decimals
                ),
              },
            });
          }
        }}>
        <Flex justifyContent={"space-between"} w="100%">
          <Text fontSize={"14px"} fontWeight={600}>
            Withdraw
          </Text>
          <Button
            w={tx?.currentStatus > 5 ? "72px" : "57px"}
            h="24px"
            bg="#007AFF"
            fontSize={"12px"}
            color={'#fff'}
            isDisabled={
              tx.currentStatus > 5 ||
              (txData?.hash?.transactionHash !== undefined &&
                txData?.hash.txSort === "Claim")
            }
            _hover={{}}
            _focus={{}}
            _active={{}}
            zIndex={10000}
            _disabled={{ bg: "#1F2128" }}
            onClick={(event) => {
               // Prevent the click event from propagating to the parent Flex
              if (tx?.currentStatus !== 5) {
                setClaimTx(tx);
                setWithdrawStatus({
                  isOpen: false,
                });
                setWithdrawData({
                  modalData: {
                    ...tx,
                    inTokenSymbol:  token?.symbol,
                    outTokenSymbol: token?.symbol,
                    inTokenAmount: ethers.utils.formatUnits(
                      tx._amount.toString(),
                      token?.decimals
                    ),
                  },
                });
              } else {
                event.stopPropagation();
                setClaimTx(tx);
                claim(tx);
                setWithdrawStatus({
                  isOpen: false,
                });
                setWithdrawData({
                  modalData: {
                    ...tx,
                    inTokenSymbol: token?.symbol,
                    outTokenSymbol: token?.symbol,
                    inTokenAmount: ethers.utils.formatUnits(
                      tx._amount.toString(),
                      token?.decimals
                    ),
                  },
                });
              }
            }}
          >
            {!tx
              ? "Details"
              : tx.currentStatus === 5
              ? "Claim"
              : tx.currentStatus > 5
              ? "Claimed"
              : "Details"}
          </Button>
        </Flex>
        <TokenPairTx
          inAmount={ethers.utils.formatUnits(
            tx._amount.toString(),
            token?.decimals
          )}
          action="withdraw"
          outAmount={ethers.utils.formatUnits(
            tx._amount.toString(),
            token?.decimals
          )}
          inTokenSymbol={token?.symbol as string|| "ETH"}
          outTokenSymbol={token?.symbol as string|| "ETH"}
        />
      </Flex>
      <StatusTx
        completed={true}
        date={Number(tx.l2timeStamp)}
        txHash={tx.l2txHash}
        layer={"L2"}
        tx={{
          ...tx,
          inTokenSymbol: token?.symbol as string,
          outTokenSymbol: token?.symbol as string,
          inTokenAmount: ethers.utils.formatUnits(
            tx._amount.toString(),
            token?.decimals
          ),
        }}
      />

      <StatusTx
        completed={tx.timeReadyForRelay ? false : false}
        date={Number(tx.l1timeStamp)}
        timeStamp={Number(tx.timeReadyForRelay)}
        txHash={tx.l1txHash}
        layer={"L1"}
        tx={{
          ...tx,
          inTokenSymbol: token?.symbol as string,
          outTokenSymbol: token?.symbol as string,
          inTokenAmount: ethers.utils.formatUnits(
            tx._amount.toString(),
            token?.decimals
          ),
        }}
      />
    </Flex>
  );
}
