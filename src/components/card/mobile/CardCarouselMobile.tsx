import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  StackedCarousel,
} from "react-stacked-center-carousel";
import { useRecoilState, useRecoilValue } from "recoil";

import TokenCard from "../TokenCard";
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import { TokenInfo } from "@/types/token/supportedToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  tokenModalStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import {
  IsSearchToken,
  isInputTokenAmount,
} from "@/recoil/card/selectCard/searchToken";
import useConnectedNetwork from "@/hooks/network";

import "@/css/carousel.css";

const CarouselCard = React.memo((props) => {
  const { setSelectedToken, onCloseTokenModal, isInTokenOpen, isOutTokenOpen } =
    useTokenModal();
  const { data, dataIndex, slideIndex, swipeTo }: any = props;
  
  const tokenData: TokenInfo & { isNew?: boolean } = data[dataIndex];
  // const [isTokenSearch, setIsTokenSearch] = useRecoilState(IsSearchToken);
  const [isInputAmount, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const { chainName } = useConnectedNetwork();
  const [, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  useEffect(() => {
    if (slideIndex === 0 && tokenData && isInputAmount) {
      const inToken = selectedInToken;
      isInTokenOpen && chainName
        ? setSelectedInToken({
            ...tokenData,
            amountBN: inToken?.amountBN || null,
            parsedAmount: inToken?.parsedAmount || null,
            tokenAddress: inToken?.tokenAddress || null,
          })
        : chainName &&
          setSelectedOutToken({
            ...tokenData,
            amountBN: null,
            parsedAmount: null,
            tokenAddress: tokenData.address[chainName],
          });
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
        onMouseDown={(e: any) => {
          e.preventDefault();
          // if (slideIndex === 0 && isTokenSearch) setIsTokenSearch(false);
          // if (
          //   slideIndex === 0 &&
          //   !isTokenSearch &&
          //   selectedInToken?.parsedAmount
          // )
          //   onCloseTokenModal();
        }}
        onClick={(e: any) => {
          if (slideIndex === 0) {
            setIsInputAmount(true);
            const inToken = selectedInToken;
            setSelectedToken(tokenData, true)
            isInTokenOpen && chainName
              ? setSelectedInToken({
                  ...tokenData,
                  amountBN: inToken?.amountBN || null,
                  parsedAmount: inToken?.parsedAmount || null,
                  tokenAddress: inToken?.tokenAddress || null,
                })
              : chainName &&
                setSelectedOutToken({
                  ...tokenData,
                  amountBN: null,
                  parsedAmount: null,
                  tokenAddress: tokenData.address[chainName],
                });
              
            if (
              (selectedInToken?.parsedAmount && isInTokenOpen && isInputAmount) ||
              (isOutTokenOpen && isInputAmount)
            ) {
              onCloseTokenModal();
            }
          } else if (slideIndex === 1) swipeTo(1);
          else if (slideIndex === -1) swipeTo(-1);
          
        }}
        isDark={slideIndex === 0 ? false : true}
      />
    )
  );
});

export function CardCarouselMobile() {
  const ref: any = React.useRef();
  const { filteredTokenList } = useGetTokenList();
  // const { inToken, outToken } = useInOutTokens();
  // const { isOpen } = useRecoilValue(tokenModalStatus);
  // const [resultToken, setResultTokenArr] =
  //   useState<TokenInfo[]>(filteredTokenList);

  // const move = (input: TokenInfo[], from: number) => {
  //   let numberOfDeletedElm = 1;

  //   const elm = input.splice(from, numberOfDeletedElm)[0];

  //   numberOfDeletedElm = 0;

  //   input.splice(0, numberOfDeletedElm, elm);
  //   return input;
  // };

  // useEffect(() => {
  //   if (isOpen) {
  //     const isSelectedToken = (el: TokenInfo) =>
  //       el.tokenName ===
  //       (isOpen === "INPUT" ? inToken?.tokenName : outToken?.tokenName);
  //     const resultTokenArr = move(
  //       filteredTokenList,
  //       filteredTokenList.findIndex(isSelectedToken)
  //     );

  //     const resultTokenList = resultTokenArr.filter((token) =>
  //       isOpen === "INPUT"
  //         ? token?.tokenName !== outToken?.tokenName
  //         : token?.tokenName !== inToken?.tokenName
  //     );
  //     setResultTokenArr(filteredTokenList);
  //   }
  // }, []);

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
              data={filteredTokenList}
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
