import {
  ScaleLinear,
  select,
  zoom,
  ZoomBehavior,
  zoomIdentity,
  ZoomTransform,
} from "d3";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { RefreshCcw, ZoomIn, ZoomOut } from "react-feather";
import styled from "styled-components";
import { ZoomLevels } from "types/pool/chart";
import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import REFRESH_ICON from "assets/icons/pool/refreshIcon.svg";
import Title from "../Title";
import { useRangeHopCallbacks } from "@/hooks/pool/useV3Hooks";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useRecoilState } from "recoil";
import {
  atMaxTick,
  atMinTick,
  chartIsOnLoading,
} from "@/recoil/pool/setPoolPosition";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

const Wrapper = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ count }) => count.toString()}, 1fr);
  grid-gap: 8px;
  right: 0;
`;

export const ZoomOverlay = styled.rect`
  fill: transparent;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export default function Zoom({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
  isLoading,
}: {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: ZoomLevels;
  isLoading: boolean;
}) {
  const { getSetFullRange } = useRangeHopCallbacks();
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();
  const { invertPrice, pool, notExistPool } = useV3MintInfo();
  const { inTokenInfo, outTokenInfo } = useInOutTokens();

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
    () => [
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 2),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .call(
            zoomBehavior.current.transform,
            zoomIdentity.translate(0, 0).scale(1)
          )
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
    ],
    [svg]
  );

  useEffect(() => {
    if (!svg) return;

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", ({ transform }: { transform: ZoomTransform }) =>
        setZoom(transform)
      );

    select(svg as Element).call(zoomBehavior.current);
  }, [
    height,
    width,
    setZoom,
    svg,
    xScale,
    zoomBehavior,
    zoomLevels,
    zoomLevels.max,
    zoomLevels.min,
  ]);

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    zoomInitial();
  }, [zoomInitial, zoomLevels]);

  //disable to trigger before it's initialized
  //invert price changes twice, it makes a flicker with this hook
  // useEffect(() => {
  //   setTimeout(() => {
  //     initializeTicks();
  //   }, 50);
  // }, [invertPrice]);

  const [, setAtMinTick] = useRecoilState(atMinTick);
  const [, setAtMaxTick] = useRecoilState(atMaxTick);

  const initializeTicks = () => {
    setAtMinTick(false);
    setAtMaxTick(false);
    resetBrush();
    // zoomInitial();
  };

  useEffect(() => {
    if (!isLoading) {
      initializeTicks();
      // setIsLoading(true);
      setTimeout(() => {
        initializeTicks();
      }, 100);
    }
  }, [isLoading, pool?.token0.address, pool?.token1.address, invertPrice]);

  return (
    <Flex justifyContent={"space-between"} alignItems={"flex-start"}>
      <Title title="Set Price Range" />
      <Flex justifyContent={"flex-end"} columnGap={"8px"}>
        <Center
          w={"32px"}
          h={"32px"}
          bgColor={"transparent"}
          border={"1px solid #313442"}
          borderRadius={"8px"}
          onClick={() => {
            initializeTicks();
          }}
          cursor={"pointer"}
        >
          <Image src={REFRESH_ICON} alt={"REFRESH_ICON"} />
        </Center>
        <Center
          w={"80px"}
          h={"32px"}
          bgColor={"transparent"}
          border={"1px solid #313442"}
          borderRadius={"8px"}
          fontSize={12}
          cursor={"pointer"}
          onClick={getSetFullRange}
        >
          <Text>Full Range</Text>
        </Center>
        {/* <Button
          w={"40px"}
          h={"40px"}
          bgColor={"transparent"}
          border={"1px solid #313442"}
          onClick={zoomIn}
          _hover={{}}
          _active={{}}
        >
          <ZoomIn width={16} height={16} />
        </Button>
        <Button
          w={"40px"}
          h={"40px"}
          bgColor={"transparent"}
          border={"1px solid #313442"}
          onClick={zoomOut}
          _hover={{}}
          _active={{}}
        >
          <ZoomOut size={16} />
        </Button> */}
      </Flex>
    </Flex>
  );
}
