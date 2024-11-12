import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useApprove } from "@/hooks/token/useApproval";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useIsTon from "@/hooks/token/useIsTon";
// import { useTransaction } from "@/hooks/tx/useTx";
import Image from "next/image";
import { Button, Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { capitalizeFirstChar } from "@/utils/trim/capitalizeChar";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useTransaction } from "@/hooks/tx/useTx";
import ConfirmedImage from "assets/icons/confirm/success.svg";
import commafy from "@/utils/trim/commafy";
import { ethers } from "ethers";
import { useMemo } from "react";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import BlueQuestionIcon from "@/assets/icons/ct/tip_ct_blue.svg";
import GreyQuestionIcon from "@/assets/icons/ct/tip_ct_grey.svg";
import { Tooltip } from "@/staging/components/common/Tooltip";
interface ApproveButtonProps {
  isConfirmed: boolean;
}

export default function ApproveButton(props: ApproveButtonProps) {
  const { isConfirmed } = props;
  const { inToken } = useInOutTokens();
  const { isApproved, callApprove, isLoading, isRevokeForUSDT } = useApprove();
  const { isNotSupportForBridge } = useBridgeSupport();
  const { isTONatPair } = useIsTon();
  const { mode } = useGetMode();
  const { isConnected } = useAccount();
  const { isBalanceOver, isInputZero } = useInputBalanceCheck();
  const { confirmedApproveTransaction, confirmedRevokeTransaction } =
    useTransaction();
  const [, setIsDrawerOpen] = useRecoilState(accountDrawerStatus);
  if (
    (isApproved ||
      isNotSupportForBridge ||
      !inToken ||
      (mode == "Swap" && isTONatPair) ||
      !isConnected ||
      isBalanceOver ||
      isInputZero) &&
    (confirmedApproveTransaction === undefined ||
      confirmedApproveTransaction?.tokenData?.[0]?.tokenAddress.toLowerCase() !==
        inToken?.tokenAddress.toLowerCase() ||
      isInputZero)
  ) {
    return null;
  }
  const afterApproved = isApproved && confirmedApproveTransaction;
  const beforeApproved = !isLoading && !afterApproved;
  if (afterApproved) return null;
  return (
    <Box>
      {isRevokeForUSDT && !confirmedRevokeTransaction ? (
        <Button
          isDisabled={!isConfirmed || isLoading}
          sx={{
            backgroundColor: "#17181D",
            color: isConfirmed ? "#007AFF" : "#8E8E92",
            border: "1px solid",
            borderColor: isConfirmed && !isLoading ? "#007AFF" : "#17181D",
          }}
          width="full"
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
          onClick={() => {
            callApprove();
            setIsDrawerOpen(false);
          }}
          opacity={"1 !important"}
          cursor={"pointer !important"}
        >
          {isLoading ? (
            <Spinner
              w={"20px"}
              h={"20px"}
              maxW={"20px"}
              maxH={"20px"}
              color={"#007AFF"}
            />
          ) : (
            <Flex gap={"2px"} alignItems={"center"}>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                {`Revoke USDT`}
              </Text>
              <CustomTooltip
                content={
                  <Image
                    src={isConfirmed ? BlueQuestionIcon : GreyQuestionIcon}
                    alt={"QuestionIcon"}
                  ></Image>
                }
                tooltipLabel={
                  <Flex
                    w={"240px"}
                    h={"45px"}
                    fontSize={11}
                    textAlign={"center"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {
                      <span>
                        Approval for USDT must be revoked first <br />
                        before a new amount is approved.
                      </span>
                    }
                  </Flex>
                }
                style={{ px: "-5px", tooltipLineHeight: "15x", height: "45px" }}
              ></CustomTooltip>
            </Flex>
          )}
        </Button>
      ) : (
        <Button
          isDisabled={!isConfirmed || isLoading || isRevokeForUSDT}
          sx={{
            color: isConfirmed ? "#FFFFFF" : "#8E8E92",
          }}
          width="full"
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
          onClick={() => {
            callApprove();
            setIsDrawerOpen(false);
          }}
          bgColor={
            !isConfirmed || isLoading || isRevokeForUSDT
              ? "#17181D !important"
              : "#007AFF !important"
          }
          opacity={"1 !important"}
          cursor={"pointer !important"}
        >
          {isLoading ? (
            <Spinner
              w={"20px"}
              h={"20px"}
              maxW={"20px"}
              maxH={"20px"}
              color={"#007AFF"}
            />
          ) : (
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
              {`Approve ${inToken?.tokenSymbol}`}
            </Text>
          )}
        </Button>
      )}
    </Box>
  );
}
