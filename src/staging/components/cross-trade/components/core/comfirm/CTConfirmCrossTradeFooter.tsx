import {
  Box,
  Checkbox,
  Button,
  Text,
  Flex,
  Grid,
  Center,
  Link,
  Spinner,
} from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CT_History } from "@/staging/types/transaction";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { isETH } from "@/utils/token/isETH";
import { ZERO_ADDRESS } from "@/constant/misc";
import {
  T_FETCH_REQUEST_LIST_L2,
  useRequestData,
} from "@/staging/hooks/useCrossTrade";
import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useApprove } from "@/hooks/token/useApproval";
import getBlockExplorerUrl from "@/staging/utils/getBlockExplorerUrl";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getSupportedTokenInfo } from "@/utils/token/getSupportedTokenInfo";
import { selectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilState } from "recoil";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useAccount } from "wagmi";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { TooltipForRevoke } from "@/components/tooltip/RevokeTooltip";
import { WarningText } from "@/components/ui/WarningText";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import useMediaView from "@/hooks/mediaView/useMediaView";

export type ContractWrite = (args: { args: any[]; value?: BigInt }) => void;
type TradeConfirmationProps = {
  isChecked: {
    firstChecked: boolean;
    secondChecked: boolean;
    thirdChecked: boolean;
  };
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  txData: CT_History | null;
  isProvide?: boolean;
  subgraphData?: T_FETCH_REQUEST_LIST_L2;
  provideCT: ContractWrite;
  requestRegisteredToken: ContractWrite;
  forConfirmProviding?: {
    isUpdateFee: boolean;
    initialCTAmount: string;
    editedCTAmount: bigint;
  };
  isInRelay?: boolean;
};

