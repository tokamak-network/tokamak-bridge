import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { Flex, Box, Text, Button, useDisclosure } from "@chakra-ui/react";
import ClaimEarningsModal from "./ClaimEarningsModal";
import { usePoolModals } from "@/hooks/modal/usePoolModals";
import { useMemo } from "react";
// import TokenNetwork from "@/components/ui/TokenNetwork";

export default function UnclaimedEarnings() {
  const { info } = usePositionInfo();
  const { onOpenClaimEarning } = usePoolModals();

  const btnIsDisabled = useMemo(() => {
    if (info?.token0CollectedFee && info?.token1CollectedFee) {
      return (
        Number(info?.token0CollectedFee.replaceAll(",", "")) +
          Number(info?.token0CollectedFee.replaceAll(",", "")) <=
        0
      );
    }
  }, [info?.token0CollectedFee, info?.token1CollectedFee]);

  return (
    <Flex
      bgColor="#1F2128"
      w="100%"
      //   h="163px"
      h="121px"
      pt="14px"
      pb={"18px"}
      px="20px"
      borderRadius={"12px"}
      justifyContent={"space-between"}
    >
      <Flex alignItems={"left"} flexDir={"column"}>
        <Text>Unclaimed earnings</Text>
        <Text fontSize={"24px"} as="b" mt={"6px"}>
          $0.20
        </Text>
        <Flex mb={"8px"} alignItems={"center"} color="#A0A3AD">
          <Text fontSize={"12px"}>
            {commafy(info?.token0CollectedFee, 8)} {info?.token0.symbol}
          </Text>
          <Text w={"10px"} mx={"2px"}>
            +
          </Text>
          <Text fontSize={"12px"}>
            {commafy(info?.token1CollectedFee, 8)} {info?.token1.symbol}
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems={"flex-end"} pb={"13px"}>
        <Button
          bgColor={"#007AFF"}
          _hover={{ bgColor: "#007AFF" }}
          _active={{}}
          onClick={onOpenClaimEarning}
          isDisabled={btnIsDisabled}
          _disabled={{ bgColor: "#17181D", color: "#8E8E92" }}
        >
          Claim
        </Button>
      </Flex>
    </Flex>
  );
}
