import { ScaleLinear } from "d3";
import React, { useMemo } from "react";
import styled from "styled-components";

const StyledLine = styled.line`
  stroke-width: 2;
  stroke: ${({ theme }) => "#8E8E92"};
  fill: none;
`;

export const Line = ({
  value,
  xScale,
  innerHeight,
}: {
  value: number;
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}) =>
  useMemo(
    () => (
      <StyledLine
        x1={xScale(value)}
        y1="0"
        x2={xScale(value)}
        y2={innerHeight}
      />
    ),
    [value, xScale, innerHeight]
  );
