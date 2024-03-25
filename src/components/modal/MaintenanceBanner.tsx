import { Flex, Text } from "@chakra-ui/react";
import { bannerSelector, bannerStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { add, getTime, intervalToDuration, Duration } from "date-fns";
import { useInOutNetwork } from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "@/hooks/network";

type Banner = "Pending" | "Active" | "Hidden";

const MaintenanceBanner = () => {
  const [status, setStatus] = useState<Banner>("Hidden");
  const [isBannerStatus, setIsBannerStatus] = useRecoilState(bannerStatus);
  const banner = useRecoilValue(bannerSelector).previewTimeStartThisWeek;
  const { outNetwork } = useInOutNetwork();
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
        hours: 1,
        minutes: 0,
        seconds: 0,
      }); //the duration when the warning banner (yellow) is visible

      const activeTimeEndThisWeek = add(activeTimeStartThisWeek, {
        hours: 1,
        minutes: 0,
        seconds: 0,
      }); //the duration when the red banner is visible and L2 actions are disabled

      if (nowTime < getTime(banner)) {
        //if the current time is smaller than the banner show time, hide the banner
        setIsBannerStatus("Hidden");
        setStatus("Hidden");
      } else if (
        nowTime >= getTime(banner) &&
        nowTime < getTime(activeTimeStartThisWeek)
      ) {
        const duration1 = getTime(activeTimeStartThisWeek) - nowTime;
        setDuration(intervalToDuration({ start: 0, end: duration1 }));
        setStatus("Pending"); //when the status is pending, the yellow warning banner will show
        setIsBannerStatus("Pending");
      } else if (
        nowTime >= getTime(activeTimeStartThisWeek) &&
        nowTime < getTime(activeTimeEndThisWeek)
      ) {
        const duration2 = getTime(activeTimeEndThisWeek) - nowTime;
        setDuration(intervalToDuration({ start: 0, end: duration2 }));
        setStatus("Active"); //when the status is active, red banner will show
        setIsBannerStatus("Active");
      } else {
        setStatus("Hidden");
        setIsBannerStatus("Hidden");
      }
    }, 1000); // 60 seconds in milliseconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [banner]);

  return status !== "Hidden" ? (
    <Flex
      h="61px"
      w="560px"
      bg={status === "Pending" ? "#F9C03E" : "#DD3A44"}
      borderRadius={"5px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={status === "Pending" ? "#0F0F12" : "#fff"}
      p="16px"
      mb={"10px"}
    >
      <Flex flexDir={"column"}>
        {status === "Active" ? (
          <>
            {" "}
            <Text fontSize={"14px"}>
              {isTestnet
                ? "Titan Goerli Network under maintenance."
                : "Titan Network under maintenance."}
            </Text>
          </>
        ) : (
          <>
            {" "}
            <Text fontSize={"14px"}>
              {isTestnet
                ? "Titan Goerli Network scheduled maintenance commencing in:"
                : "Titan Network scheduled maintenance commencing in:"}
            </Text>
          </>
        )}

        <Text fontSize={"10px"}>
          Maintenance scheduled from{" "}
          <span style={{ fontWeight: "bold" }}>
            {isTestnet ? "17:00 - 18:00 GMT +9" : "9:00 - 10:00 GMT +9"}
          </span>{" "}
          *You may still swap on {isTestnet ? "Goerli" : "Ethereum"} Network{" "}
        </Text>
      </Flex>

      <Text fontSize={"18px"}>
        {duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
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
