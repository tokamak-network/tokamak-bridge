import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box
} from "@chakra-ui/react";
import { Overlay_Index } from "@/types/style/overlayIndex";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  uniswapTxSetting,
  uniswapTxSettingSelector,
} from "@/recoil/uniswap/setting";
import { RedWarningText, WarningText } from "./ui/WarningText";
import SettingIcon from "assets/icons/setting.svg";
import { swapSettingStatus } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import CloseButton from "./button/CloseButton";

interface SettingProps {
  setIsVisible?: (vis: boolean) => void;
  isModal?: boolean;
  settingRef?: any;
}

export const SettingContainer = ({ setIsVisible, isModal, settingRef }: SettingProps) => {
  const [txSetting, setTxSetting] = useRecoilState(uniswapTxSetting);
  const txSettingValue = useRecoilValue(uniswapTxSettingSelector);
  const [settingStatus, setSettingStatus] = useRecoilState(swapSettingStatus);
  const slipRef = useRef(null);
  const deadlineRef = useRef(null);
  const { mobileView } = useMediaView();

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
      if (Number(value) > 50) {
        return setTxSetting({
          ...txSetting,
          [id]: "50",
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
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && !settingRef.current.contains(event.target)) {
        setIsVisible ? setIsVisible(false) : "";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Flex
      pos={isModal ? "relative" : "absolute"}
      w={{ base: "full", lg: "360px" }}
      bgColor={"#1F2128"}
      borderRadius={"16px"}
      top={isModal ? "0px" : "30px"}
      right={"0px"}
      p={{ base: "16px 12px", lg: "20px" }}
      flexDir={"column"}
      rowGap={"16px"}
      zIndex={Overlay_Index.AlwaysTop}
      ref={wrapperRef}
    >
      <Text fontSize={{ base: 16, lg: 20 }} fontWeight={500}>
        Transaction Settings
      </Text>
      {
        mobileView &&
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={() => {setSettingStatus(false);}} />
        </Box>
      }

      <Flex
        p={"16px"}
        bgColor={"#0F0F12"}
        borderRadius={"12px"}
        rowGap={"8px"}
        flexDir={"column"}
      >
        <Text fontSize={{ base: "14px", lg: "16px" }}>Slippage tolerance</Text>
        <InputGroup>
          <Input
            w={"100%"}
            h={"40px"}
            type="number"
            pattern="[0-9]*"
            border={"1px solid #313442"}
            borderRadius={"8px"}
            _hover={{}}
            _active={{}}
            onChange={onChange}
            onBlur={onBlur}
            value={txSetting.slippage}
            id="slippage"
            fontSize={{ base: 14, lg: 16 }}
            fontWeight={{ base: 400, lg: 600 }}
            _focus={{
              boxShadow: "none !important",
              border: "1px solid #313442 !important",
            }}
            ref={slipRef}
          />
          <InputRightElement pr={"5px"}>
            <Text
              fontSize={{ base: 14, lg: 16 }}
              fontWeight={400}
              color={"#A0A3AD"}
            >
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
              label="Slippage above 10% may result in an unfavorable swap"
              style={{ fontWeight: 400 }}
            />
          )}
        {Number(txSetting.slippage) >= 50 && (
          <RedWarningText
            label="Slippage tolerance can not exceed 50%"
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
          <Text fontSize={{ base: "14px", lg: "16px" }}>
            Transaction deadline
          </Text>
          {/* <CustomTooltip
          content={<Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />}
          tooltipLabel="testtesttest"
        /> */}
        </Flex>
        <InputGroup>
          <Input
            w={"100%"}
            h={"40px"}
            type="number"
            pattern="[0-9]*"
            border={"1px solid #313442"}
            borderRadius={"8px"}
            _hover={{}}
            _active={{}}
            onChange={onChange}
            onBlur={onBlur}
            value={txSetting.deadline}
            id="deadline"
            fontSize={{ base: 14, lg: 16 }}
            fontWeight={{ base: 400, lg: 600 }}
            _focus={{
              boxShadow: "none !important",
              border: "1px solid #313442 !important",
            }}
            ref={deadlineRef}
          />
          <InputRightElement mr={"25px"} pr={"10px"}>
            <Text
              fontSize={{ base: 14, lg: 16 }}
              fontWeight={400}
              color={"#A0A3AD"}
            >
              minutes
            </Text>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default function Setting() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const settingRef = useRef(null);

  return (
    <Flex flexDir={"column"} pos={"relative"}>
      <Image
        src={SettingIcon}
        alt={"SettingIcon"}
        style={{ cursor: "pointer" }}
        ref={settingRef}
        onClick={() => setIsVisible(prev => !prev)}
      />
      {isVisible && <SettingContainer settingRef={settingRef} setIsVisible={setIsVisible} />}
    </Flex>
  );
}
