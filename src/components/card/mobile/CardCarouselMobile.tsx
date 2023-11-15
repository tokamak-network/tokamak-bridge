import { useRouter } from 'next/router';
import React from 'react';
import {
  ResponsiveContainer,
  StackedCarousel,
} from 'react-stacked-center-carousel';

import TokenCard from '../TokenCard';
import { useGetTokenList } from '@/hooks/tokenCard/useGetTokenList';
import { TokenInfo } from '@/types/token/supportedToken';
import useTokenModal from '@/hooks/modal/useTokenModal';

import "@/css/carousel.css";
import { Box } from '@chakra-ui/react';

const CarouselCard = React.memo((props) => {
  const { onCloseTokenModal, setSelectedToken } = useTokenModal();
  const { data, dataIndex } : any = props;
  const tokenData: TokenInfo & { isNew?: boolean } = data[dataIndex];

  console.log("--------------------------", tokenData);

  return (
    tokenData &&
    <TokenCard
      w={"148px"}
      h={"184px"}
      tokenInfo={tokenData}
      inNetwork={true}
      hasInput={false}
      isNew={tokenData?.isNew}
      symbolSize={{
        w: 60,
        h: 60,
      }}
      type={"small"}
      onClick={() => {
        try {
          setSelectedToken(tokenData);
        } catch (e) {
        } finally {
          onCloseTokenModal();
        }
      }}
    />
  );
});

export function CardCarouselMobile() {
  const ref: any = React.useRef();
  const { filteredTokenList } = useGetTokenList();

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

CarouselCard.displayName = 'CarouselCard';
CardCarouselMobile.displayName = 'ResponsiveCarousel';