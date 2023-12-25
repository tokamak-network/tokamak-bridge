import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  StackedCarousel,
} from "react-stacked-center-carousel";
import { useRecoilValue } from "recoil";

import TokenCard from "../TokenCard";
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import { TokenInfo } from "@/types/token/supportedToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import "@/css/carousel.css";

const CarouselCard = React.memo((props) => {
  const { onCloseTokenModal, setSelectedToken } = useTokenModal();
  const { data, dataIndex, slideIndex }: any = props;
  const tokenData: TokenInfo & { isNew?: boolean } = data[dataIndex];

  useEffect(() => {
    if (slideIndex === 0) {
      setSelectedToken(tokenData);
    }
  }, [slideIndex]);

  return (
    tokenData && (
      <TokenCard
        w={"148px"}
        h={"184px"}
        tokenInfo={tokenData}
        inNetwork={true}
        hasInput={true}
        isNew={tokenData?.isNew}
        symbolSize={{
          w: 60,
          h: 60,
        }}
        type={"small"}
        onClick={() => {
          try {
          } catch (e) {
          } finally {
            onCloseTokenModal();
          }
        }}
        isDark={slideIndex === 0 ? false : true}
      />
    )
  );
});

export function CardCarouselMobile() {
  const ref: any = React.useRef();
  const { filteredTokenList } = useGetTokenList();
  const { inToken, outToken } = useInOutTokens();
  const { isOpen } = useRecoilValue(tokenModalStatus);
  const [resultTokenArr, setResultTokenArr] =
    useState<TokenInfo[]>(filteredTokenList);

  const move = (input: TokenInfo[], from: number) => {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(0, numberOfDeletedElm, elm);
    return input;
  };

  useEffect(() => {
    if (isOpen && (inToken || outToken)) {
      const isSelectedToken = (el: TokenInfo) =>
        el.tokenName ===
        (isOpen === "INPUT" ? inToken?.tokenName : outToken?.tokenName);
      const resultTokenArr = move(
        filteredTokenList,
        filteredTokenList.findIndex(isSelectedToken)
      );

      const resultTokenList = resultTokenArr.filter((token) =>
        isOpen === "INPUT"
          ? token.tokenName !== outToken?.tokenName
          : token.tokenName !== inToken?.tokenName
      );
      setResultTokenArr(resultTokenList);
    }
  }, []);

  return (
    <ResponsiveContainer
      carouselRef={ref}
      render={(parentWidth, carouselRef) => {
        let currentVisibleSlide = 3;
        return (
          <>
            <StackedCarousel
              ref={carouselRef}
              slideComponent={CarouselCard}
              slideWidth={150}
              carouselWidth={parentWidth}
              data={resultTokenArr}
              currentVisibleSlide={currentVisibleSlide}
              maxVisibleSlide={3}
              customScales={[1, 0.85, 0.4]}
              fadeDistance={0}
              useGrabCursor
              transitionTime={800}
            />
          </>
        );
      }}
    />
  );
}