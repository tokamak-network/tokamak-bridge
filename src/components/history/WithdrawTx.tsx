import Image from "next/image";
import { Flex, Text, Button, Link } from "@chakra-ui/react";
import TokenPairTx from "./TokenPairTx";
import StatusTx from "./StatusTx";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import useCallClaim from "@/hooks/user/actions/useCallClaim";
import { FullWithTx } from "@/types/activity/history";
import { txDataStatus } from "@/recoil/global/transaction";

import { claimTx } from "@/recoil/userHistory/claimTx";
import { useRecoilState } from "recoil";
import { confirmWithdrawStats, confirmWithdrawData } from "@/recoil/modal/atom";
import { Hash } from "viem";
import { supportedTokens } from "@/types/token/supportedToken";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";

import TitanRect from "@/assets/icons/network/Titan_no_border.svg";
import LinkIcon from "@/assets/icons/link.svg";

export default function WithdrawTx(props: { tx: FullWithTx }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const { claim } = useCallClaim("relayMessage");
  const [, setClaimTx] = useRecoilState(claimTx);
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);

  const [txData] = useRecoilState(txDataStatus);
  const { mobileView } = useMediaView();
  const providers = useGetTxLayers();

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const { data } = useToken({
    address: layer === "L1" ? (tx._l1Token as Hash) : (tx._l2Token as Hash),
    enabled: tx._l1Token === zeroAddress ? false : true,
  });
  const ethToken = {
    symbol: supportedTokens[0].tokenSymbol,
    decimals: supportedTokens[0].decimals,
  };
  const token = layer === "L1" && tx._l1Token === zeroAddress ? ethToken : data;

  const handleCheckWithdrawModal = () => {
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
  };

  return (
    <Flex
      h={"160px"}
      w={{ baes: "100%", lg: "336px" }}
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
        cursor={
          tx !== undefined && tx.currentStatus < 6 ? "pointer" : "default"
        }
        onClick={() => !mobileView && handleCheckWithdrawModal()}
      >
        <Flex justifyContent={"space-between"} w="100%">
          {mobileView ? (
            <>
              <Link
                target="_blank"
                href={
                  tx.currentStatus === 6 || tx.l1txHash
                    ? `${providers.l1BlockExplorer}/tx/${tx.l1txHash}`
                    : undefined
                }
                style={{ textDecoration: "none" }}
                onClick={handleCheckWithdrawModal}
              >
                <Flex columnGap={"4px"}>
                  <Text fontSize={"14px"} fontWeight={600}>
                    Withdraw from
                  </Text>
                  <Image alt="titan" width={18} height={18} src={TitanRect} />
                </Flex>
              </Link>
              <Link
                target="_blank"
                href={
                  tx.currentStatus === 6 || tx.l1txHash
                    ? `${providers.l1BlockExplorer}/tx/${tx.l1txHash}`
                    : undefined
                }
                style={{ textDecoration: "none" }}
                onClick={handleCheckWithdrawModal}
              >
                <Flex columnGap={"4px"} align={"center"}>
                  <Text fontSize={12}>
                    {ethers.utils.formatUnits(
                      tx._amount.toString(),
                      token?.decimals
                    )}{" "}
                    {(token?.symbol as string) || "ETH"}
                  </Text>
                  <Image width={18} height={18} alt="link" src={LinkIcon} />
                </Flex>
              </Link>
            </>
          ) : (
            <>
              <Text fontSize={"14px"} fontWeight={600}>
                Withdraw
              </Text>
              <Button
                w={tx?.currentStatus > 5 ? "72px" : "57px"}
                h="24px"
                bg="#007AFF"
                fontSize={"12px"}
                color={"#fff"}
                isDisabled={
                  tx.currentStatus > 5 ||
                  (txData?.hash?.transactionHash !== undefined &&
                    txData?.hash.txSort === "Claim")
                }
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
                        inTokenSymbol: token?.symbol,
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
            </>
          )}
        </Flex>

        {!mobileView && (
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
            inTokenSymbol={(token?.symbol as string) || "ETH"}
            outTokenSymbol={(token?.symbol as string) || "ETH"}
          />
        )}
      </Flex>
      {!mobileView && (
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
      )}

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
