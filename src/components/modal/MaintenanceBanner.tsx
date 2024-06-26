import { Flex, Text } from "@chakra-ui/react";
import { bannerSelector, bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect, useMemo } from "react";
import { add, getTime, intervalToDuration, Duration } from "date-fns";
import { useInOutNetwork } from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "@/hooks/network";

type Banner = "Pending" | "Active" | "Hidden";

const MaintenanceBanner = () => {
  const [isBannerStatus, setIsBannerStatus] = useRecoilState(bannerStatus);
  const banner = useRecoilValue(bannerSelector).previewTimeStartThisWeek;
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const [duration, setDuration] = useState<Duration>({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });

  const isTestnet = !isConnectedToMainNetwork;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date();
      const nowTime = getTime(today);
      const activeTimeStartThisWeek = add(banner, {
        hours: 24,
        minutes: 0,
        seconds: 0,
      }); //the duration when the warning banner (yellow) is visible

      const activeTimeEndThisWeek = add(activeTimeStartThisWeek, {
        hours: 0,
        minutes: 30,
        seconds: 0,
      }); //the duration when the red banner is visible and L2 actions are disabled

      if (nowTime < getTime(banner)) {
        //if the current time is smaller than the banner show time, hide the banner
        setIsBannerStatus("Hidden");
      } else if (
        nowTime >= getTime(banner) &&
        nowTime < getTime(activeTimeStartThisWeek)
      ) {
        const duration1 = getTime(activeTimeStartThisWeek) - nowTime;
        setDuration(intervalToDuration({ start: 0, end: duration1 }));
        //when the status is pending, the yellow warning banner will show
        setIsBannerStatus("Pending");
      } else if (
        nowTime >= getTime(activeTimeStartThisWeek) &&
        nowTime < getTime(activeTimeEndThisWeek)
      ) {
        const duration2 = getTime(activeTimeEndThisWeek) - nowTime;
        setDuration(intervalToDuration({ start: 0, end: duration2 }));
        //when the status is active, red banner will show
        setIsBannerStatus("Active");
      } else {
        setIsBannerStatus("Hidden");
      }
    }, 1000); // 60 seconds in milliseconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [banner]);

  const localTime = useMemo(() => {
    const activeTimeStartThisWeek = add(banner, {
      hours: 24,
      minutes: 0,
      seconds: 0,
    }); //the duration when the warning banner (yellow) is visible

    const activeTimeEndThisWeek = add(activeTimeStartThisWeek, {
      hours: 0,
      minutes: 30,
      seconds: 0,
    }); //the duration when the red banner is visible and L2 actions are disabled

    // 브라우저의 타임존 오프셋 가져오기 (분 단위)
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();

    // 시간과 분으로 변환
    const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
    const offsetMinutes = Math.abs(timezoneOffsetMinutes) % 60;

    // 오프셋 문자열 생성
    const offsetSign = timezoneOffsetMinutes <= 0 ? "+" : "-";
    const timezoneOffsetString = `UTC${offsetSign}${offsetHours}:${offsetMinutes
      .toString()
      .padStart(2, "0")}`;

    return {
      startTime: `${activeTimeStartThisWeek
        .getHours()
        .toLocaleString()}:${activeTimeStartThisWeek
        .getMinutes()
        .toLocaleString()
        .padStart(2, "0")}`,
      endTime: `${activeTimeEndThisWeek
        .getHours()
        .toLocaleString()}:${activeTimeEndThisWeek
        .getMinutes()
        .toLocaleString()
        .padStart(2, "0")}`,
      timezone: timezoneOffsetString,
    };
  }, [banner]);

  return isBannerStatus !== "Hidden" ? (
    <Flex
      h="61px"
      w="560px"
      bg={isBannerStatus === "Pending" ? "#F9C03E" : "#DD3A44"}
      borderRadius={"5px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={isBannerStatus === "Pending" ? "#0F0F12" : "#fff"}
      p="16px"
      mb={"10px"}
    >
      <Flex flexDir={"column"}>
        {isBannerStatus === "Active" ? (
          <>
            {" "}
            <Text fontSize={"14px"}>
              {isTestnet
                ? "Titan Sepolia Network under maintenance."
                : "Titan Network under maintenance."}
            </Text>
          </>
        ) : (
          <>
            {" "}
            <Text fontSize={"14px"}>
              {isTestnet
                ? "Titan Sepolia Network scheduled maintenance commencing in:"
                : "Titan Network scheduled maintenance commencing in:"}
            </Text>
          </>
        )}

        <Text fontSize={"12px"}>
          Maintenance scheduled from{" "}
          <span style={{ fontWeight: "bold" }}>
            {isTestnet
              ? `${localTime.startTime} ~ ${localTime.endTime}`
              : `${localTime.startTime} ~ ${localTime.endTime}`}{" "}
            {localTime.timezone}
          </span>{" "}
        </Text>
      </Flex>

      <Text fontSize={"18px"}>
        {duration.hours !== undefined && duration.hours < 0
          ? ""
          : duration.hours}
        :{duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
        {duration.minutes}:
        {duration.seconds !== undefined && duration.seconds < 10 ? "0" : ""}
        {duration.seconds}
      </Text>
    </Flex>
  ) : (
    <></>
  );
};

export default MaintenanceBanner;
