import { TitanMaintenanceDate } from "@/staging/constants/legacyTitan";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export const Banner110Component: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const maintenance = new Date(TitanMaintenanceDate);
      const diff = maintenance.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      w={"493px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      px={"16px"}
      py={"10px"}
      borderRadius={"8px"}
      bg={"#DD3A44"}
      mb={"48px"}
    >
      <Flex flexDir={"column"}>
        <Text fontSize={"14px"} color={"#FFF"} fontWeight={500}>
          Tokamak Bridge is under maintenance
        </Text>
        <Text w={"320px"} fontSize={"11px"} color={"#FFF"} fontWeight={400}>
          L2 transactions will no longer be accepted
        </Text>
      </Flex>
      <Flex>
        <Text color={"FFF"} fontSize={"16px"}>
          <Text as="span" fontSize={"18px"}>
            {timeLeft}
          </Text>{" "}
          Left
        </Text>
      </Flex>
    </Flex>
  );
};
