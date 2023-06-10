import { MotionStyle } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useGetTokenList } from "./useGetTokenList";

type LocationType =
  | "outLeft"
  | "endLeft"
  | "sideLeft"
  | "center"
  | "sideRight"
  | "endRight"
  | "outRight"
  | "wait";

enum CardOverlay {
  Center = 100,
  Side = 80,
  End = 60,
}

const getTrasnformParams = (angle: number, x: number, y: number) => {
  return `rotate(${angle}deg) translate(${x}px, ${y}px)`;
};

const cardSize = {
  end: {
    width: "186px",
    height: "242px",
  },
  side: {
    width: "204px",
    height: "282px",
  },
  center: {
    width: "256px",
    height: "332px",
  },
};

const fadeAwayStyle = {
  transform: getTrasnformParams(10, 600, -315),
  opacity: 0,
};

const endLeftStyle = {
  transform: getTrasnformParams(-10, -250, -320),
  opacity: 1,
  zIndex: CardOverlay.End,
  ...cardSize.end,
};

const sideleftStyle = {
  transform: getTrasnformParams(-5, -150, -330),
  opacity: 1,
  zIndex: CardOverlay.Side,
  ...cardSize.side,
};

const centerStyle = {
  transform: getTrasnformParams(0, 0, -350),
  opacity: 1,
  zIndex: CardOverlay.Center,
  ...cardSize.center,
};

const sideRightStyle = {
  transform: getTrasnformParams(5, 150, -330),
  opacity: 1,
  zIndex: CardOverlay.Side,
  ...cardSize.side,
};

const endRightStyle = {
  transform: getTrasnformParams(10, 250, -320),
  opacity: 1,
  zIndex: CardOverlay.End,
  ...cardSize.end,
};

const positionStyles: { [K in LocationType]: {} } = {
  outLeft: fadeAwayStyle,
  endLeft: endLeftStyle,
  sideLeft: sideleftStyle,
  center: centerStyle,
  sideRight: sideRightStyle,
  endRight: endRightStyle,
  outRight: fadeAwayStyle,
  wait: fadeAwayStyle,
};

export const getLocation = (index: number, maxIndex: number): LocationType => {
  const locations: LocationType[] = [
    "endLeft",
    "sideLeft",
    "center",
    "sideRight",
    "endRight",
    "outRight",
  ];

  return maxIndex === index ? "outLeft" : locations[index] ?? "wait";
};

export const getTokenCardStyle = (index: number, maxIndex: number) => {
  const commonStyle = {
    position: "absolute",
    top: "350px",
  };
  const basicEndStyle = {
    ...commonStyle,
    width: "186px",
    height: "242px",
  };
  const basicSideStyle = {
    ...commonStyle,
    width: "204px",
    height: "282px",
  };

  switch (getLocation(index, maxIndex)) {
    // case "isVisibleAtLeft" || "isVisibleAtLeft":
    //   return { display: "none" };
    case "endLeft":
      return {
        ...basicEndStyle,
        transform: "rotate(-10deg)",
      };
    case "sideLeft":
      return {
        ...basicSideStyle,
        transform: "rotate(-5deg)",
      };
    case "center":
      return {
        ...commonStyle,
        width: "256px",
        height: "332px",
        zIndex: CardOverlay.Center,
      };
    case "sideRight":
      return {
        ...basicSideStyle,
        zIndex: 90,
        transform: "rotate(5deg)",
      };
    case "endRight":
      return {
        ...basicEndStyle,
        zIndex: 80,
        transform: "rotate(10deg)",
      };
    default:
      return {};
  }
};

