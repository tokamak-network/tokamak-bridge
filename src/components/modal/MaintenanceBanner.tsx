import { Flex, Text } from "@chakra-ui/react";
import { bannerSelector, bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { add, getTime, intervalToDuration, Duration } from "date-fns";

type Banner = "Pending" | "Active" | "Hidden";

const MaintenanceBanner = () => {
  const [status, setStatus] = useState<Banner>("Hidden");
  const [isBannerStatus, setIsBannerStatus] = useRecoilState(bannerStatus);
  const banner = useRecoilValue(bannerSelector).previewTimeStartThisWeek;
  const [duration, setDuration] = useState<Duration>({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
        console.log('banner',banner);
        
      const today = new Date();
      const nowTime = getTime(today);
      const activeTimeStartThisWeek = add(banner, {
        hours: 0,
        minutes: 1,
        seconds: 0,
      });

      const activeTimeEndThisWeek = add(activeTimeStartThisWeek, {
        hours: 0,
        minutes: 7,
        seconds: 0,
      });

      if (nowTime < getTime(banner)) {
        setIsBannerStatus("Hidden");
        setStatus("Hidden");
      } else if (
        nowTime >= getTime(banner) &&
        nowTime < getTime(activeTimeStartThisWeek)
      ) {
        const duration1 = getTime(activeTimeStartThisWeek) - nowTime;
        setDuration(intervalToDuration({ start: 0, end: duration1 }));
        setStatus("Pending");
        setIsBannerStatus("Pending");
      } else if (
        nowTime >= getTime(activeTimeStartThisWeek) &&
        nowTime < getTime(activeTimeEndThisWeek)
      ) {
        const duration2 = getTime(activeTimeEndThisWeek) - nowTime;
        setDuration(intervalToDuration({ start: 0, end: duration2 }));
        setStatus("Active");
        setIsBannerStatus("Active");
      } else {
        setStatus("Hidden");
        setIsBannerStatus("Hidden");
      }
    }, 1000); // 60 seconds in milliseconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [banner]);

  return (
    status !== "Hidden" ? (
      <Flex
        h="45px"
        w="492px"
        bg={status === "Pending" ? "#F9C03E" : "#DD3A44"}
        borderRadius={"5px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        color={status === "Pending" ? "#0F0F12" : "#fff"}
        p="16px"
      >
        <Text fontSize={"14px"}>
          Titan Network scheduled maintenance commencing in:
        </Text>
        <Text fontSize={"18px"}>
          {duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
          {duration.minutes}:
          {duration.seconds !== undefined && duration.seconds < 10 ? "0" : ""}
          {duration.seconds}
        </Text>
      </Flex>
    ):<></>
  );
};

export default MaintenanceBanner;
