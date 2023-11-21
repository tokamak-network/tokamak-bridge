import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import BACK_ICON from "assets/icons/back.svg";
import ToggleSwitch from "../add/components/TokenToggle";
import Setting from "@/components/Setting";
import { useInitialize } from "@/hooks/pool/useInitialize";
import { useGetPool } from "@/hooks/pool/useV3MintInfo";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

export default function TopLine(props: {
  title: string;
  clear: boolean;
  switcher: boolean;
  backwardLink?: string;
}) {
  const { title, clear, switcher, backwardLink } = props;
  const { pool } = useGetPool();
  const { initialzePoolValues, initializeInfoValues } = useInitialize();
  const { initializeTokenPair } = useInOutTokens();
  const { subMode } = useGetMode();

  return (
    <Flex alignItems={"center"} justifyContent="space-between">
      <Flex w="100%" alignItems={"center"} columnGap={"12px"}>
        <Link
          href={backwardLink ?? "/pools"}
          onClick={() => {
            initialzePoolValues();
            initializeTokenPair();
            initializeInfoValues();
          }}
        >
          <Image src={BACK_ICON} alt="BACK_ICON" />
        </Link>
        <Text fontSize={28} fontWeight={500}>
          {title}
        </Text>
      </Flex>
      <Flex alignItems="center" columnGap={"16px"}>
        {clear && (
          <Text
            w={"50px"}
            fontSize={12}
            color="#007AFF"
            onClick={initialzePoolValues}
            cursor="pointer"
          >
            Clear all
          </Text>
        )}
        {subMode.add && pool?.token0.symbol && pool?.token1.symbol && (
          <ToggleSwitch />
        )}
        <Box w={"20px"} h={"20px"}>
          <Setting />
        </Box>
      </Flex>
    </Flex>
  );
}
