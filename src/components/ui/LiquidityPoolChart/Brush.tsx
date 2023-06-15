// import { Box, chakra, useBoolean } from "@chakra-ui/react";
// import usePrevious from "./hooks";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { brushHandleAccentPath, brushHandlePath, OffScreenHandle } from "./svg";
// import { brushX, BrushBehavior, D3BrushEvent, ScaleLinear, select } from "d3";

// const Handle = chakra("path");

// const HandleAccent = chakra("path");

// const LabelGroup = chakra(Box);

// const TooltipBackground = chakra(Box);

// const FLIP_HANDLE_THRESHOLD_PX = 20;

// const BRUSH_EXTENT_MARGIN_PX = 2;

// const compare = (
//   a: [number, number],
//   b: [number, number],
//   xScale: ScaleLinear<number, number>
// ): boolean => {
//   const aNorm = a.map((x) => xScale(x).toFixed(1));
//   const bNorm = b.map((x) => xScale(x).toFixed(1));
//   return aNorm.every((v, i) => v === bNorm[i]);
// };

// type BrushProps = {
//   id: string;
//   xScale: ScaleLinear<number, number>;
//   interactive: boolean;
//   brushLabelValue: (d: "w" | "e", x: number) => string;
//   brushExtent: [number, number];
//   setBrushExtent: (extent: [number, number], mode: string | undefined) => void;
//   innerWidth: number;
//   innerHeight: number;
//   westHandleColor: string;
//   eastHandleColor: string;
// };

// const Brush: React.FC<BrushProps> = ({
//   id,
//   xScale,
//   interactive,
//   brushLabelValue,
//   brushExtent,
//   setBrushExtent,
//   innerWidth,
//   innerHeight,
//   westHandleColor,
//   eastHandleColor,
// }) => {
//   const brushRef = useRef<SVGGElement | null>(null);
//   const brushBehavior = useRef<BrushBehavior<SVGGElement> | null>(null);
//   const [localBrushExtent, setLocalBrushExtent] = useState<
//     [number, number] | null
//   >(brushExtent);
//   const [showLabels, setShowLabels] = useState(false);
//   const [hovering, setHovering] = useState(false);

//   const previousBrushExtent = usePrevious(brushExtent);

//   const brushed = useCallback(
//     (event: D3BrushEvent<unknown>) => {
//       const { type, selection, mode } = event;

//       if (!selection) {
//         setLocalBrushExtent(null);
//         return;
//       }

//       const scaled = (selection as [number, number]).map(xScale.invert) as [
//         number,
//         number
//       ];

//       if (type === "end" && !compare(brushExtent, scaled, xScale)) {
//         setBrushExtent(scaled, mode);
//       }

//       setLocalBrushExtent(scaled);
//     },
//     [xScale, brushExtent, setBrushExtent]
//   );

//   useEffect(() => {
//     setLocalBrushExtent(brushExtent);
//   }, [brushExtent]);

//   useEffect(() => {
//     if (!brushRef.current) return;

//     brushBehavior.current = brushX<SVGGElement>()
//       .extent([
//         [Math.max(0 + BRUSH_EXTENT_MARGIN_PX, xScale(0)), 0],
//         [innerWidth - BRUSH_EXTENT_MARGIN_PX, innerHeight],
//       ])
//       .handleSize(30)
//       .filter(() => interactive)
//       .on("brush", brushed);

//     select(brushRef.current).call(brushBehavior.current);
//   }, [brushed, xScale, innerWidth, innerHeight, interactive]);

//   useEffect(() => {
//     if (
//       previousBrushExtent &&
//       !compare(previousBrushExtent, brushExtent, xScale)
//     ) {
//       setLocalBrushExtent(brushExtent);
//     }
//   }, [brushExtent, previousBrushExtent, xScale]);

//   return (
//     <g
//       className="brush"
//       ref={brushRef}
//       pointerEvents={interactive ? "auto" : "none"}
//     >
//       <linearGradient id={`brushGradient-${id}`} gradientTransform="rotate(90)">
//         <stop offset="0%" stopColor={westHandleColor} />
//         <stop offset="100%" stopColor={eastHandleColor} />
//       </linearGradient>

//       {localBrushExtent && (
//         <rect
//           x={xScale(localBrushExtent[0])}
//           y={0}
//           width={xScale(localBrushExtent[1]) - xScale(localBrushExtent[0])}
//           height={innerHeight}
//           fill={`url(#brushGradient-${id})`}
//         />
//       )}

