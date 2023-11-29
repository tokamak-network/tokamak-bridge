import {
  getTokenCardStyle,
  useCarrousellAnimation,
} from "@/hooks/tokenCard/useCarrousellAnimation";
import { SupportedTokens_T, TokenInfo } from "@/types/token/supportedToken";
import { motion } from "framer-motion";
import TokenCard from "./TokenCard";
import { Dispatch, SetStateAction, useMemo } from "react";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useRecoilState } from "recoil";
import { handUiOpenedStatus } from "@/recoil/card/selectCard/handUiOpen";

const isSecondSideIndex = (
  index: number,
  currentIndex: number | null,
  length: number
) => {
  const markIndex = currentIndex === null ? 2 : currentIndex;
  if (markIndex - 1 < 0) {
    return index === length;
  }
  if (markIndex + 1 > length) {
    return index === 0;
  }
  return markIndex - 1 === index || markIndex + 1 === index;
};

const getSymbolSize = (
  index: number,
  currentIndex: number | null,
  maxIndex: number
) => {
  const markIndex = currentIndex === null ? 2 : currentIndex;

  if (markIndex === index) return 118;
  if (isSecondSideIndex(index, currentIndex, maxIndex)) return 110;
  return 86;
};

export default function CarousellCardComponent<T>(props: {
  tokenData: TokenInfo & { isNew?: boolean };
  currentIndex: number | null;
  index: number;
  filteredTokenList: SupportedTokens_T;
  waitCondition: any;
  isHover: number | null;
  setIsHover: Dispatch<SetStateAction<number | null>>;
}) {
  const {
    tokenData,
    index,
    filteredTokenList,
    currentIndex,
    waitCondition,
    isHover,
    setIsHover,
  } = props;

  const maxIndex = filteredTokenList.length - 1;

  const {
    endLeftControl,
    endRightControl,
    sideLeftControl,
    sideRightControl,
    centerControl,
    outLeftControl,
    outRightControl,
    waitControl,
  } = useCarrousellAnimation({ currentIndex, index });
  const { onCloseTokenModal, setSelectedToken } = useTokenModal();
  const styleCode = useMemo(() => {
    return getTokenCardStyle(index, maxIndex);
  }, [filteredTokenList]);

  const size =
    getSymbolSize(index, currentIndex, maxIndex) === 118
      ? "large"
      : getSymbolSize(index, currentIndex, maxIndex) === 110
      ? "medium"
      : "small";

  const [handUiOpened, setHandUiOpened] = useRecoilState(handUiOpenedStatus);

  const requireCall = useMemo(() => {
    if (handUiOpened) return false;
    setHandUiOpened(true);
    return true;
  }, [handUiOpened]);

  return (
    <motion.div
      key={`${index}_${tokenData.tokenName}_${filteredTokenList.length}`}
      className={`motion-div ${tokenData.tokenName}_${index}`}
      style={styleCode}
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      whileHover={{ zIndex: 200 }}
      animate={
        maxIndex < 6
          ? index === 0
            ? centerControl
            : index === 1
            ? sideLeftControl
            : index === 2
            ? sideRightControl
            : index === 3
            ? endLeftControl
            : endRightControl
          : waitCondition
          ? waitControl
          : index === 0
          ? endLeftControl
          : index === 1
          ? sideLeftControl
          : index === 2
          ? centerControl
          : index === 3
          ? sideRightControl
          : index === 4
          ? endRightControl
          : index === 5
          ? outRightControl
          : index === filteredTokenList.length - 1
          ? outLeftControl
          : waitControl
      }
      onMouseEnter={() =>
        outLeftControl || outRightControl ? null : setIsHover(index)
      }
      onMouseLeave={() => setIsHover(null)}
    >
      <TokenCard
        w={"100%"}
        h={"100%"}
        tokenInfo={tokenData}
        inNetwork={true}
        hasInput={false}
        isNew={tokenData.isNew}
        symbolSize={{
          w: getSymbolSize(index, currentIndex, maxIndex),
          h: getSymbolSize(index, currentIndex, maxIndex),
        }}
        style={{
          transition: maxIndex === 0 ? "none" : "margin .5s ease-in-out",
          //need to change mt property based on selectIndex
          _hover: maxIndex === 0 ? "none" : { marginTop: "-10" },
          filter:
            isHover === index
              ? `drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.25))`
              : undefined,
          opacity: isHover !== null ? (isHover === index ? 0.9 : 0.5) : 0.85,
        }}
        type={size}
        requireCall={requireCall}
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
