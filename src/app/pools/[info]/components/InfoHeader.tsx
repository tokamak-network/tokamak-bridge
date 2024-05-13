import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import BackIcon from "@/assets/icons/back.svg";
import { useInitialize } from "@/hooks/pool/useInitialize";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useRecoilState } from "recoil";
import { ATOM_positionForInfo } from "@/recoil/pool/positions";

export default function InfoHeader() {
  const { initialzePoolValues, initializeInfoValues } = useInitialize();
  const { initializeTokenPair } = useInOutTokens();
  const [, setPositions] = useRecoilState(ATOM_positionForInfo);

  return (
    <Link
      href="/pools"
      onClick={() => {
        initialzePoolValues();
        initializeTokenPair();
        initializeInfoValues();
        //not to display no liquidity component while routing
        setTimeout(() => {
          setPositions(undefined);
        }, 1000);
      }}
    >
      <Flex mb={"10px"} w="100%">
        <Image src={BackIcon} alt="Back" />
        <Text fontSize="28px" fontWeight="normal" ml={"14px"}>
          Liquidity Info
        </Text>
      </Flex>
    </Link>
  );
}
