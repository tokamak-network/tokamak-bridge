import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "./ui";
import TokenSymbolPair from "../increase/components/TokenSymbolPair";
import RangeToken from "../increase/components/RangeToken";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy, { commafyWithUndefined } from "@/utils/trim/commafy";
import { useRemoveLiquidity } from "@/hooks/pool/useLiquidity";
import { convertFeeToPercent } from "@/utils/pool/convertFeeToPercent";
import { T_PoolModal, poolModalStatus } from "@/recoil/modal/atom";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import usePreview from "@/hooks/modal/usePreviewModal";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";
import { useIncreaseAmount } from "@/hooks/pool/useIncreaseAmount";
import useConnectedNetwork from "@/hooks/network";
import { useConvertWETH } from "@/hooks/pool/useConvertWETH";
import { useRecoilValue } from "recoil";
import { useMemo } from "react";
import { utils } from "ethers";
import CustomTooltip from "@/components/tooltip/CustomTooltip";

const TokenPairTitle = (props: {
  page: T_PoolModal;
  // invertedPair: boolean;
}) => {
  const { page } = props;
  const { info } = usePositionInfo();

  const { token0Symbol, token1Symbol } = useConvertWETH();
  if (!info) return null;

  const isBigFont = page === "increaseLiquidity" || page === "removeLiquidity";

  return (
    <Text fontWeight="bold" fontSize={isBigFont ? "24px" : "23px"}>
      {token1Symbol}{" "}
      <span
        style={{
          fontSize: isBigFont ? 16 : 15,
          verticalAlign: "middle",
        }}
      >
        /
      </span>{" "}
      {token0Symbol}
    </Text>
  );
};

