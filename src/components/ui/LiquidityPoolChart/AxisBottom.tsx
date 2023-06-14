import { Box } from "@chakra-ui/react";
import {
  Axis as d3Axis,
  axisBottom,
  NumberValue,
  ScaleLinear,
  select,
} from "d3";
import React, { useMemo, useRef, useEffect } from "react";

const Axis = ({ axisGenerator }: { axisGenerator: d3Axis<NumberValue> }) => {
  const axisRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (axisRef.current) {
      select(axisRef.current)
        .call(axisGenerator)
        .call((g) => g.select(".domain").remove());
    }
  }, [axisGenerator]);

  return <g ref={axisRef} />;
};

export const AxisBottom = ({
  xScale,
  innerHeight,
  offset = 0,
}: {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  offset?: number;
}) =>
  useMemo(
    () => (
      <Box transform={`translate(0, ${innerHeight + offset})`}>
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </Box>
    ),
    [innerHeight, offset, xScale]
  );
