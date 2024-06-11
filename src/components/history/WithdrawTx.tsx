import Image from "next/image";
import { Flex, Text, Button } from "@chakra-ui/react";
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
import commafy from "@/utils/trim/commafy";

export default function WithdrawTx(props: { tx: FullWithTx }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const { claim } = useCallClaim("relayMessage");

  const [, setClaimTx] = useRecoilState(claimTx); //sets data for the claim withdraw function
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData); //sets the data for the withdraw confirm modal
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats); //status of the confirm withdraw modal

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
    //when the general area of the withdraw tx is clicked, it should open the confirm withdraw modal.
    //setting up the necessary data for the claim withdraw modal and set it to open
    if (tx !== undefined) {
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
      w={{ baes: "100%", lg: "336px" }}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={
        !mobileView
          ? "#15161D"
          : tx.currentStatus === 6 || (layer === "L2" && tx.l2txHash)
          ? ""
          : "#15161D"
      }
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
              <Flex columnGap={"4px"} onClick={handleCheckWithdrawModal}>
                <Text
                  fontSize={"14px"}
                  fontWeight={600}
                  color={
                    tx.currentStatus === 6 || (layer === "L2" && tx.l2txHash)
                      ? "#A0A3AD"
                      : ""
                  }
                >
                  {tx.currentStatus === 6 || (layer === "L2" && tx.l2txHash)
                    ? "Withdraw Completed"
                    : "Withdraw"}
                </Text>
              </Flex>
              <Flex
                columnGap={"4px"}
                align={"center"}
                onClick={handleCheckWithdrawModal}
              >
                <Text fontSize={12}>
                  {commafy(
                    ethers.utils.formatUnits(
                      tx._amount.toString(),
                      token?.decimals
                    ),
                    2
                  )}{" "}
                  {(token?.symbol as string) || "ETH"}
                </Text>
                <Image width={18} height={18} alt="link" src={LinkIcon} />
              </Flex>
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
                _hover={{}}
                zIndex={10000}
                _disabled={{ bg: "#1F2128" }}
                onClick={(event) => {
                  //if the claim is not ready, when this button is clicked the confirm withdraw modal opens and displays the details
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
                    // Prevent the click event from propagating to the parent Flex
                    //when the status is 5, the user can claim. confirm withdraw modal opens
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
                {/* depending on the currentStatus of the tx, show the name of the button */}
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
