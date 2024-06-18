import { Flex, Text } from "@chakra-ui/react";
import { getUnixTime, intervalToDuration, getTime } from "date-fns";
import { useState, useEffect } from "react";
import Image from "next/image";
import { confirmWithdrawData } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";
import { useFeeData } from "wagmi";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

const Step4 = (props: { progress: string; check: any }) => {
  const { check } = props;
  const [relayGasCost, setRelayGasCost] = useState(undefined);

  const { data: feeData } = useFeeData({
    chainId: 1,
  });
  const { tokenMarketPrice } = useGetMarketPrice({ tokenName: "ethereum" });

  useEffect(() => {
    if (feeData && tokenMarketPrice) {
      const gasLimit = 600000;
      const { gasPrice } = feeData;
      const gasCost = gasLimit * Number(gasPrice);
      const parsedTotalGasCost = ethers.utils.formatUnits(
        gasCost.toString(),
        "ether"
      );

      const usTotal = commafy(
        Number(tokenMarketPrice) * Number(parsedTotalGasCost),
        2
      );
      setRelayGasCost(usTotal);

      const getFee = setInterval(() => {
        const gasLimit = 1000000;
        const { gasPrice } = feeData;
        const gasCost = gasLimit * Number(gasPrice);
        const parsedTotalGasCost = ethers.utils.formatUnits(
          gasCost.toString(),
          "ether"
        );

        const usTotal = commafy(
          Number(tokenMarketPrice) * Number(parsedTotalGasCost),
          2
        );
        setRelayGasCost(usTotal);
      }, 12000);

      return () => clearInterval(getFee);
    }
  }, [feeData]);

  return (
    <Flex
      h="36px"
      justifyContent={"space-between"}
      alignItems={"center"}
      // border={"1px solid red"}
      w="100%"
    >
      <Flex>
        <Image src={check.check} alt="check" />
        <Text ml="8px" fontSize={"14px"} color={check.color}>
          Claim withdraw
        </Text>
      </Flex>
      {props.progress !== "done" && (
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check.color}>
            {" "}
            {relayGasCost ? `~ $` : ""}
            {relayGasCost ?? "NA"}
          </Text>
          <Image src={check.gas} alt="gas station" />
        </Flex>
      )}
    </Flex>
  );
};

export default Step4;
