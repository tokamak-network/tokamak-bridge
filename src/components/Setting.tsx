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
  const [displayValues, setDisplayValues] = useState({ slippage: txSetting.slippage, deadline: txSetting.deadline });

  const txSettingValue = useRecoilValue(uniswapTxSettingSelector);
  const [settingStatus, setSettingStatus] = useRecoilState(swapSettingStatus);
  const { mobileView } = useMediaView();

  const MAX_SLIPPAGE = 100;
  const MAX_SLIPPAGE_TOLERANCE = 50;
  const MAX_DEADLINE = 180;
  const MIN_DEADLINE = 1;
  const DEFAULT_SLIPPAGE = 0.5;
  const DEFAULT_DEADLINE = 20;
  
  const validateSlippage = (value: string) => {
    const numValue = Number(value);
    if (numValue > MAX_SLIPPAGE || numValue < 0 || (value.includes('.') && value.split('.')[1].length > 2)) {
      return false;
    }
    return numValue > MAX_SLIPPAGE_TOLERANCE ? MAX_SLIPPAGE_TOLERANCE.toString() : value;
  }
  
  const validateDeadline = (value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue) || value.length > 4) {
      return false;
    }
    return numValue > MAX_DEADLINE ? MAX_DEADLINE : (numValue < MIN_DEADLINE ? MIN_DEADLINE : numValue);
  }
  
  const onBlurSlippage = (value: string) => {
    const numValue = Number(value);
    if (numValue > MAX_SLIPPAGE || numValue < 0 || (value.includes('.') && value.split('.')[1].length > 2) || isNaN(numValue) || value === "") {
      return DEFAULT_SLIPPAGE.toString();
    }
    return value;
  }
  
  const onBlurDeadline = (value: string) => {
    const numValue = Number(value);
    if (value.length > 4 || isNaN(numValue) || numValue < MIN_DEADLINE) {
      return DEFAULT_DEADLINE.toString();
    }
    return value;
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const newValue = (id === "slippage") ? validateSlippage(value) : validateDeadline(value);
    // If the value is empty, display an empty input field. If newValue has a value, display newValue; otherwise, display the previous value (e.g., 50 -> prev 50).
    setDisplayValues((prev) => ({ ...prev, [id]: (value === "") ? "" : (newValue) ? newValue : (id === "slippage" ? prev.slippage : prev.deadline.toString()) }));
  };

  // Update the value only when in a blur state.
  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newValue = (id === "slippage") ? onBlurSlippage(value) : onBlurDeadline(value);
    if(newValue) {
      setTxSetting(prevSettings => ({
        ...prevSettings,
        [id]: newValue
      }));
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

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
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
            inputMode="decimal"
            border={"1px solid #313442"}
            borderRadius={"8px"}
            _hover={{}}
            _active={{}}
            onChange={onChange}
            onBlur={onBlur}
            value={displayValues.slippage}
            id="slippage"
            fontSize={{ base: 14, lg: 16 }}
            fontWeight={{ base: 400, lg: 600 }}
            _focus={{
              boxShadow: "none !important",
              border: "1px solid #313442 !important",
            }}
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
        {Number(displayValues.slippage) >= 0 &&
          Number(displayValues.slippage) < 0.05 && (
            <WarningText
              label="Slippage below 0.05% may result in a failed transaction"
              style={{ fontWeight: 400 }}
            />
          )}
        {Number(displayValues.slippage) >= 10 &&
          Number(displayValues.slippage) < 50 && (
            <WarningText
              label="Slippage above 10% may result in an unfavorable swap"
              style={{ fontWeight: 400 }}
            />
          )}
        {Number(displayValues.slippage) >= 50 && (
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
            value={displayValues.deadline}
            id="deadline"
            fontSize={{ base: 14, lg: 16 }}
            fontWeight={{ base: 400, lg: 600 }}
            _focus={{
              boxShadow: "none !important",
              border: "1px solid #313442 !important",
            }}
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
