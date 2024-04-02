// this banner can be used incase L2 needs to be shut down or for any other notices. Same logics as MaintenanceBanner

import { Flex, Text } from "@chakra-ui/react";
import {
  relayBannerSelector,
  relayBannerStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { add, getTime, intervalToDuration, Duration } from "date-fns";
import { useInOutNetwork } from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useConnectedNetwork from "@/hooks/network";

type Banner = "Pending" | "Active" | "Hidden";

const RelayBanner = () => {
  const [status, setStatus] = useState<Banner>("Hidden");
  const [isBannerStatus, setIsBannerStatus] = useRecoilState(relayBannerStatus);
  const banner = useRecoilValue(relayBannerSelector).previewTimeStartThisWeek;
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
      // const showPrevTime = getTime(1693285339000);
      // const activeTimeStartThisWeek = 1693285339000;
      const showPrevTime = getTime(1710226800000);
      const activeTimeStartThisWeek = 1710226800000;

      const activeTimeEndThisWeek = 1710291660000;
      if (nowTime < getTime(banner)) {
        setIsBannerStatus("Hidden");
        setStatus("Hidden");
      } else if (
        nowTime >= getTime(banner) &&
        nowTime < getTime(activeTimeStartThisWeek)
      ) {
        const duration1 = showPrevTime - nowTime;

        setDuration(intervalToDuration({ start: 0, end: duration1 }));
        setStatus("Pending");
        setIsBannerStatus("Pending");
      } else if (
        nowTime >= getTime(activeTimeStartThisWeek) &&
        nowTime < getTime(activeTimeEndThisWeek)
      ) {
        setStatus("Active");
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
      h="76px"
      w="560px"
      bg={status === "Pending" ? "#F9C03E" : "#DD3A44"}
      borderRadius={"5px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={status === "Pending" ? "#0F0F12" : "#fff"}
      p="16px"
      mb={"10px"}
    >
      <Flex flexDir={"column"} w={status === "Pending" ? "400px" : "100%"}>
        {status === "Active" ? (
          <>
            {" "}
            <Text fontSize={"14px"}>
              Swap on the Ethereum Network is under maintenance.
            </Text>
          </>
        ) : (
          <>
            {" "}
            <Text fontSize={"14px"}>
              Swap on Ethereum network maintenance is scheduled.
            </Text>
          </>
        )}
        {status === "Active" ? (
          <Text fontSize={"10px"}>
            {" "}
            {/* After the 7-day challenge period, any withdrawals initiated after
            August 30th, 2023 at 18:00 GMT+9, will need to be manually relayed
            using a new interface (read more in{" "}
            <a
              href={
                "https://medium.com/onther-tech/titan-network-shutdown-notice-for-auto-relay-service-5f9b8616e20a"
              }
              target="_blank"
              style={{ fontWeight: "bold", textDecoration: "underline", cursor:'pointer' }}
            >
              English
            </a>{" "}
            /{" "}
            <a
              style={{ fontWeight: "bold", textDecoration: "underline", cursor:'pointer' }}
              target="_blank"
              href="https://medium.com/onther-tech/titan-network-auto-relay-service-%EC%A4%91%EB%8B%A8-%EC%95%88%EB%82%B4-80d6a37c5ca0"
            >
              한국어
            </a>
            ). */}
            Maintenance is scheduled from 16:00~16:30 GMT+9. *You can still wrap
            & deposit, and no functions on Titan are affected.
          </Text>
        ) : (
          <Text fontSize={"10px"}>
            {" "}
            {/* August 30th, 2023 at 18:00 GMT+9, any withdrawals will have to be */}
            {/* manually relayed using a new interface (read more in{" "} */}
            March 12th 16:00~16:30 GMT+9, the swap router backend will be
            upgraded
            {/* <a
              href={
                "https://medium.com/onther-tech/titan-network-shutdown-notice-for-auto-relay-service-5f9b8616e20a"
              }
              target="_blank"
              style={{ fontWeight: "bold", textDecoration: "underline", cursor:'pointer' }}
            >
              English
            </a>{" "}
            /{" "}
            <a
              style={{ fontWeight: "bold", textDecoration: "underline", cursor:'pointer' }}
              target="_blank"
              href="https://medium.com/onther-tech/titan-network-auto-relay-service-%EC%A4%91%EB%8B%A8-%EC%95%88%EB%82%B4-80d6a37c5ca0"
            >
              한국어
            </a>
            ). */}
          </Text>
        )}
      </Flex>
      {status === "Pending" ? (
        <Text fontSize={"18px"}>
          {duration.hours !== undefined &&
          duration.days !== undefined &&
          duration.days < 1 &&
          duration.hours < 10
            ? "0"
            : ""}
          {duration.days !== undefined &&
          duration.hours !== undefined &&
          duration.days > 0
            ? duration.hours + 24
            : duration.hours}
          :{duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
          {duration.minutes}:
          {duration.seconds !== undefined && duration.seconds < 10 ? "0" : ""}
          {duration.seconds}
        </Text>
      ) : (
        <></>
      )}
    </Flex>
  ) : (
    <></>
  );
};

export default RelayBanner;
