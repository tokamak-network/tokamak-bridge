"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { atom } from "recoil";
import { useState, useMemo, useCallback } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import Image from "next/image";
import ToggleSwitch from "../pools/components/TokenToggle";
import BackIcon from "@/assets/icons/back.svg";
import SettingsIcon from "@/assets/icons/setting.svg";
import Link from "next/link";
import NetworkDropdown from "@/components/dropdown/Index";
import addIcon from "@/assets/icons/addIcon.svg";
import InTokenSelector from "./components/InTokenSelector";
import OutTokenSelector from "./components/OutTokenSelector";
import PriceInput from "./components/PriceInput";
import TokenInput from "@/components/input/TokenInput";
import InitializeInfo from "./components/InitializeInfo";
import Graph from "./components/Graph";
import Modals from "./Modal";
import InvalidRangeWarning from "./components/WarningText";
import PositionInfo from "./components/PositionInfo";
import { Bound } from "@/components/ui/LiquidityPoolChart/actions";
import { Chart } from "@/components/ui/LiquidityPoolChart/Chart";
import InputAmount from "./components/InputAmount";
import TierSelector from "./components/TierSelector";

export default function CreatePoolModal() {
  const [inToken, setInToken] = useState("");
  const [outToken, setOutToken] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const hasPool = true;

  const NetworkSwitcher = useMemo(() => {
    return <NetworkDropdown inNetwork={true} />;
  }, []);

  const handleMinPriceChange = (value: number) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value: number) => {
    setMaxPrice(value);
  };

  const handleClearAll = () => {
    setInToken("");
    setOutToken("");
  };

  const onBrushDomainChangeEnded = useCallback(
    async (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      const leftRangeInputState = atom<string>({
        key: "leftRangeInputState",
        default: "",
      });

      const rightRangeInputState = atom<string>({
        key: "rightRangeInputState",
        default: "",
      });

      const fixedIsSorted = true; // Fixed value for isSorted
      const fixedTicksAtLimit: { [bound in Bound]?: boolean | undefined } = {
        [Bound.LOWER]: true,
        [Bound.UPPER]: false,
      }; // Fixed value for ticksAtLimit

      // Simulate user input for auto-formatting and other validations
      if (
        (!fixedTicksAtLimit[fixedIsSorted ? Bound.LOWER : Bound.UPPER] ||
          mode === "handle" ||
          mode === "reset") &&
        leftRangeValue > 0
      ) {
        const [, setLeftRangeInput] = useRecoilState(leftRangeInputState);
        setLeftRangeInput(leftRangeValue.toFixed(6));
      }

      if (
        (!fixedTicksAtLimit[fixedIsSorted ? Bound.UPPER : Bound.LOWER] ||
          mode === "reset") &&
        rightRangeValue > 0
      ) {
        // todo: remove this check. Upper bound for large numbers
        // sometimes fails to parse to tick.
        if (rightRangeValue < 1e35) {
          const [, setRightRangeInput] = useRecoilState(rightRangeInputState);
          setRightRangeInput(rightRangeValue.toFixed(6));
        }
      }
    },
    [] // No dependencies required for this callback
  );

  return (
    <Flex flexDir={"column"} w={"872px"}>
      <Flex
        flexDir="column"
        mb={"10px"}
        w="100%"
        bgColor="#0F0F12"
        alignItems="center"
      >
        <Flex justifyContent="space-between">
          <Flex
            marginRight={inToken === "" ? "567px" : "455px"}
            cursor={"pointer"}
          >
            <Link href="/pools">
              <Flex mb={"10px"} top={128} w="100%">
                <Image src={BackIcon} alt="Back" />
                <Text fontSize="28px" fontWeight="normal" ml={"14px"}>
                  Add Liquidity
                </Text>
              </Flex>
            </Link>
          </Flex>
          <Flex alignItems="center">
            {inToken && outToken && (
              <ToggleSwitch inToken={inToken} outToken={outToken} />
            )}
            <Text
              fontSize="12px"
              color="#007AFF"
              marginRight="6px"
              onClick={handleClearAll}
              cursor="pointer"
            >
              Clear All
            </Text>
            <Image width={18} height={18} src={SettingsIcon} alt="Settings" />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        alignItems="center"
        textAlign="center"
        cursor={"pointer"}
        pb="20px"
      >
        <Flex
          flexDir="row"
          w="448px"
          justifyContent={"center"}
          mt="20px"
          flex={1}
        >
          <Flex flexDir="column" w="408px">
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"} mb={"8px"}>
                Select Network
              </Text>
              <Box>
                <NetworkDropdown
                  inNetwork={false}
                  // TODO: Reverted when merging. WIP
                  // width="408px"
                  // height="48px"
                  // innerWidth="408px"
                />
              </Box>
            </Flex>
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"} mb={"8px"}>
                Select Free Tier
              </Text>
              <TierSelector />
            </Flex>
            <Flex flexDir="column" mb={"20px"}>
              <Text textAlign={"left"}>Select Pair</Text>
              <Flex flexDir={"row"}>
                <Box mr={"9px"}>
                  <InTokenSelector />
                  {inToken && (
                    <TokenInput
                      inToken={true}
                      style={{ width: "178px", marginLeft: "9px" }}
                      inputKey="in"
                    />
                  )}
                </Box>
                <Image src={addIcon} alt={"plusIcon"} />
                <Box>
                  <OutTokenSelector />
                  {outToken && (
                    <TokenInput
                      inToken={false}
                      style={{ width: "178px", marginLeft: "20px" }}
                      inputKey="out"
                    />
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {/* Graph & Min Max Price component */}
        <Flex flexDir="row" w="424px" justifyContent={"center"}>
          <Flex flexDir="column">
            <Flex flexDir="column">
              {/* <PositionInfo /> */}
              {/* <Chart
                data={{
                  series: [
                    { activeLiquidity: 1000, price0: 0.5 },
                    { activeLiquidity: 2000, price0: 0.6 },
                    { activeLiquidity: 3000, price0: 0.7 },
                    // Add more entries as needed
                  ],
                  current: 0.6,
                }}
                dimensions={{ width: 400, height: 200 }}
                margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
                styles={{
                  area: {
                    selection: "#ff0000",
                  },
                  brush: {
                    handle: {
                      west: "#00ff00",
                      east: "#0000ff",
                    },
                  },
                }}
                interactive={false}
                brushLabels={(d: "w" | "e", x: number) => {
                  // Define your custom brush label logic here
                  if (d === "w") {
                    return `Direction: West, Value: ${x.toFixed(6)}`;
                  } else if (d === "e") {
                    return `Direction: East, Value: ${x.toFixed(6)}`;
                  }
                  return "";
                }}
                onBrushDomainChange={onBrushDomainChangeEnded}
                zoomLevels={{
                  initialMin: 0.5,
                  initialMax: 0.7,
                  min: 0.1,
                  max: 1.5,
                }}
                ticksAtLimit={{ LOWER: true, UPPER: false }}
              /> */}
              <InitializeInfo />
              <InputAmount inToken="ETH" outToken="USDC" />
              <Flex justifyContent={"space-between"}>
                <PriceInput
                  titleText={"Min Price"}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  min={0}
                  max={100}
                  step={1}
                  inToken="ETH"
                  outToken="USDC"
                  border={true}
                  bgColor="#1F2128"
                  isInputChange={true}
                />
                <PriceInput
                  titleText={"Max Price"}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  min={0}
                  max={100}
                  step={1}
                  inToken="ETH"
                  outToken="USDC"
                  border={true}
                  bgColor="#1F2128"
                  isInputChange={true}
                />
              </Flex>
              {/* <Button
                variant="outline"
                borderWidth="1px"
                borderColor="#313442"
                borderRadius="8px"
                _hover={{ borderColor: "#ffff", bgColor: "#0F0F12" }}
              >
                Full Range
              </Button> */}
              {/* <InvalidRange /> */}
              {/* {inToken && outToken && hasPool ? (
                <Button
                  mt={"36px"}
                  h={"48px"}
                  bgColor={"#007AFF"}
                  border={"none"}
                  borderWidth="1px"
                  borderRadius="8px"
                  _hover={{ bgColor: "#007AFF" }}
                >
                  <Text fontWeight={"bold"}>Preview</Text>
                </Button>
              ) : (
                <Button
                  mt={"36px"}
                  h={"48px"}
                  bgColor={"#17181D"}
                  border={"none"}
                  borderWidth="1px"
                  borderRadius="8px"
                  _hover={{ bgColor: "#17181D" }}
                >
                  <Text fontWeight={"bold"}>Invalid Pair</Text>
                </Button>
              )} */}
              {hasPool ? (
                <>
                  <Button
                    mt={"68px"}
                    h={"48px"}
                    bgColor={"#007AFF"}
                    border={"none"}
                    borderWidth="1px"
                    borderRadius="8px"
                    _hover={{ bgColor: "#007AFF" }}
                  >
                    <Text fontWeight={"bold"}>Approve WTON</Text>
                  </Button>
                  <Button
                    mt={"12px"}
                    h={"48px"}
                    bgColor={"#17181D"}
                    border={"none"}
                    borderWidth="1px"
                    borderRadius="8px"
                    _hover={{ bgColor: "#17181D" }}
                  >
                    <Text fontWeight={"bold"}>Preview</Text>
                  </Button>
                </>
              ) : (
                <Button
                  mt={"36px"}
                  h={"48px"}
                  bgColor={"#007AFF"}
                  border={"none"}
                  borderWidth="1px"
                  borderRadius="8px"
                  _hover={{ bgColor: "#007AFF" }}
                >
                  <Text fontWeight={"bold"}>Approve WTON</Text>
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Modals />
    </Flex>
  );
}
