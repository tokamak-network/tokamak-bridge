import { ScaleLinear } from "d3";
import React, { useMemo } from "react";
import { Box } from "@chakra-ui/react";

interface LineProps {
  value: number;
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

const Line: React.FC<LineProps> = ({ value, xScale, innerHeight }) => {
  const StyledLine = useMemo(
    () => (
      <Box
        as="line"
        opacity={0.5}
        strokeWidth={2}
        stroke="textPrimary"
        fill="none"
        x1={xScale(value)}
        y1={0}
        x2={xScale(value)}
        y2={innerHeight}
      />
    ),
    [value, xScale, innerHeight]
  );

  return StyledLine;
};

export default Line;
