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
import { trimAddress } from "@/utils/trim";
import {
  useCrossTradeContract,
  useRequestRegisteredToken,
} from "@/staging/hooks/useCrossTradeContracts";
import { CT_History } from "@/staging/types/transaction";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { isETH } from "@/utils/token/isETH";
import { ZERO_ADDRESS } from "@/constant/misc";
import { T_FETCH_REQUEST_LIST_L2 } from "@/staging/hooks/useCrossTrade";
import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useApprove } from "@/hooks/token/useApproval";
import getBlockExplorerUrl from "@/staging/utils/getBlockExplorerUrl";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getSupportedTokenInfo } from "@/utils/token/getSupportedTokenInfo";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { selectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilState } from "recoil";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useGetMode } from "@/hooks/mode/useGetMode";
type ContractWrite = (args: { args: any[]; value?: BigInt }) => void;
type TradeConfirmationProps = {
  isChecked: boolean;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  txData: CT_History | null;
  isProvide?: boolean;
  subgraphData?: T_FETCH_REQUEST_LIST_L2;
  provideCT: ContractWrite;
  requestRegisteredToken: ContractWrite;
};

export default function CTConfirmCrossTradeFooter(
  props: TradeConfirmationProps
) {
  const {
    isChecked,
    onCheckboxChange,
    isProvide,
    txData,
    subgraphData,
    provideCT,
    requestRegisteredToken,
  } = props;
  const [provideConfirmed, setProvideConfirmed] = useState<boolean>(false);
  const { isConnectedToMainNetwork, chainName } = useConnectedNetwork();
  const blockExplorer = getBlockExplorerUrl(
    isConnectedToMainNetwork
      ? SupportedChainId.TITAN
      : SupportedChainId.TITAN_SEPOLIA
  );
  const inTokenInfo = getSupportedTokenInfo({
    tokenAddress: txData?.inToken.address as string,
    networkName: chainName as string,
    tokenSymbol: txData?.inToken.symbol as string,
  });

  const { isApproved, isLoading, callApprove } = useApprove("Cross Trade");
  const { mode } = useGetMode();
  const { connectedToLayer1 } = useConnectedNetwork();

  const btnDisabled = useMemo(() => {
    return (
      (isProvide ? !provideConfirmed || !connectedToLayer1 : !isChecked) ||
      !isApproved
    );
  }, [isProvide, isChecked, provideConfirmed, isApproved, connectedToLayer1]);

  const { inToken } = useInOutTokens();
  const inTokenIsETH = isETH(inToken);

  const approveBtnDisabled = useMemo(() => {
    return isApproved || isLoading || mode === "Withdraw"
      ? !isChecked
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
          txData.inToken.decimals
        ),
        tokenAddress: txData.outToken.address,
      });
  }, [inTokenInfo]);

  const { setModalOpen } = useTxConfirmModal();
  // const { provideCT, requestRegisteredToken } = useCrossTradeContract();
  const requestCrossTrade = useCallback(() => {
    if (!txData) return new Error("txData is not defined");
    try {
      if (isProvide) {
        if (!subgraphData) return new Error("subgraphData is not defined");
        if (isZeroAddress(subgraphData._l1token)) {
          console.log(
            "--provideCT params--",
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            subgraphData._requester,
            subgraphData._totalAmount,
            subgraphData._ctAmount,
            subgraphData._saleCount,
            subgraphData._l2chainId,
            500000,
            subgraphData._hashValue,
            {
              value: BigInt(subgraphData._ctAmount),
            }
          );
          return provideCT({
            args: [
              ZERO_ADDRESS,
              ZERO_ADDRESS,
              subgraphData._requester,
              subgraphData._totalAmount,
              subgraphData._ctAmount,
              subgraphData._saleCount,
              subgraphData._l2chainId,
              500000,
              subgraphData._hashValue,
            ],
            value: BigInt(subgraphData._ctAmount),
          });
        }
        console.log("--provideCT params--", {
          _l1token: subgraphData._l1token,
          _l2token: subgraphData._l2token,
          _requester: subgraphData._requester,
          _totalAmount: subgraphData._totalAmount,
          _ctAmount: subgraphData._ctAmount,
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
            subgraphData._saleCount,
            subgraphData._l2chainId,
            500000,
            subgraphData._hashValue,
          ],
        });
      }

      const ctAmount =
        BigInt(txData.inToken.amount) - BigInt(txData.serviceFee.toString());
      console.log(
        "--requestRegisteredToken params--",
        txData.outToken.address,
        txData.inToken.address,
        txData.inToken.amount,
        ctAmount,
        txData.outNetwork
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
  }, [isProvide, inTokenIsETH, txData, requestRegisteredToken, provideCT]);

  return (
    <Grid mt={"3px"}>
      {/** Check Box */}
      {!isProvide && (
        <Box>
          <Text
            mt={"5px"}
            color={isChecked ? "#FFFFFF" : "#A0A3AD"}
            fontWeight={600}
            fontSize={13}
            lineHeight={"20px"}
            letterSpacing={"0.01em"}
          >
            I understand
          </Text>
          <Checkbox
            isChecked={isChecked}
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
              color={isChecked ? "#FFFFFF" : "#A0A3AD"}
              fontWeight={400}
              fontSize={12}
              lineHeight={"20px"}
            >
              there is no guaranteed deadline, and
            </Text>
          </Checkbox>
          <Checkbox
            isChecked={isChecked}
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
              color={isChecked ? "#FFFFFF" : "#A0A3AD"}
              fontWeight={400}
              fontSize={12}
              lineHeight={"20px"}
              letterSpacing={"0.01em"}
            >
              the request can be edited from L1
            </Text>
          </Checkbox>
        </Box>
      )}
      {isProvide && (
        <Grid
          textAlign={"center"}
          w={"364px"}
          p={"16px"}
          border={"1px solid #DB00FF"}
          borderRadius={"8px"}
          rowGap={"12px"}
        >
          <Flex flexDir={"column"} fontSize={12} lineHeight={"20px"}>
            <Text>
              <span style={{ fontWeight: 600, color: "#DB00FF" }}>
                Warning:
              </span>
              Tokamak Bridge can't guarantee this
            </Text>
            <Text>request’s validity or compensate for lost funds.</Text>
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
          {!provideConfirmed ? (
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
      <Flex flexDir={"column"} rowGap={"12px"} mt={"12px"}>
        {!isApproved && (
          <Button
            isDisabled={approveBtnDisabled}
            onClick={callApprove}
            sx={{
              backgroundColor: !approveBtnDisabled ? "#007AFF" : "#17181D",
              color: !approveBtnDisabled ? "#FFFFFF" : "#8E8E92",
            }}
            width="full"
            height={"48px"}
            borderRadius={"8px"}
            _hover={{}}
          >
            {isLoading ? (
              <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />
            ) : (
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                {`${"Approve"} ${inToken?.tokenSymbol}`}
              </Text>
            )}
          </Button>
        )}
        <Button
          isDisabled={btnDisabled}
          onClick={requestCrossTrade}
          sx={{
            backgroundColor: !btnDisabled ? "#007AFF" : "#17181D",
            color: !btnDisabled ? "#FFFFFF" : "#8E8E92",
          }}
          width="full"
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
        >
          <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
            {isProvide ? "Provide" : "Request"}
          </Text>
        </Button>
      </Flex>
    </Grid>
  );
}