export default function Range(props: {
  page: T_PoolModal;
  estimatedGas: number | undefined | null;
  style?: {};
}) {
  const { page, estimatedGas, style } = props;
  const { info } = usePositionInfo();
  const { amount0Removed, amount1Removed } = useRemoveLiquidity();
  const { poolModal } = usePreview();
  const { token0ParsedAmount, token1ParsedAmount } = useIncreaseAmount();
  const { inToken, outToken } = useInOutTokens();
  const modalStatus = useRecoilValue(poolModalStatus);

  const token0CurrentAmount = useMemo(() => {
    if (info) {
      return page === "addLiquidity" ||
        modalStatus === "increaseLiquidity" ||
        modalStatus === "removeLiquidity"
        ? undefined
        : smallNumberFormmater({
            amount: Number(info.token0Amount.toString()),
            trimed: true,
            trimedDecimals: 13,
          });
    } else return undefined;
  }, [page, modalStatus, info?.token0Amount]);
  const alter0Amount = useMemo(() => {
    if (info)
      return page === "addLiquidity"
        ? (token0ParsedAmount ?? "0.00")
        : modalStatus === "increaseLiquidity"
          ? smallNumberFormmater({
              amount: inToken?.parsedAmount?.toString(),
              decimals: 6,
              trimed: false,
              removeComma: true,
            })
          : modalStatus === "removeLiquidity"
            ? smallNumberFormmater({
                amount: amount0Removed?.toString(),
                decimals: 6,
                minimumValue: 0.000001,
              })
            : undefined;
    return undefined;
  }, [page, modalStatus, token0ParsedAmount, amount0Removed]);
  const token1CurrentAmount = useMemo(() => {
    if (info)
      return page === "addLiquidity" ||
        modalStatus === "increaseLiquidity" ||
        modalStatus === "removeLiquidity"
        ? undefined
        : smallNumberFormmater({
            amount: Number(info.token1Amount.toString()),
            trimed: true,
            trimedDecimals: 13,
          });
    return undefined;
  }, [page, modalStatus, info?.token1Amount]);
  const alter1Amount = useMemo(() => {
    if (info)
      return page === "addLiquidity"
        ? (token1ParsedAmount ?? "0.00")
        : modalStatus === "increaseLiquidity"
          ? smallNumberFormmater({
              amount: outToken?.parsedAmount?.toString(),
              decimals: 6,
              trimed: false,
              removeComma: true,
            })
          : modalStatus === "removeLiquidity"
            ? smallNumberFormmater({
                amount: amount1Removed?.toString(),
                decimals: 6,
                minimumValue: 0.000001,
              })
            : undefined;
    return undefined;
  }, [page, modalStatus, token1ParsedAmount, amount1Removed]);

  const alter0AmountForTooltip = useMemo(() => {
    if (info)
      return page === "addLiquidity" || page === "increaseLiquidity"
        ? inToken?.parsedAmount?.toString()
        : page === "removeLiquidity"
          ? amount0Removed?.toString()
          : undefined;
    return undefined;
  }, [page, modalStatus, token1ParsedAmount, amount1Removed]);

  const alter1AmountForTooltip = useMemo(() => {
    if (info)
      return page === "addLiquidity" || page === "increaseLiquidity"
        ? outToken?.parsedAmount?.toString()
        : page === "removeLiquidity"
          ? amount1Removed?.toString()
          : undefined;
    return undefined;
  }, [page, modalStatus, token1ParsedAmount, amount1Removed]);
  if (!info) return null;
  const { inRange, fee, token0, token1, isClosed } = info;
  return (
    <Flex
      w="364px"
      borderRadius={"12px"}
      border={"3px solid #383736"}
      px="20px"
      py="16px"
      flexDir={"column"}
      {...style}
    >
      <Flex justifyContent={"space-between"} w="100%" h="36px">
        <Flex alignItems={"center"}>
          <TokenPairTitle page={page} />
          <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
            <Text fontSize={"12px"} as="b">
              {convertFeeToPercent(fee)}
            </Text>
          </Flex>
        </Flex>
        <RangeText
          inRange={inRange}
          isClosed={isClosed}
          style={{ fontSize: 14 }}
        />
      </Flex>
      <Flex justifyContent={"center"} w="100%" mb={"16px"}>
        <TokenSymbolPair
          token0={token0}
          token1={token1}
          marginTop="12px"
          networkSymbolSize={24}
          networkSymbolStyle={{
            bottom: "20px",
          }}
        />
      </Flex>
      <RangeToken
        token={token1}
        amount={token1CurrentAmount}
        page={page}
        alterAmount={alter1Amount}
        alterAmountForTooltip={alter1AmountForTooltip}
        style={{ marginBottom: "9px" }}
      />
      <RangeToken
        token={token0}
        amount={token0CurrentAmount}
        page={page}
        alterAmount={alter0Amount}
        alterAmountForTooltip={alter0AmountForTooltip}
      />
      {page === "addLiquidity" || modalStatus === "increaseLiquidity" ? (
        <Flex flexDir={"column"} mt="10px" columnGap={"20px"}>
          <Flex h="1px" borderBottom={"1px solid #2E313A"}></Flex>
          <Flex flexDir={"column"} pt={"8px"} rowGap={"6px"}>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"14px"}>{"Estimated gas fee"}</Text>
              <Text
                fontSize={"16px"}
                fontWeight={500}
                color={estimatedGas ? "#fff" : "#A0A3AD"}
              >
                {estimatedGas ? `$${commafy(estimatedGas, 2)}` : "NA"}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ) : undefined}
      {(page === "collectFee" || poolModal === "removeLiquidity") && (
        <Flex flexDir={"column"} mt="10px" columnGap={"20px"}>
          <Flex h="1px" borderBottom={"1px solid #2E313A"}></Flex>
          <Flex flexDir={"column"} pt={"8px"} rowGap={"6px"}>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"14px"}>Fee</Text>
              <Flex alignItems={"center"}>
                <CustomTooltip
                  content={smallNumberFormmater({
                    amount: info.token0CollectedFee,
                    minimumValue: 0.000001,
                  })}
                  tooltipLabel={info.token0CollectedFee}
                />
                <Text> {info?.token0.symbol}</Text>
                <Text w={"10px"} mx={"2px"}>
                  +
                </Text>
                <CustomTooltip
                  content={smallNumberFormmater({
                    amount: info.token1CollectedFee,
                    minimumValue: 0.000001,
                  })}
                  tooltipLabel={info.token1CollectedFee}
                />
                <Text>{info?.token1.symbol}</Text>
              </Flex>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"14px"}>Estimated gas fee</Text>
              <Text
                fontSize={"16px"}
                fontWeight={500}
                color={estimatedGas ? "#fff" : "#A0A3AD"}
              >
                {estimatedGas ? `$${commafy(estimatedGas, 2)}` : "NA"}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
