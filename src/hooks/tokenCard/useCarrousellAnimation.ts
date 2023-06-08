import { useAnimation } from "framer-motion";

export function useCarrousellAnimation(index: number) {
  const animationControl = useAnimation();

  const atMiddle = index === 0;
  const atSide = index === 2 || index === -2;
  const atSideRight = index === -2;
  const atSecond = index === 1 || index === -1;
  const atSecondRight = index === -1;
  const atOut = index > 2 || index < -2;
}