//       <Handle
//         as="path"
//         d={brushHandlePath(innerHeight)}
//         fill={westHandleColor}
//         transform={`translate(${xScale(brushExtent[0]) - 8}, ${
//           innerHeight / 2
//         })`}
//       />

//       <HandleAccent
//         as="path"
//         d={brushHandlePath(innerHeight)}
//         fill={westHandleColor}
//         transform={`translate(${xScale(brushExtent[0]) - 8}, ${
//           innerHeight / 2
//         })`}
//         opacity={hovering ? 1 : 0}
//       />

//       <Handle
//         as="path"
//         d={brushHandlePath(innerHeight)}
//         fill={eastHandleColor}
//         transform={`translate(${xScale(brushExtent[1]) - 8}, ${
//           innerHeight / 2
//         })`}
//       />

//       <HandleAccent
//         as="path"
//         d={brushHandlePath(innerHeight)}
//         fill={eastHandleColor}
//         transform={`translate(${xScale(brushExtent[1]) - 8}, ${
//           innerHeight / 2
//         })`}
//         opacity={hovering ? 1 : 0}
//       />

//       {showLabels && localBrushExtent && (
//         <LabelGroup
//           d="flex"
//           flexDirection="column"
//           alignItems="center"
//           justifyContent="center"
//           position="absolute"
//           left={`${xScale(localBrushExtent[0]) - 50}px`}
//           top={`${innerHeight / 2}px`}
//         >
//           <TooltipBackground
//             d="flex"
//             alignItems="center"
//             justifyContent="center"
//             bg="gray.700"
//             color="white"
//             py={1}
//             px={2}
//             borderRadius="md"
//           >
//             {brushLabelValue("w", localBrushExtent[0])}
//           </TooltipBackground>
//         </LabelGroup>
//       )}

//       {showLabels && localBrushExtent && (
//         <LabelGroup
//           d="flex"
//           flexDirection="column"
//           alignItems="center"
//           justifyContent="center"
//           position="absolute"
//           left={`${xScale(localBrushExtent[1]) - 50}px`}
//           top={`${innerHeight / 2}px`}
//         >
//           <TooltipBackground
//             d="flex"
//             alignItems="center"
//             justifyContent="center"
//             bg="gray.700"
//             color="white"
//             py={1}
//             px={2}
//             borderRadius="md"
//           >
//             {brushLabelValue("e", localBrushExtent[1])}
//           </TooltipBackground>
//         </LabelGroup>
//       )}

//       {localBrushExtent && (
//         <rect
//           x={xScale(localBrushExtent[0])}
//           y={0}
//           width={xScale(localBrushExtent[1]) - xScale(localBrushExtent[0])}
//           height={innerHeight}
//           fill="transparent"
//           onMouseEnter={() => {
//             if (!showLabels) setShowLabels(true);
//             setHovering(true);
//           }}
//           onMouseLeave={() => setHovering(false)}
//         />
//       )}

//       {showLabels && (
//         <rect
//           x={xScale(brushExtent[0]) - FLIP_HANDLE_THRESHOLD_PX}
//           y={0}
//           width={FLIP_HANDLE_THRESHOLD_PX}
//           height={innerHeight}
//           fill="transparent"
//           onMouseEnter={() => setHovering(true)}
//           onMouseLeave={() => setHovering(false)}
//           onMouseDown={() => {
//             if (brushBehavior.current) {
//               brushBehavior.current.move(brushRef.current, [
//                 brushExtent[1],
//                 brushExtent[1],
//               ]);
//             }
//           }}
//         />
//       )}

//       {showLabels && (
//         <rect
//           x={xScale(brushExtent[1])}
//           y={0}
//           width={FLIP_HANDLE_THRESHOLD_PX}
//           height={innerHeight}
//           fill="transparent"
//           onMouseEnter={() => setHovering(true)}
//           onMouseLeave={() => setHovering(false)}
//           onMouseDown={() => {
//             if (brushBehavior.current) {
//               brushBehavior.current.move(brushRef.current, [
//                 brushExtent[0],
//                 brushExtent[0],
//               ]);
//             }
//           }}
//         />
//       )}
//     </g>
//   );
// };

// export default Brush;
