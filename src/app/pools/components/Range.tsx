import { Flex, Text } from "@chakra-ui/react";
import { RangeText } from "./ui";
import TokenSymbolPair from "../increase/components/TokenSymbolPair";
import RangeToken from "../increase/components/RangeToken";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy, { commafyWithUndefined } from "@/utils/trim/commafy";
import { useRemoveLiquidity } from "@/hooks/pool/useLiquidity";
import { convertFeeToPercent } from "@/utils/pool/convertFeeToPercent";
import { T_PoolModal } from "@/recoil/modal/atom";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import usePreview from "@/hooks/modal/usePreviewModal";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";
import { useIncreaseAmount } from "@/hooks/pool/useIncreaseAmount";
import useConnectedNetwork from "@/hooks/network";
import { useConvertWETH } from "@/hooks/pool/useConvertWETH";

const TokenPairTitle = (props: {
  page: T_PoolModal;
  // invertedPair: boolean;
}) => {
  const { page } = props;
  const { info } = usePositionInfo();

  if (!info) return null;
  const token0 = info.token0;
  const token1 = info.token1;

  const { token0Symbol, token1Symbol } = useConvertWETH();

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
  estimatedGas?: string;
  style?: {};
}) {
  const { page, estimatedGas, style } = props;

  const { info } = usePositionInfo();

  if (!info) return null;

  const { inRange, token0Amount, token1Amount, fee, token0, token1, isClosed } =
    info;
  const { amount0Removed, amount1Removed } = useRemoveLiquidity();
  const { poolModal } = usePreview();
  const { token0ParsedAmount, token1ParsedAmount } = useIncreaseAmount();
  const { inToken, outToken } = useInOutTokens();
  const { layer } = useConnectedNetwork();

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
        amount={page === "addLiquidity" ? undefined : commafy(token1Amount, 6)}
        page={page}
        alterAmount={
          page === "addLiquidity"
            ? token1ParsedAmount ?? "0.00"
            : page === "increaseLiquidity"
            ? smallNumberFormmater(outToken?.parsedAmount, 6, false, true)
            : commafy(amount1Removed, 6)
        }
        style={{ marginBottom: "9px" }}
      />
      <RangeToken
        token={token0}
        amount={page === "addLiquidity" ? undefined : commafy(token0Amount, 6)}
        page={page}
        alterAmount={
          page === "addLiquidity"
            ? token0ParsedAmount ?? "0.00"
            : page === "increaseLiquidity"
            ? smallNumberFormmater(inToken?.parsedAmount, 6, false, true)
            : commafy(amount0Removed, 6)
        }
      />
      {(page === "addLiquidity" ||
        (page === "increaseLiquidity" && estimatedGas)) && (
        <Flex flexDir={"column"} mt="10px" columnGap={"20px"}>
          <Flex h="1px" borderBottom={"1px solid #2E313A"}></Flex>
          <Flex flexDir={"column"} pt={"8px"} rowGap={"6px"}>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"14px"}>
                {layer === "L1"
                  ? "Estimated gas fee "
                  : "Estimated L2 execution fee"}
              </Text>
              <Text fontSize={"16px"} fontWeight={500}>
                {`$${estimatedGas}`}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
      {(page === "collectFee" || poolModal === "removeLiquidity") && (
        <Flex flexDir={"column"} mt="10px" columnGap={"20px"}>
          <Flex h="1px" borderBottom={"1px solid #2E313A"}></Flex>
          <Flex flexDir={"column"} pt={"8px"} rowGap={"6px"}>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"14px"}>Fee</Text>
              <Flex alignItems={"center"}>
                <Text>
                  {smallNumberFormmater(
                    commafy(info?.token0CollectedFee, 8) ?? "-"
                  )}{" "}
                  {info?.token0.symbol}
                </Text>
                <Text w={"10px"} mx={"2px"}>
                  +
                </Text>
                <Text>
                  {smallNumberFormmater(
                    commafy(info?.token1CollectedFee, 8) ?? "-"
                  )}{" "}
                  {info?.token1.symbol}
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"14px"}>Estimated gas fee</Text>
              <Text fontSize={"16px"} fontWeight={500}>
                {`$${estimatedGas}`}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
