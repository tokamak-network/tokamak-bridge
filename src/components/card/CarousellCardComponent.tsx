import { TokenInfo } from "@/types/token/supportedToken";
import { motion } from "framer-motion";
import TokenCard from "./TokenCard";
import { Dispatch, SetStateAction, useMemo } from "react";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useRecoilState } from "recoil";
import { handUiOpenedStatus } from "@/recoil/card/selectCard/handUiOpen";

export default function CarousellCardComponent<T>(props: {
  tokenData: TokenInfo & { isNew?: boolean };
  level: number;
  isHover: number | null;
  index: number;
  length: number;
  tokenColor: string;
  setIsHover: Dispatch<SetStateAction<number | null>>;
}) {
  const { tokenData, level, isHover, setIsHover, index, tokenColor, length } =
    props;

  const layer = Math.abs(level);

  const LEFT = ["0px", "137px", "320px", "530px", "705px"];

  const CARD_SIZE = [
    { width: "254px", height: "332px" },
    { width: "226px", height: "298px" },
    { width: "186px", height: "242px" },
  ];

  const TOP = ["0px", "35px", "90px"];

  const { onCloseTokenModal, setSelectedToken } = useTokenModal();

  const [handUiOpened, setHandUiOpened] = useRecoilState(handUiOpenedStatus);

  const requireCall = useMemo(() => {
    if (handUiOpened) return false;
    setHandUiOpened(true);
    return true;
  }, [handUiOpened]);

  return (
    <motion.div
      style={{
        position: "absolute",
        overflow: "hidden",
        borderRadius: "16px",
        boxSizing: "border-box",
      }}
      initial={{
        opacity: 0,
        left: `${level === 2 ? -217 : 920}`,
        zIndex: 0,
        transform: `${level === 2 ? "rotate(-10deg)" : "rotate(10deg)"}`,
        top: 268,
      }}
      animate={{
        opacity: 0.9,
        left: `${LEFT[index + Math.floor((5 - length) / 2)]}`,
        zIndex: 3 - layer,
        transform: `rotate(${level * -5}deg)`,
        width: `${CARD_SIZE[layer]?.width ?? "200px"}`,
        height: `${CARD_SIZE[layer]?.height ?? "248px"}`,
        top: `${TOP[layer]}`,
      }}
      exit={{
        opacity: 0,
        left: `${level === 2 ? "-217px" : "920px"}`,
        zIndex: 0,
        transform: `${level === 2 ? "rotate(-10deg)" : "rotate(10deg)"}`,
        top: 268,
      }}
      transition={{ duration: 0.5 }}
      whileHover={{
        zIndex: 4,
        boxShadow: `0px 0px 20px 0px ${tokenColor}`,
        marginTop: "-20px",
      }}
      onMouseEnter={() => setIsHover(level)}
      onMouseLeave={() => setIsHover(null)}
    >
      <TokenCard
        tokenInfo={tokenData}
        level={level}
        isHover={isHover}
        requireCall={requireCall}
        inNetwork={true}
        hasInput={false}
        isNew={tokenData.isNew}
        isPrice={false}
        onClick={() => {
          try {
            setSelectedToken(tokenData);
          } catch (e) {
          } finally {
            onCloseTokenModal();
          }
        }}
      />
    </motion.div>
  );
}
