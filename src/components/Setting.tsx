import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  Button,
  Icon
} from "@chakra-ui/react";
import { CheckIcon } from '@chakra-ui/icons';
import { Overlay_Index } from "@/types/style/overlayIndex";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  uniswapTxSetting,
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
  isVisible?: boolean;
}

export const SettingContainer = ({ setIsVisible, isModal, settingRef, isVisible }: SettingProps) => {
  const [txSetting, setTxSetting] = useRecoilState(uniswapTxSetting);
  const [displayValues, setDisplayValues] = useState({ slippage: txSetting.slippage, deadline: txSetting.deadline });
  
  useEffect(() => {
    if (!isVisible) {
        setDisplayValues({
            slippage: txSetting.slippage,
            deadline: txSetting.deadline
        });
    }
  }, [isVisible, txSetting]);

  const [settingStatus, setSettingStatus] = useRecoilState(swapSettingStatus);
  const { mobileView } = useMediaView();

  const MAX_SLIPPAGE_TOLERANCE = 20;
  const MAX_DEADLINE = 180;

  interface Effect {
    warnings: string;
    color: string | null;
    buttonDisabled: boolean;
  }

  const checkSlippageEffects = (slippage: string): Effect  => {
    const numSlippage = Number(slippage);
    let effects: Effect = {
        warnings: "",
        color: null,
        buttonDisabled: numSlippage == Number(txSetting.slippage)  
    };

    if (numSlippage == 0) {
        effects.warnings = "Slippage tolerance has to be greater than 0%";
        effects.color = "#DD3A44";
        effects.buttonDisabled = true;
    } else if (numSlippage > 0 && numSlippage < 0.05) {
        effects.warnings = "Slippage below 0.05% may result in a failed transaction";
    } else if (numSlippage >= 10 && numSlippage <= MAX_SLIPPAGE_TOLERANCE) {
        effects.warnings = "Slippage above 10% may result in an unfavorable swap";
    } else if (numSlippage > MAX_SLIPPAGE_TOLERANCE) {
        effects.warnings = `Slippage tolerance cannot exceed ${MAX_SLIPPAGE_TOLERANCE}`;
        effects.color = "#DD3A44";
        effects.buttonDisabled = true;
    }

    return effects;
}

  const checkDeadLineEffects = (deadline: number) => {
    let effects: Effect = {
      warnings: "",
      color: null,
      buttonDisabled: deadline == txSetting.deadline
    };
  
    if (deadline == 0) {
      effects.warnings = "Deadline has to be greater than 0 minutes";
      effects.color = "#DD3A44";
      effects.buttonDisabled = true;
    } else if (deadline > MAX_DEADLINE) {
      effects.warnings = `Deadline cannot exceed ${MAX_DEADLINE} minutes`;
      effects.color = "#DD3A44";
      effects.buttonDisabled = true;
    }
    
    return effects;
  }

  
  const validateSlippage = (value: string) => {
    if (!value) return false;
    const numValue = Number(value);
    if (isNaN(Number(value)) || value.length > 15 || numValue < 0 || (value.includes('.') && value.split('.')[1].length > 2)) {
      return false;
    }
    return numValue.toString();
  }
  
  const validateDeadline = (value: string) => {
    if (isNaN(Number(value)) || value.includes('.')) return false;
    const numValue = Number(value);

    if (isNaN(numValue) || value.length > 15) {
      return false;
    }
    return numValue.toString();
  }
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const newValue = (id === "slippage") ? validateSlippage(value) : validateDeadline(value);
    // If the value is empty, display an empty input field. If newValue has a value, display newValue; otherwise, display the previous value (e.g., 50 -> prev 50).
    setDisplayValues((prev) => ({ ...prev, [id]: (value === "") ? "" : (newValue) ? newValue : (id === "slippage" ? prev.slippage : prev.deadline.toString()) }));
  };


  const saveSlippageSetting = () => {
    setTxSetting(prevSettings => ({
      ...prevSettings,
      slippage: displayValues.slippage
    }));
    setSettingStatus(false)
    setIsVisible ? setIsVisible(false) : "";
  };

  const saveDeadlineSetting = () => {
    setTxSetting(prevSettings => ({
      ...prevSettings,
      deadline: displayValues.deadline
    }));
    setSettingStatus(false)
    setIsVisible ? setIsVisible(false) : "";
  };

  const wrapperRef = useRef(null);

  //close when click at outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      console.log("hoi")
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

  const slippageEffects = checkSlippageEffects(displayValues.slippage);
  const deadlineEffects = checkDeadLineEffects(displayValues.deadline);

  const preventMinus = (e: any) => {
    if (e.code === 'Minus') {
        e.preventDefault();
    }
};

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
          <CloseButton onClick={() => {setSettingStatus(false)}} />
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
        <Flex>
        <InputGroup>
          <Input
            w={"100%"}
            h={"40px"}
            type="number"
            pattern="\d*"
            inputMode="decimal"
            border={"1px solid #313442"}
            borderRadius={"8px"}
            _hover={{}}
            _active={{}}
            onChange={onChange}
            onKeyDown={preventMinus}
            value={displayValues.slippage}
            id="slippage"
            fontSize={{ base: 14, lg: 16 }}
            fontWeight={{ base: 400, lg: 600 }}
            _focus={{
              boxShadow: "none !important",
              border: "1px solid #313442 !important",
            }}
            color={slippageEffects.color || undefined}
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
        <Button
          ml={2} 
          h="40px"
          p="8px"
          borderRadius="6px"
          width="40px"
          height="40px"
          bg={slippageEffects.buttonDisabled ? "#373944" : "#007AFF"}
          isDisabled={slippageEffects.buttonDisabled}
          onClick={saveSlippageSetting}
        >
          <Icon as={CheckIcon} color={slippageEffects.buttonDisabled ? "#A0A3AD" : "#FFFFFF"} boxSize={6}/>
        </Button>
        </Flex>
        {
          slippageEffects.warnings && (
            slippageEffects.color === "#DD3A44" ?
              <RedWarningText label={slippageEffects.warnings} style={{ fontWeight: 400 }} /> :
              <WarningText label={slippageEffects.warnings} style={{ fontWeight: 400 }} />
          )
        }
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
        <Flex>
          <InputGroup>
            <Input
              w={"100%"}
              h={"40px"}
              type="number"
              pattern="\d*"
              border={"1px solid #313442"}
              borderRadius={"8px"}
              _hover={{}}
              _active={{}}
              onChange={onChange}
              onKeyDown={preventMinus}
              color={deadlineEffects.color || undefined}
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
          <Button 
            ml={2} 
            h="40px"
            p="8px"
            borderRadius="6px"
            width="40px"
            height="40px"
            bg={deadlineEffects.buttonDisabled ? "#373944" : "#007AFF"}
            isDisabled={deadlineEffects.buttonDisabled}
            onClick={saveDeadlineSetting}
          >
            <Icon as={CheckIcon} color={deadlineEffects.buttonDisabled ? "#A0A3AD" : "#FFFFFF"} boxSize={6}/>
          </Button>
        </Flex>
        {
          deadlineEffects.color == "#DD3A44" && deadlineEffects.warnings && (
            <RedWarningText label={deadlineEffects.warnings} style={{ fontWeight: 400 }} />
          )
        }
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
      {isVisible && <SettingContainer settingRef={settingRef} isVisible={isVisible} setIsVisible={setIsVisible} />}
    </Flex>
  );
}
