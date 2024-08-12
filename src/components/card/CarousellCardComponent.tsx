import { TokenInfo } from "@/types/token/supportedToken";
import { motion } from "framer-motion";
import TokenCard from "./TokenCard";
import { Dispatch, SetStateAction, useMemo } from "react";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useRecoilState } from "recoil";
import { handUiOpenedStatus } from "@/recoil/card/selectCard/handUiOpen";
import { CARD_SIZE, TOP, TRANSLATE } from "@/constant/carousel";

export default function CarousellCardComponent<T>(props: {
  tokenData: TokenInfo & { isNew?: boolean };
  level: number;
  isHover: number | null;
  index: number;
  length: number;
  tokenColor: string;
  requireCall: boolean;
  firstOpenModal: boolean;
  setIsHover: Dispatch<SetStateAction<number | null>>;
}) {
  const {
    tokenData,
    level,
    isHover,
    setIsHover,
    index,
    tokenColor,
    length,
    requireCall,
    firstOpenModal,
  } = props;

  const layer = Math.abs(level);

  const { onCloseTokenModal, setSelectedToken } = useTokenModal();

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
        zIndex: 0,
        transform: `${
          firstOpenModal
            ? `rotate(0deg) translate(0, 0)`
            : level === 2
            ? "rotate(-10deg) translate(-790px, 200px)"
            : "rotate(10deg) translate(790px, 200px)"
        }`,
        top: 268,
      }}
      animate={{
        opacity: 1,
        zIndex: 3 - layer,
        transform: `rotate(${level * -5}deg) translate(${
          TRANSLATE[index + Math.floor((5 - length) / 2)]
        })`,
        width: `${CARD_SIZE[layer]?.width ?? "200px"}`,
        height: `${CARD_SIZE[layer]?.height ?? "248px"}`,
        top: `${TOP[layer]}`,
      }}
      exit={{
        opacity: 0,
        zIndex: 0,
        transform: `${
          level === 2
            ? "rotate(-10deg) translate(-790px, 200px)"
            : "rotate(10deg) translate(790px, 200px)"
        }`,
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
