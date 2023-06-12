import {
  getTokenCardStyle,
  useCarrousellAnimation,
} from "@/hooks/tokenCard/useCarrousellAnimation";
import { SupportedTokens_T, TokenInfo } from "@/types/token/supportedToken";
import { motion } from "framer-motion";
import TokenCard from "./TokenCard";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useRecoilState } from "recoil";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";

export default function CarousellCardComponent<T>(props: {
  tokenData: TokenInfo & { isNew?: boolean };
  currentIndex: number | null;
  index: number;
  filteredTokenList: SupportedTokens_T;
  waitCondition: any;
  isHover: T;
  setIsHover: Dispatch<SetStateAction<T>>;
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
  const { isInTokenOpen } = useTokenModal();
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const styleCode = useMemo(() => {
    return getTokenCardStyle(index, maxIndex);
  }, [filteredTokenList]);

  return (
    <motion.div
      key={`${index}_${tokenData.tokenName}_${filteredTokenList.length}`}
      className={"motion-div"}
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
      onMouseEnter={() => setIsHover(index)}
      onMouseLeave={() => setIsHover(null)}
      onClick={() =>
        isInTokenOpen
          ? setSelectedInToken({
              ...tokenData,
              amountBN: null,
              parsedAmount: null,
            })
          : setSelectedOutToken({
              ...tokenData,
              amountBN: null,
              parsedAmount: null,
            })
      }
    >
      <TokenCard
        w={"100%"}
        h={"100%"}
        tokenInfo={tokenData}
        inNetwork={true}
        hasInput={false}
        isNew={tokenData.isNew}
        style={{
          transition: "margin .5s ease-in-out",
          //need to change mt property based on selectIndex
          _hover: { marginTop: "-10" },
          filter:
            isHover === index
              ? `drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.25))`
              : undefined,
          opacity: isHover !== null ? (isHover === index ? 0.9 : 0.5) : 0.85,
        }}
      />
    </motion.div>
  );
}
