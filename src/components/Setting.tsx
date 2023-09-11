import SettingIcon from "assets/icons/setting.svg";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Overlay_Index } from "@/types/style/overlayIndex";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  uniswapTxSetting,
  uniswapTxSettingSelector,
} from "@/recoil/uniswap/setting";
import { Percent } from "@uniswap/sdk-core";
import CustomTooltip from "./tooltip/CustomTooltip";
import QUESTION_ICON from "assets/icons/question.svg";
import { RedWarningText, WarningText } from "./ui/WarningText";

export default function Setting() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [txSetting, setTxSetting] = useRecoilState(uniswapTxSetting);
  const txSettingValue = useRecoilValue(uniswapTxSettingSelector);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    if (id === "slippage") {
      if (
        Number(value) > 100 ||
        Number(value) < 0 ||
        value.split(".")[1]?.length > 2 ||
        isNaN(Number(value))
      ) {
        return;
      }
      if (Number(value) > 20) {
        return setTxSetting({
          ...txSetting,
          [id]: "20",
        });
      }
      return setTxSetting({
        ...txSetting,
        [id]: value,
      });
    }

    if (id === "deadline") {
      if (value.length > 4 || isNaN(Number(value))) {
        return;
      }
      if (Number(value) > 180) {
        return setTxSetting({ ...txSetting, [id]: 180 });
      }
      return setTxSetting({ ...txSetting, [id]: Number(value) });
    }
  };

  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    if (id === "slippage") {
      if (
        Number(value) > 100 ||
        Number(value) < 0 ||
        value.split(".")[1]?.length > 2 ||
        isNaN(Number(value)) ||
        value === ""
      ) {
        return setTxSetting({
          ...txSetting,
          [id]: "0.5",
        });
      }
    }

    if (id === "deadline") {
      console.log(
        value.length > 4 || isNaN(Number(value)) || Number(value) < 1
      );
      if (value.length > 4 || isNaN(Number(value)) || Number(value) < 1) {
        return setTxSetting({ ...txSetting, [id]: 1 });
      }
    }
  };

  const wrapperRef = useRef(null);

  //close when click at outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      //@ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Flex flexDir={"column"} pos={"relative"}>
      <Image
        src={SettingIcon}
        alt={"SettingIcon"}
        style={{ cursor: "pointer" }}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <Flex
          pos={"absolute"}
          w={"360px"}
          bgColor={"#1F2128"}
          borderRadius={"16px"}
          top={"30px"}
          right={"0px"}
          p={"20px"}
          flexDir={"column"}
          rowGap={"16px"}
          zIndex={Overlay_Index.AlwaysTop}
          ref={wrapperRef}
        >
          <Text fontSize={20} fontWeight={500}>
            Transaction Settings
          </Text>
          <Flex
            p={"16px"}
            bgColor={"#0F0F12"}
            borderRadius={"12px"}
            rowGap={"8px"}
            flexDir={"column"}
          >
            <Text>Slippage tolerance</Text>
            <InputGroup>
              <Input
                w={"100%"}
                h={"40px"}
                border={"1px solid #313442"}
                borderRadius={"8px"}
                _hover={{}}
                _active={{}}
                onChange={onChange}
                onBlur={onBlur}
                value={txSetting.slippage}
                id="slippage"
                fontSize={16}
                fontWeight={600}
                _focus={{
                  boxShadow: "none !important",
                  border: "1px solid #313442 !important",
                }}
              />
              <InputRightElement pr={"5px"}>
                <Text fontSize={16} fontWeight={400} color={"#A0A3AD"}>
                  %
                </Text>
              </InputRightElement>
            </InputGroup>
            {Number(txSetting.slippage) >= 0 &&
              Number(txSetting.slippage) < 0.05 && (
                <WarningText
                  label="Slippage below 0.05% may result in a failed transaction"
                  style={{ fontWeight: 400 }}
                />
              )}
            {Number(txSetting.slippage) >= 10 &&
              Number(txSetting.slippage) < 50 && (
                <WarningText
                  label="Slippage below 10% may result in an unfavorable swap"
                  style={{ fontWeight: 400 }}
                />
              )}
            {Number(txSetting.slippage) >= 50 && (
              <RedWarningText
                label="Slippage above 50% may result in an unfavorable swap"
                style={{ fontWeight: 400 }}
              />
            )}
          </Flex>

          <Flex
            p={"16px"}
            bgColor={"#0F0F12"}
            borderRadius={"12px"}
            rowGap={"8px"}
            flexDir={"column"}
          >
            <Flex columnGap={"4px"}>
              <Text>Transaction deadline</Text>
              {/* <CustomTooltip
                content={<Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />}
                tooltipLabel="testtesttest"
              /> */}
            </Flex>
            <InputGroup>
              <Input
                w={"100%"}
                h={"40px"}
                border={"1px solid #313442"}
                borderRadius={"8px"}
                _hover={{}}
                _active={{}}
                onChange={onChange}
                onBlur={onBlur}
                value={txSetting.deadline}
                id="deadline"
                fontSize={16}
                fontWeight={600}
                _focus={{
                  boxShadow: "none !important",
                  border: "1px solid #313442 !important",
                }}
              />
              <InputRightElement mr={"25px"} pr={"10px"}>
                <Text fontSize={16} fontWeight={400} color={"#A0A3AD"}>
                  minutes
                </Text>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