export function useCarrousellAnimation(params: {
  currentCard: number;
  index: number;
}) {
  const { currentCard, index } = params;

  const endLeftControl = useAnimation();
  const endRightControl = useAnimation();
  const sideLeftControl = useAnimation();
  const sideRightControl = useAnimation();
  const centerControl = useAnimation();
  const outLeftControl = useAnimation();
  const outRightControl = useAnimation();
  const waitControl = useAnimation();

  const [initialized, setInisialized] = useState<boolean>(false);

  useEffect(() => {
    endLeftControl.start(positionStyles.endLeft);
    sideLeftControl.start({
      transform: getTrasnformParams(-5, -150, -330),
      opacity: 1,
      zIndex: CardOverlay.Side,
    });
    centerControl.start({
      transform: getTrasnformParams(0, 0, -350),
      opacity: 1,
      zIndex: CardOverlay.Center,
    });

    sideRightControl.start({
      transform: getTrasnformParams(5, 150, -330),
      opacity: 1,
      zIndex: CardOverlay.Side,
    });

    endRightControl.start({
      transform: getTrasnformParams(10, 250, -320),
      opacity: 1,
      zIndex: CardOverlay.End,
    });
    outLeftControl.start({
      transform: getTrasnformParams(-10, -750, -90),
      opacity: 0,
      width: "186px",
      height: "242px",
    });
    waitControl.start({
      translateY: "0",
      translateX: "0px",
      opacity: 1,
      width: "186px",
      height: "242px",
      zIndex: 0,
    });
    setInisialized(true);
  }, []);

  useEffect(() => {
    // if (currentCard === 0) {
    //   centerControl.start({
    //     rotate: -10,
    //     translateY: "-272px",
    //     translateX: "-265px",
    //     width: "186px",
    //     height: "242px",
    //     opacity: 1,
    //   });
    // }
    // if (currentCard === 1) {
    //   centerControl.start({
    //     rotate: -5,
    //     translateY: "-315px",
    //     translateX: "-151px",
    //     width: "204px",
    //     height: "282px",
    //     zIndex: CardOverlay.Side,
    //     opacity: 1,
    //   });
    //   sideLeftControl.start({
    //     translateY: "-330px",
    //     translateX: "-150px",
    //     opacity: 1,
    //     zIndex: CardOverlay.Side,
    //     width: "204px",
    //     height: "282px",
    //     minWidth: "204px",
    //     maxWidth: "204px",
    //     rotate: -5,
    //   });
    //   sideRightControl.start({
    //     translateY: "-330px",
    //     translateX: "150px",
    //     opacity: 1,
    //     zIndex: CardOverlay.Side,
    //     width: "204px",
    //     height: "282px",
    //   });
    //   sideLeftControl.start({
    //     translateY: "-320px",
    //     translateX: "-250px",
    //     opacity: 1,
    //     zIndex: CardOverlay.End,
    //   });
    //   sideRightControl.start({
    //     translateY: "-320px",
    //     translateX: "250px",
    //     opacity: 1,
    //     zIndex: CardOverlay.End,
    //   });
    //   outLeftControl.start({
    //     rotate: -25,
    //     translateY: "500px",
    //     translateX: "-500px",
    //     opacity: 1,
    //     width: "186px",
    //     height: "242px",
    //   });
    // }
    // if (currentCard === 2) {
    //   centerControl.start({
    //     rotate: 0,
    //     translateY: "-350px",
    //     translateX: "1px",
    //     opacity: 1,
    //     width: "254px",
    //     height: "332px",
    //     zIndex: CardOverlay.Center,
    //   });
    //   sideLeftControl.start({
    //     translateY: "-330px",
    //     translateX: "-150px",
    //     opacity: 1,
    //     zIndex: CardOverlay.Side,
    //     width: "204px",
    //     height: "282px",
    //     minWidth: "204px",
    //     maxWidth: "204px",
    //     rotate: -5,
    //   });
    //   sideRightControl.start({
    //     translateY: "-330px",
    //     translateX: "150px",
    //     opacity: 1,
    //     zIndex: CardOverlay.Side,
    //     width: "204px",
    //     height: "282px",
    //   });
    //   sideLeftControl.start({
    //     translateY: "-320px",
    //     translateX: "-250px",
    //     opacity: 1,
    //     zIndex: CardOverlay.End,
    //   });
    //   sideRightControl.start({
    //     translateY: "-320px",
    //     translateX: "250px",
    //     opacity: 1,
    //     zIndex: CardOverlay.End,
    //   });
    //   outLeftControl.start({
    //     rotate: -25,
    //     translateY: "500px",
    //     translateX: "-500px",
    //     opacity: 1,
    //     width: "186px",
    //     height: "242px",
    //   });
    // }
    if (currentCard === 3) {
      endLeftControl.start(positionStyles.sideLeft);
      sideLeftControl.start(positionStyles.center);
      centerControl.start(positionStyles.sideRight);
      sideRightControl.start(positionStyles.endRight);
      endRightControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.endLeft,
        transform: getTrasnformParams(-10, -460, -90),
        opacity: 1,
      });
    }
    if (currentCard === 2) {
      endLeftControl.start(positionStyles.center);
      sideLeftControl.start(positionStyles.sideRight);
      centerControl.start(positionStyles.endRight);
      sideRightControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.sideLeft,
        transform: getTrasnformParams(-5, -345, -45),
      });
    }
    if (currentCard === 1) {
      endLeftControl.start(positionStyles.sideRight);
      sideLeftControl.start(positionStyles.endRight);
      centerControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.center,
        transform: getTrasnformParams(0, -170, 0),
      });
      //   waitControl.start({
      //     ...positionStyles.sideLeft,
      //     transform: getTrasnformParams(-5, -143, -28),
      //     opacity: 1,
      //   });
    }
    return () => {
      setInisialized(false);
    };
  }, [currentCard]);

  const { filterTokenList } = useGetTokenList();

  useEffect(() => {
    const indexBefore5th = (currentCard + 1 + 5) % filterTokenList.length;
    const startIndex =
      indexBefore5th === 0 ? filterTokenList.length - 1 : indexBefore5th - 1;

    if (index === startIndex) {
      waitControl.start({
        transform: getTrasnformParams(-10, -570, -59),
        opacity: 1,
        zIndex: 100,
      });
    }

    if (index === startIndex + 1) {
      waitControl.start({
        ...positionStyles.endLeft,
        transform: getTrasnformParams(-10, -280, -59),
        opacity: 1,
      });
    }

    if (index === startIndex + 2) {
      waitControl.start({
        ...positionStyles.sideLeft,
        transform: getTrasnformParams(-5, -140, -49),
        opacity: 1,
      });
    }
  }, [currentCard, index, filterTokenList]);

  return {
    endLeftControl,
    endRightControl,
    sideLeftControl,
    sideRightControl,
    centerControl,
    outLeftControl,
    outRightControl,
    waitControl,
  };
}
