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
  selectedInTokenStatus,
  selectedOutTokenStatus,
  tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";
import {
  IsSearchToken,
  isInputTokenAmount,
  isOutputTokenAmount
} from "@/recoil/card/selectCard/searchToken";
import useConnectedNetwork from "@/hooks/network";

import "@/css/carousel.css";
import { isIOS } from "react-device-detect";
import { Box } from "@chakra-ui/react";

const CarouselCard = React.memo((props) => {
  const { setSelectedToken, onCloseTokenModal, isInTokenOpen, isOutTokenOpen } =
    useTokenModal();
  const { data, dataIndex, slideIndex, swipeTo }: any = props;

  const tokenData: TokenInfo & { isNew?: boolean } = data[dataIndex];
  const [isInputAmount, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const [isOutputAmount, setIsOutputAmount] = useRecoilState(isOutputTokenAmount);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const { chainName } = useConnectedNetwork();
  const [, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  useEffect(() => {
    if (slideIndex === 0 && tokenData && isOutputAmount && isOutTokenOpen) {
      setIsOutputAmount(false);
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
            if (isInTokenOpen) {
              setIsInputAmount(true);
            }
            if (isOutTokenOpen) {
              setIsOutputAmount(true);
            }

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
              (isOutTokenOpen && isOutputAmount)
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
  const { inToken, outToken } = useInOutTokens();
  const { isOpen } = useRecoilValue(tokenModalStatus);
  const [resultToken, setResultTokenArr] =
    useState<TokenInfo[]>(filteredTokenList);
  const [isTokenSearch] = useRecoilState(IsSearchToken);

  const move = (input: TokenInfo[], from: number) => {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(0, numberOfDeletedElm, elm);
    return input;
  };

  useEffect(() => {
    if (isOpen) {
      // move TON as the first item of token list
      const defaultTON = (el: TokenInfo) => el.tokenSymbol === "TON";
      move(
        filteredTokenList,
        filteredTokenList.findIndex(defaultTON)
      );

      // set the default token as the one selected previous
      if (inToken || outToken) {
        const isSelectedToken = (el: TokenInfo) =>
          el.tokenName ===
          (isOpen === "INPUT" ? inToken?.tokenName : outToken?.tokenName);
        move(
          filteredTokenList,
          filteredTokenList.findIndex(isSelectedToken)
        );
      }
      setResultTokenArr(filteredTokenList);
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
              data={filteredTokenList}
              currentVisibleSlide={currentVisibleSlide}
              maxVisibleSlide={3}
              customScales={[1, 0.85, 0.4]}
              fadeDistance={0}
              useGrabCursor
              transitionTime={800}
              disableSwipe={filteredTokenList.length === 1 ? true : false}
            />
          </>
        );
      }}
    />
  );
}
