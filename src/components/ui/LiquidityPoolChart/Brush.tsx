import { Box } from "@chakra-ui/react";
import { LinearGradient, Stop, ClipPath, Rect, G } from "@chakra-ui/react";
import { brushHandleAccentPath, brushHandlePath, OffScreenHandle } from "./svg";
import { BrushBehavior, brushX, D3BrushEvent, ScaleLinear, select } from "d3";
import usePrevious from "hooks/usePrevious";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Handle = path;

const HandleAccent = path;

const LabelGroup = G;

const TooltipBackground = Rect;

const Tooltip = Text;

const FLIP_HANDLE_THRESHOLD_PX = 20;

const BRUSH_EXTENT_MARGIN_PX = 2;

const compare = (
  a: [number, number],
  b: [number, number],
  xScale: ScaleLinear<number, number>
): boolean => {
  const aNorm = a.map((x) => xScale(x).toFixed(1));
  const bNorm = b.map((x) => xScale(x).toFixed(1));
  return aNorm.every((v, i) => v === bNorm[i]);
};

export const Brush = ({
  id,
  xScale,
  interactive,
  brushLabelValue,
  brushExtent,
  setBrushExtent,
  innerWidth,
  innerHeight,
  westHandleColor,
  eastHandleColor,
}: {
  id: string;
  xScale: ScaleLinear<number, number>;
  interactive: boolean;
  brushLabelValue: (d: "w" | "e", x: number) => string;
  brushExtent: [number, number];
  setBrushExtent: (extent: [number, number], mode: string | undefined) => void;
  innerWidth: number;
  innerHeight: number;
  westHandleColor: string;
  eastHandleColor: string;
}) => {
  const brushRef = useRef<SVGGElement | null>(null);
  const brushBehavior = useRef<BrushBehavior<SVGGElement> | null>(null);

  const [localBrushExtent, setLocalBrushExtent] = useState<
    [number, number] | null
  >(brushExtent);
  const [showLabels, { on, off }] = useBoolean(false);
  const [hovering, { on: onHover, off: offHover }] = useBoolean(false);

  const previousBrushExtent = usePrevious(brushExtent);

  const brushed = useCallback(
    (event: D3BrushEvent<unknown>) => {
      const { type, selection, mode } = event;

      if (!selection) {
        setLocalBrushExtent(null);
        return;
      }

      const scaled = (selection as [number, number]).map(xScale.invert) as [
        number,
        number
      ];

      if (type === "end" && !compare(brushExtent, scaled, xScale)) {
        setBrushExtent(scaled, mode);
      }

      setLocalBrushExtent(scaled);
    },
    [xScale, brushExtent, setBrushExtent]
  );

  useEffect(() => {
    setLocalBrushExtent(brushExtent);
  }, [brushExtent]);

  useEffect(() => {
    if (!brushRef.current) return;

    brushBehavior.current = brushX<SVGGElement>()
      .extent([
        [Math.max(0 + BRUSH_EXTENT_MARGIN_PX, xScale(0)), 0],
        [innerWidth - BRUSH_EXTENT_MARGIN_PX, innerHeight],
      ])
      .handleSize(30)
      .filter(() => interactive)
      .on("brush end", brushed);

    brushBehavior.current(select(brushRef.current));

    if (
      previousBrushExtent &&
      compare(brushExtent, previousBrushExtent, xScale)
    ) {
      select(brushRef.current)
        .transition()
        .call(brushBehavior.current.move as any, brushExtent.map(xScale));
    }

    select(brushRef.current)
      .selectAll(".selection")
      .attr("stroke", "none")
      .attr("fill-opacity", "0.1")
      .attr("fill", `url(#${id}-gradient-selection)`);
  }, [
    brushExtent,
    brushed,
    id,
    innerHeight,
    innerWidth,
    interactive,
    previousBrushExtent,
    xScale,
  ]);

  useEffect(() => {
    if (!brushRef.current || !brushBehavior.current) return;

    brushBehavior.current.move(
      select(brushRef.current) as any,
      brushExtent.map(xScale) as any
    );
  }, [brushExtent, xScale]);

  useTimeout(off, 1500, [localBrushExtent]);

  const flipWestHandle =
    localBrushExtent && xScale(localBrushExtent[0]) > FLIP_HANDLE_THRESHOLD_PX;
  const flipEastHandle =
    localBrushExtent &&
    xScale(localBrushExtent[1]) > innerWidth - FLIP_HANDLE_THRESHOLD_PX;

  const showWestArrow =
    localBrushExtent &&
    (xScale(localBrushExtent[0]) < 0 || xScale(localBrushExtent[1]) < 0);
  const showEastArrow =
    localBrushExtent &&
    (xScale(localBrushExtent[0]) > innerWidth ||
      xScale(localBrushExtent[1]) > innerWidth);

  const westHandleInView =
    localBrushExtent &&
    xScale(localBrushExtent[0]) >= 0 &&
    xScale(localBrushExtent[0]) <= innerWidth;
  const eastHandleInView =
    localBrushExtent &&
    xScale(localBrushExtent[1]) >= 0 &&
    xScale(localBrushExtent[1]) <= innerWidth;

  return useMemo(
    () => (
      <>
        <defs>
          <LinearGradient
            id={`${id}-gradient-selection`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="100%"
          >
            <Stop stopColor={westHandleColor} />
            <Stop stopColor={eastHandleColor} offset="1" />
          </LinearGradient>

          <ClipPath id={`${id}-brush-clip`}>
            <Rect x="0" y="0" width={innerWidth} height={innerHeight} />
          </ClipPath>
        </defs>

        <G
          ref={brushRef}
          clipPath={`url(#${id}-brush-clip)`}
          onMouseEnter={onHover}
          onMouseLeave={offHover}
        />

        {localBrushExtent && (
          <>
            {westHandleInView && (
              <G
                transform={`translate(${Math.max(
                  0,
                  xScale(localBrushExtent[0])
                )}, 0), scale(${flipWestHandle ? "-1" : "1"}, 1)`}
              >
                <G>
                  <Handle
                    color={westHandleColor}
                    d={brushHandlePath(innerHeight)}
                  />
                  <HandleAccent d={brushHandleAccentPath()} />
                </G>

                <LabelGroup
                  transform={`translate(50,0), scale(${
                    flipWestHandle ? "1" : "-1"
                  }, 1)`}
                  visible={showLabels || hovering}
                >
                  <TooltipBackground
                    y="0"
                    x="-30"
                    height="30"
                    width="60"
                    rx="8"
                  />
                  <Tooltip
                    transform="scale(-1, 1)"
                    y="15"
                    dominantBaseline="middle"
                  >
                    {brushLabelValue("w", localBrushExtent[0])}
                  </Tooltip>
                </LabelGroup>
              </G>
            )}

            {eastHandleInView && (
              <G
                transform={`translate(${xScale(
                  localBrushExtent[1]
                )}, 0), scale(${flipEastHandle ? "-1" : "1"}, 1)`}
              >
                <G>
                  <Handle
                    color={eastHandleColor}
                    d={brushHandlePath(innerHeight)}
                  />
                  <HandleAccent d={brushHandleAccentPath()} />
                </G>

                <LabelGroup
                  transform={`translate(50,0), scale(${
                    flipEastHandle ? "-1" : "1"
                  }, 1)`}
                  visible={showLabels || hovering}
                >
                  <TooltipBackground
                    y="0"
                    x="-30"
                    height="30"
                    width="60"
                    rx="8"
                  />
                  <Tooltip y="15" dominantBaseline="middle">
                    {brushLabelValue("e", localBrushExtent[1])}
                  </Tooltip>
                </LabelGroup>
              </G>
            )}

            {showWestArrow && <OffScreenHandle color={westHandleColor} />}

            {showEastArrow && (
              <G transform={`translate(${innerWidth}, 0) scale(-1, 1)`}>
                <OffScreenHandle color={eastHandleColor} />
              </G>
            )}
          </>
        )}
      </>
    ),
    [
      brushLabelValue,
      eastHandleColor,
      eastHandleInView,
      flipEastHandle,
      flipWestHandle,
      hovering,
      id,
      innerHeight,
      innerWidth,
      localBrushExtent,
      showEastArrow,
      showLabels,
      showWestArrow,
      westHandleColor,
      westHandleInView,
      xScale,
    ]
  );
};

export default Brush;
