import { Chart } from "./chart/Chart";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useDensityChartData } from "@/hooks/pool/useDensityChartData";
import { useCallback, useMemo } from "react";
import { Currency, Price, Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { Bound, PoolState } from "@/types/pool/pool";
import { format } from "d3";
import { ZoomLevels } from "@/types/pool/chart";
import { Box } from "@chakra-ui/react";
import "@/css/spinner.css";
import SpinnerImage from "assets/image/spinner.svg";
import UninitializedPoolImage from "assets/image/uninitializedPool.svg";

import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { atMinTick } from "@/recoil/pool/setPoolPosition";
import { LoadingCircleSpinner } from "@/components/ui/CircleSpinner";

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

const UninitializedPool = () => {
  return (
    <Box
      w={"100%"}
      h={"180px"}
      justifyContent={"center"}
      alignItems={"center"}
      pos={"relative"}
    >
      <Image src={UninitializedPoolImage} alt={"UninitializedPoolImage"} />
    </Box>
  );
};

export default function ChartWrapper({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
  disabled,
}: {
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: FeeAmount;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price?: number;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  interactive: boolean;
  disabled: boolean;
}) {
  const { invertPrice } = useV3MintInfo();

  const { isLoading, error, formattedData } = useDensityChartData({
    currencyA: invertPrice ? currencyB : currencyA,
    currencyB: invertPrice ? currencyA : currencyB,
    feeAmount,
  });

  const isSorted = !invertPrice;
  const [, setAtMinTick] = useRecoilState(atMinTick);
  const { notExistPool, poolState } = useV3MintInfo();

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      // simulate user input for auto-formatting and other validations
      if (
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
          mode === "handle" ||
          mode === "reset") &&
        leftRangeValue > 0
      ) {
        if (Number(leftRangeValue.toFixed(6)) > 0) setAtMinTick(false);
        onLeftRangeInput(leftRangeValue.toFixed(6));
      }

      if (
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
          mode === "reset") &&
        rightRangeValue > 0 &&
        poolState === PoolState.EXISTS
      ) {
        // todo: remove this check. Upper bound for large numbers
        // sometimes fails to parse to tick.
        if (rightRangeValue < 1e35) {
          onRightRangeInput(rightRangeValue.toFixed(6));
        }
      }
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit, poolState]
  );

  interactive = interactive && Boolean(formattedData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [
          parseFloat(leftPrice?.toSignificant(6)),
          parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
        return "0";
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
        return "∞";

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100;

      return price
        ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%`
        : "";
    },
    [isSorted, price, ticksAtLimit]
  );

  const isUninitialized =
    !currencyA || !currencyB || (formattedData === undefined && !isLoading);

  if (isUninitialized) return null;
  if (error) return <UninitializedPool />;
  if (isLoading) return <LoadingCircleSpinner />;
  if (!formattedData || formattedData.length === 0 || !price) return null;
  return (
    <Chart
      data={{ series: formattedData, current: price }}
      dimensions={{ width: 384, height: 200 }}
      margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
      styles={{
        area: {
          selection: "rgba(43,254,203,1)",
        },
        brush: {
          handle: {
            west: disabled ? "#8E8E92" : "#2775FF",
            east: disabled ? "#8E8E92" : "#2775FF",
          },
        },
      }}
      interactive={interactive}
      brushLabels={brushLabelValue}
      brushDomain={brushDomain}
      onBrushDomainChange={onBrushDomainChangeEnded}
      zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
      ticksAtLimit={ticksAtLimit}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
}