export default function CTConfirmCrossTradeFooter(
  props: TradeConfirmationProps,
) {
  const {
    isChecked,
    onCheckboxChange,
    isProvide,
    txData,
    subgraphData,
    provideCT,
    requestRegisteredToken,
    forConfirmProviding,
    isInRelay,
  } = props;

  const [provideConfirmed, setProvideConfirmed] = useState<boolean>(false);
  const { isConnectedToMainNetwork, chainName } = useConnectedNetwork();
  const { isConnected } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const blockExplorer = getBlockExplorerUrl(
    isConnectedToMainNetwork
      ? SupportedChainId.TITAN
      : SupportedChainId.TITAN_SEPOLIA,
  );
  const inTokenInfo = getSupportedTokenInfo({
    tokenAddress: txData?.inToken.address as string,
    networkName: chainName as string,
    tokenSymbol: txData?.inToken.symbol as string,
  });

  const { isApproved, isLoading, isRevokeForUSDT, callApprove } =
    useApprove("Cross Trade");
  const { mode } = useGetMode();
  const { connectedToLayer1 } = useConnectedNetwork();
  const { isBalanceOver } = useInputBalanceCheck();
  const btnDisabled = useMemo(() => {
    if (!isConnected) {
      return false;
    }
    if (isInRelay) return false;
    if (!isApproved || isBalanceOver) return true;
    if (isProvide) return !provideConfirmed || !connectedToLayer1;
    return (
      !isChecked.firstChecked ||
      !isChecked.secondChecked ||
      !isChecked.thirdChecked
    );
  }, [
    isProvide,
    isChecked,
    provideConfirmed,
    isApproved,
    connectedToLayer1,
    isConnected,
    isBalanceOver,
    isInRelay,
  ]);
  const buttonName = useMemo(() => {
    return !isConnected
      ? "Connect Wallet"
      : isProvide && !connectedToLayer1 && !isInRelay
        ? "Wrong Network"
        : isProvide
          ? isInRelay
            ? "Go to home"
            : isBalanceOver
              ? "Insufficient Balance"
              : "Provide"
          : "Request";
  }, [isConnected, isProvide, connectedToLayer1, isBalanceOver, isInRelay]);

  const { inToken } = useInOutTokens();
  const inTokenIsETH = isETH(inToken);

  const approveBtnDisabled = useMemo(() => {
    return isLoading
      ? true
      : mode === "Withdraw"
        ? !isChecked.firstChecked ||
          !isChecked.secondChecked ||
          !isChecked.thirdChecked
        : !provideConfirmed;
  }, [isApproved, isLoading, provideConfirmed, isChecked, mode]);

  //set inTokenInfo for useApprove hook
  const [, setInTokenRecoilValue] = useRecoilState(selectedInTokenStatus);
  useEffect(() => {
    if (inTokenInfo && txData)
      setInTokenRecoilValue({
        ...inTokenInfo,
        amountBN: BigInt(txData.inToken.amount),
        parsedAmount: formatUnits(
          txData.inToken.amount,
          txData.inToken.decimals,
        ),
        tokenAddress: txData.outToken.address,
      });
  }, [inTokenInfo]);

  //call a contract call
  const { setModalOpen } = useTxConfirmModal();
  const { onCloseCTConfirmModal } = useFxConfirmModal();

  const requestCrossTrade = useCallback(() => {
    if (isInRelay) return onCloseCTConfirmModal();
    if (!txData) return new Error("txData is not defined");
    try {
      if (isProvide) {
        if (!subgraphData) return console.error("subgraphData is not defined");
        if (!forConfirmProviding)
          return console.error("forConfirmProviding data is not defined");

        const { isUpdateFee, initialCTAmount, editedCTAmount } =
          forConfirmProviding;
        const _editedAmount = isUpdateFee ? editedCTAmount : 0;

        if (isZeroAddress(subgraphData._l1token)) {
          const msgValue = isUpdateFee
            ? editedCTAmount
            : BigInt(subgraphData._ctAmount);
          console.log(
            "--provideCT params--",
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            subgraphData._requester,
            subgraphData._totalAmount,
            subgraphData._ctAmount,
            _editedAmount,
            subgraphData._saleCount,
            subgraphData._l2chainId,
            500000,
            subgraphData._hashValue,
            {
              value: msgValue,
            },
          );
          return provideCT({
            args: [
              ZERO_ADDRESS,
              ZERO_ADDRESS,
              subgraphData._requester,
              subgraphData._totalAmount,
              subgraphData._ctAmount,
              _editedAmount,
              subgraphData._saleCount,
              subgraphData._l2chainId,
              500000,
              subgraphData._hashValue,
            ],
            value: msgValue,
          });
        }
        console.log("--provideCT params--", {
          _l1token: subgraphData._l1token,
          _l2token: subgraphData._l2token,
          _requester: subgraphData._requester,
          _totalAmount: subgraphData._totalAmount,
          _ctAmount: subgraphData._ctAmount,
          _editedAmount: _editedAmount,
          _saleCount: subgraphData._saleCount,
          _l2chainId: subgraphData._l2chainId,
          _minGasLimit: 500000,
          _hashValue: subgraphData._hashValue,
        });
        return provideCT({
          args: [
            subgraphData._l1token,
            subgraphData._l2token,
            subgraphData._requester,
            subgraphData._totalAmount,
            subgraphData._ctAmount,
            _editedAmount,
            subgraphData._saleCount,
            subgraphData._l2chainId,
            500000,
            subgraphData._hashValue,
          ],
        });
      }

      /**
       * For Request Cross Trade below:
       */

      const ctAmount =
        BigInt(txData.inToken.amount) - BigInt(txData.serviceFee.toString());
      console.log(
        "--requestRegisteredToken params--",
        txData.outToken.address,
        txData.inToken.address,
        txData.inToken.amount,
        ctAmount,
        txData.outNetwork,
      );

      if (inTokenIsETH) {
        return requestRegisteredToken({
          args: [
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            txData.inToken.amount,
            ctAmount,
            txData.outNetwork,
          ],
          value: BigInt(txData.inToken.amount as string),
        });
      }
      return requestRegisteredToken({
        args: [
          txData.outToken.address,
          txData.inToken.address,
          txData.inToken.amount,
          ctAmount,
          txData.outNetwork,
        ],
      });
    } catch (e) {
      console.log("**error**");
      console.log(e);
      setModalOpen("error");
    }
  }, [
    isProvide,
    inTokenIsETH,
    txData,
    requestRegisteredToken,
    provideCT,
    forConfirmProviding,
    isInRelay,
  ]);

  const { mobileView } = useMediaView();

  return (
    <Grid mt={"3px"} w={"100%"} rowGap={"12px"} marginTop={"12px"}>
      {/** Check Box */}
      {!isProvide && (
        <Flex w={"100%"} flexDir={"column"} rowGap={"8px"} mt={"5px"}>
          <Text
            color={"#A0A3AD"}
            fontWeight={600}
            fontSize={13}
            lineHeight={"20px"}
            letterSpacing={"0.01em"}
          >
            I understand
          </Text>
          <Checkbox
            isChecked={isChecked.firstChecked}
            id={"firstChecked"}
            onChange={onCheckboxChange}
            icon={<CheckCustomIcon />}
            sx={{
              ".chakra-checkbox__control": {
                borderWidth: "1px",
                borderColor: "#A0A3AD",
                _focus: {
                  boxShadow: "none",
                },
              },
              _checked: {
                "& .chakra-checkbox__control": {
                  borderColor: "#FFFFFF",
                },
              },
            }}
            colorScheme="#A0A3AD"
          >
            <Text
              color={isChecked.firstChecked ? "#FFFFFF" : "#A0A3AD"}
              fontWeight={400}
              fontSize={12}
              lineHeight={"20px"}
            >
              there is no guaranteed deadline, and
            </Text>
          </Checkbox>
          <Checkbox
            isChecked={isChecked.secondChecked}
            id={"secondChecked"}
            onChange={onCheckboxChange}
            icon={<CheckCustomIcon />}
            sx={{
              ".chakra-checkbox__control": {
                borderWidth: "1px",
                borderColor: "#A0A3AD",
                _focus: {
                  boxShadow: "none",
                },
              },
              _checked: {
                "& .chakra-checkbox__control": {
                  borderColor: "#FFFFFF",
                },
              },
            }}
            colorScheme="#A0A3AD"
          >
            <Text
              color={isChecked.secondChecked ? "#FFFFFF" : "#A0A3AD"}
              fontWeight={400}
              fontSize={12}
              lineHeight={"20px"}
              letterSpacing={"0.01em"}
            >
              the request can be edited from L1, and
            </Text>
          </Checkbox>
          <Checkbox
            isChecked={isChecked.thirdChecked}
            id={"thirdChecked"}
            onChange={onCheckboxChange}
            icon={<CheckCustomIcon />}
            sx={{
              ".chakra-checkbox__control": {
                borderWidth: "1px",
                borderColor: "#A0A3AD",
                _focus: {
                  boxShadow: "none",
                },
              },
              _checked: {
                "& .chakra-checkbox__control": {
                  borderColor: "#FFFFFF",
                },
              },
            }}
            colorScheme="#A0A3AD"
          >
            <Text
              color={isChecked.thirdChecked ? "#FFFFFF" : "#A0A3AD"}
              fontWeight={400}
              fontSize={12}
              lineHeight={"20px"}
              letterSpacing={"0.01em"}
            >
              Cross Trade is in a beta testing phase
            </Text>
          </Checkbox>
        </Flex>
      )}
      {isProvide && isConnected && !isInRelay && (
        <Grid
          textAlign={"center"}
          w={mobileView ? "100%" : "364px"}
          p={"16px"}
          border={"1px solid #DB00FF"}
          borderRadius={"8px"}
          rowGap={"12px"}
        >
          <Flex flexDir={"column"} fontSize={12} lineHeight={"20px"}>
            <Text>
              <span
                style={{
                  fontWeight: 600,
                  color: "#DB00FF",
                  marginRight: "3px",
                }}
              >
                Warning:
              </span>
              Tokamak Bridge can&apos;t guarantee this
            </Text>
            <Text>request&apos;s validity or compensate for lost funds.</Text>
            <Text>
              <Link
                ml={"2px"}
                textDecor={"underline"}
                href={`${blockExplorer}/tx/${subgraphData?.transactionHash}`}
                isExternal={true}
                fontWeight={600}
              >
                Verity this request
              </Link>{" "}
              before providing liquidity.
            </Text>
          </Flex>
          {!provideConfirmed && !isInRelay ? (
            <Center>
              <Button
                w={"200px"}
                h={"36px"}
                _hover={{}}
                _active={{}}
                fontSize={14}
                fontWeight={600}
                bgColor={"#DB00FF"}
                onClick={() => setProvideConfirmed(true)}
              >
                I understand the risk
              </Button>
            </Center>
          ) : null}
        </Grid>
      )}

      {/** Confirm Button */}
      <Flex flexDir={"column"} rowGap={"12px"}>
        {/** Warning Text */}
        {isInRelay && (
          <WarningText
            label="This request has been already provided."
            iconStyle={{ width: 14, height: 14 }}
            style={{ fontSize: 11, columnGap: "6px" }}
          />
        )}
        {!isApproved && !isBalanceOver && !isInRelay && (
          <Button
            isDisabled={approveBtnDisabled}
            onClick={callApprove}
            width="full"
            height={"48px"}
            borderRadius={"8px"}
            _hover={{}}
            sx={{
              backgroundColor: isRevokeForUSDT
                ? "#17181D"
                : !approveBtnDisabled
                  ? "#007AFF"
                  : "#17181D",
              color: isRevokeForUSDT
                ? "#007AFF"
                : !approveBtnDisabled
                  ? "#FFFFFF"
                  : "#8E8E92",
              border:
                !isLoading && isRevokeForUSDT && !approveBtnDisabled
                  ? "1px solid #007AFF"
                  : "",
            }}
            _disabled={{
              backgroundColor: "#17181D",
              color: "#8E8E92",
            }}
            _active={{}}
          >
            {isLoading ? (
              <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
            ) : (
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                {`${isRevokeForUSDT ? "Revoke" : "Approve"} ${
                  inToken?.tokenSymbol
                }`}
              </Text>
            )}
            {isRevokeForUSDT && !isInRelay && !isLoading && (
              <TooltipForRevoke
                isGrayIcon={approveBtnDisabled ? true : false}
                isBlueIcon={!approveBtnDisabled ? true : false}
                style={{ marginLeft: "2px" }}
              />
            )}
          </Button>
        )}
        <Button
          isDisabled={btnDisabled}
          onClick={isConnected ? requestCrossTrade : () => connectToWallet()}
          sx={{
            backgroundColor: isInRelay
              ? "transparent"
              : !btnDisabled
                ? "#007AFF"
                : "#17181D",
            color: isInRelay ? "#007AFF" : !btnDisabled ? "#FFFFFF" : "#8E8E92",
            border: isInRelay ? "1px solid #007AFF" : "",
          }}
          width="full"
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
          _disabled={{
            backgroundColor: "#17181D",
            color: "#8E8E92",
          }}
        >
          <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
            {buttonName}
          </Text>
        </Button>
      </Flex>
    </Grid>
  );
}
