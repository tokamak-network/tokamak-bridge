import {
  ScaleLinear,
  select,
  zoom,
  ZoomBehavior,
  zoomIdentity,
  ZoomTransform,
} from "d3";
import React, { useEffect, useMemo, useRef } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { RefreshCcw, ZoomIn, ZoomOut } from "react-feather";

interface ZoomProps {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: { min: number; max: number };
}

export const ZoomOverlay = () => (
  <Box
    as="rect"
    fill="transparent"
    cursor="grab"
    _active={{ cursor: "grabbing" }}
  />
);

const Zoom: React.FC<ZoomProps> = ({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
}) => {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();

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

  return (
    <Flex justifyContent="flex-end" position="absolute" top={-75} right={0}>
      {showResetButton && (
        <Button
          variant="ghost"
          onClick={() => {
            resetBrush();
            zoomReset();
          }}
          disabled={false}
          p={1}
          w={8}
          h={8}
          _hover={{
            bgColor: "backgroundInteractive",
            color: "textPrimary",
          }}
        >
          <RefreshCcw size={16} />
        </Button>
      )}
      <Button
        variant="ghost"
        onClick={zoomIn}
        disabled={false}
        p={1}
        w={8}
        h={8}
      >
        <ZoomIn size={16} />
      </Button>
      <Button
        variant="ghost"
        onClick={zoomOut}
        disabled={false}
        p={1}
        w={8}
        h={8}
      >
        <ZoomOut size={16} />
      </Button>
    </Flex>
  );
};

export default Zoom;
