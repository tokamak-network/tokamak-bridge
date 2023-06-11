import { MotionStyle } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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
  currentIndex: number | null;
  index: number;
}) {
  const { currentIndex, index } = params;

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
    if (initialized) return;

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
      transform: getTrasnformParams(-10, -650, -59),
      opacity: 0,
      width: "186px",
      height: "242px",
      position: "absolute",
    });
    waitControl.start({
      transform: getTrasnformParams(0, 0, 0),
      opacity: 0,
      position: "absolute",
      width: "186px",
      height: "242px",
    });
    setInisialized(true);
  }, []);

  useEffect(() => {
    // if (currentIndex === 0) {
    //   centerControl.start({
    //     rotate: -10,
    //     translateY: "-272px",
    //     translateX: "-265px",
    //     width: "186px",
    //     height: "242px",
    //     opacity: 1,
    //   });
    // }`
    // if (currentIndex === 1) {
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
    // if (currentIndex === 2) {
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
    if (currentIndex === 1) {
      endLeftControl.start(positionStyles.sideLeft);
      sideLeftControl.start(positionStyles.center);
      centerControl.start(positionStyles.sideRight);
      sideRightControl.start(positionStyles.endRight);
      endRightControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.endLeft,
        position: "absolute",
        transform: getTrasnformParams(-10, -295, -62),
        opacity: 1,
      });
    }
    if (currentIndex === 0) {
      endLeftControl.start(positionStyles.center);
      sideLeftControl.start(positionStyles.sideRight);
      centerControl.start(positionStyles.endRight);
      sideRightControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.sideLeft,
        position: "absolute",
        transform: getTrasnformParams(-5, -178, -30),
      });
    }

    if (currentIndex === 7) {
      endLeftControl.start(positionStyles.sideRight);
      sideLeftControl.start(positionStyles.endRight);
      centerControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.center,
        transform: getTrasnformParams(0, -170, 0),
      });
    }

    if (currentIndex === 6) {
      endLeftControl.start(positionStyles.endRight);
      sideLeftControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.sideRight,
        transform: getTrasnformParams(5, 178, -30),
      });
    }

    if (currentIndex === 5) {
      endLeftControl.start(positionStyles.outRight);

      outLeftControl.start({
        ...positionStyles.endRight,
        transform: getTrasnformParams(10, 295, -62),
      });
    }

    // return () => {
    //   setInisialized(false);
    // };
  }, [currentIndex]);

  const { filterTokenList } = useGetTokenList();

  const startIndex = useMemo(() => {
    if (currentIndex !== null) {
      const startIndex =
        currentIndex - 4 < 0
          ? currentIndex - 4 + filterTokenList.length
          : currentIndex - 4;
      return startIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === null || startIndex === null) return;

    //locate at center to wait to move
    if (index === startIndex) {
      waitControl.start({
        ...positionStyles.endLeft,
        transform:
          index < 5
            ? getTrasnformParams(0, 0, -260)
            : getTrasnformParams(0, 0, 0),
        bottom: 0,
        opacity: 0,
        position: "absolute",
      });
    }

    //locate at outLeft
    if (
      startIndex === filterTokenList.length - 1
        ? startIndex - 7 === index
        : index === startIndex + 1
    ) {
      waitControl.start({
        ...positionStyles.endLeft,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(-10, -605, -315)
            : getTrasnformParams(-10, -650, -59),
        opacity: 0,
      });
    }

    //locate at endLeft
    if (
      startIndex === filterTokenList.length - 1
        ? startIndex - 6 === index
        : index === startIndex + 2
    ) {
      waitControl.start({
        ...positionStyles.endLeft,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(-10, -235, -315)
            : getTrasnformParams(-10, -280, -59),
        opacity: 1,
      });
    }

    //locate at sideLeft
    if (
      startIndex === filterTokenList.length - 1
        ? startIndex - 5 === index
        : index === startIndex + 3
    ) {
      waitControl.start({
        ...positionStyles.sideLeft,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(-5, -148, -332)
            : getTrasnformParams(-5, -175, -34),
        opacity: 1,
      });
    }

    //locate at center
    if (
      startIndex === filterTokenList.length - 1
        ? startIndex - 4 === index
        : index === startIndex + 4
    ) {
      waitControl.start({
        ...positionStyles.center,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(0, 0, -350)
            : getTrasnformParams(0, 0, 0),
        opacity: 1,
      });
    }

    //locate at sideRight
    if (
      startIndex === filterTokenList.length - 1
        ? startIndex - 3 === index
        : index === startIndex + 5
    ) {
      waitControl.start({
        ...positionStyles.sideRight,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(5, 147, -329)
            : getTrasnformParams(5, 173, -30),
        opacity: 1,
      });
    }

    //locate at endRight
    if (
      startIndex === filterTokenList.length - 1
        ? index === startIndex - 2
        : index === startIndex + 6
    ) {
      waitControl.start({
        ...positionStyles.endRight,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(10, 235, -315)
            : getTrasnformParams(10, 280, -59),
        opacity: 1,
      });
    }

    //locate at outRight
    if (
      startIndex === filterTokenList.length - 1
        ? index === startIndex - 1
        : index === startIndex + 7
    ) {
      waitControl.start({
        ...positionStyles.outRight,
        position: "absolute",
        transform:
          index < 5
            ? getTrasnformParams(10, 235, -115)
            : getTrasnformParams(10, 650, -63),
        opacity: 0,
      });
    }
  }, [currentIndex, filterTokenList, index]);

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
