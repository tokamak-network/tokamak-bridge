import {
  Box,
  Checkbox,
  Button,
  Text,
  Flex,
  Grid,
  Center,
  Link,
} from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
import { useCallback, useMemo, useState } from "react";
import { trimAddress } from "@/utils/trim";
import { useNetwork } from "wagmi";
import { useRequestData } from "@/staging/hooks/useBridgeHistory";
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

type TradeConfirmationProps = {
  isChecked: boolean;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  txData: CT_History | null;
  isProvide?: boolean;
  subgraphData?: T_FETCH_REQUEST_LIST_L2;
};

export default function CTConfirmCrossTradeFooter(
  props: TradeConfirmationProps
) {
  const {
    isChecked,
    onCheckboxChange,
    onConfirm,
    isProvide,
    txData,
    subgraphData,
  } = props;
  const [provideConfirmed, setProvideConfirmed] = useState<boolean>(false);
  const { chain } = useNetwork();
  const blockExplorer = chain?.blockExplorers?.default.url;
  const btnDisabled = useMemo(() => {
    return isProvide ? !provideConfirmed : !isChecked;
  }, [isProvide, isChecked, provideConfirmed]);
  const { inToken } = useInOutTokens();
  const inTokenIsETH = isETH(inToken);

  const { requestRegisteredToken, provideCT } = useCrossTradeContract();

  const test = useCallback(() => {
    try {
      if (!txData) return new Error("txData is not defined");
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
        console.log(
          "--provideCT params--",
          subgraphData._l1token,
          subgraphData._l2token,
          subgraphData._requester,
          subgraphData._totalAmount,
          subgraphData._ctAmount,
          subgraphData._saleCount,
          subgraphData._l2chainId,
          500000,
          subgraphData._hashValue
        );
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

      console.log(
        "--requestRegisteredToken params--",
        txData.outToken.address,
        txData.inToken.address,
        txData.inToken.amount,
        txData.serviceFee,
        txData.outNetwork
      );
      if (inTokenIsETH) {
        return requestRegisteredToken({
          args: [
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            txData.inToken.amount,
            txData.serviceFee,
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
          txData.serviceFee,
          txData.outNetwork,
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }, [isProvide, inTokenIsETH, txData, requestRegisteredToken]);

  return (
    <Grid rowGap={"12px"} mt={"12px"}>
      {/** Check Box */}
      {!isProvide && (
        <Box mt={"12px"}>
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
              fontWeight={600}
              fontSize={"13px"}
              lineHeight={"20px"}
              letterSpacing={"0.01em"}
            >
              Estimated Time of Arrival:{" "}
              <span style={{ color: isChecked ? "#DB00FF" : "#A0A3AD" }}>
                ~1 day
              </span>
            </Text>
          </Checkbox>
          <Text
            mt={"5px"}
            color={isChecked ? "#FFFFFF" : "#A0A3AD"}
            pl={"25px"}
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"20px"}
            letterSpacing={"0.01em"}
          >
            text will be changed
          </Text>
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
            <Text fontWeight={700}>If you don't check, you can lose money</Text>
            <Text>You've verified that the request actually exists and</Text>
            <Text>
              that the fee (parameters) are correct
              <Link
                ml={"2px"}
                textDecor={"underline"}
                href={`${blockExplorer}/address/${"address"}`}
                isExternal={true}
              >
                {trimAddress({
                  address: "0x1234567890abcdef1234567890abcdef12345678",
                  firstChar: 7,
                  lastChar: 5,
                })}
              </Link>
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
                bgColor={"#DB00FF"}
                onClick={() => setProvideConfirmed(true)}
              >
                Check Request
              </Button>
            </Center>
          ) : null}
        </Grid>
      )}
      {/** Confirm Button */}
      <Box>
        <Button
          isDisabled={btnDisabled}
          onClick={test}
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
            {isProvide ? "Provide Liquidity" : "Cross Trade"}
          </Text>
        </Button>
      </Box>
    </Grid>
  );
}
