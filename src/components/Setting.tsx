import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { isAddress } from "viem";

import { Overlay_Index } from "@/types/style/overlayIndex";
import { useRecoilState } from "recoil";
import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { customRecipientAddress } from "@/recoil/bridgeSwap/atom";
import { RedWarningText, WarningText } from "./ui/WarningText";
import SettingIcon from "assets/icons/setting.svg";
import { useGetMode } from "@/hooks/mode/useGetMode";

import CancelIcon from "assets/icons/close.svg";
import WarningIcon from "assets/icons/warningRed.svg";

interface SettingProps {
  setIsVisible?: (vis: boolean) => void;
  isModal?: boolean;
}

export const SettingContainer = ({ setIsVisible, isModal }: SettingProps) => {
  const [txSetting, setTxSetting] = useRecoilState(uniswapTxSetting);
  const slipRef = useRef(null);
  const deadlineRef = useRef(null);

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

export const CustomRecipient = ({
  setIsVisible,
}: {
  setIsVisible: (vis: boolean) => void;
}) => {
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [isRecipientInput, setRecipientInput] = useState<boolean>(false);
  const [isCorrectFormat, setCorrectFormat] = useState<boolean>(true);
  const [, setCustomRecipient] = useRecoilState(customRecipientAddress);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      //@ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsVisible ? setIsVisible(false) : "";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: any) => {
    const val = e.target.value;
    setRecipientAddress(val);

    if (isAddress(val)) setCorrectFormat(true);
    else setCorrectFormat(false);
  };

  return (
    <Box
      pos={"absolute"}
      w={{
        base: "full",
        lg: isCorrectFormat && recipientAddress ? "492px" : "424px",
      }}
      bgColor={"#15161D"}
      border={"1px solid #313442"}
      borderRadius={"8px"}
      top={"30px"}
      right={"0px"}
      p={{ base: "12px", lg: "12px" }}
      flexDir={"column"}
      rowGap={"16px"}
      zIndex={Overlay_Index.AlwaysTop}
      ref={wrapperRef}
    >
      <Flex w={"full"} justify={"space-between"} align={"center"} mb={"8px"}>
        <Text fontWeight={500} fontSize={18}>
          Custom recipient
        </Text>

        {!isRecipientInput && (
          <Button
            w={"82px"}
            h={"33px"}
            rounded={"6px"}
            fontWeight={600}
            fontSize={14}
            bgColor={"#007AFF"}
            _hover={{ bgColor: "#007AFF" }}
            onClick={() => setRecipientInput(true)}
          >
            Confirm
          </Button>
        )}
      </Flex>
      {isRecipientInput ? (
        <Flex pos={"relative"} w={"full"} columnGap={2}>
          <Input
            h={"40px"}
            pr={"34px"}
            bgColor={"#0F0F12"}
            errorBorderColor="#DD3A44"
            border={"1px solid #313442"}
            placeholder="Enter address"
            fontSize={14}
            _placeholder={{ color: "#A0A3AD" }}
            onChange={handleChange}
            value={recipientAddress}
            isInvalid={!isCorrectFormat}
          />

          {isCorrectFormat && recipientAddress && (
            <Button
              w={"60px"}
              h={"40px"}
              rounded={"6px"}
              fontWeight={600}
              fontSize={14}
              bgColor={"#007AFF"}
              _hover={{ bgColor: "#007AFF" }}
              onClick={() => {
                setCustomRecipient(recipientAddress);
                setIsVisible(false);
              }}
            >
              Save
            </Button>
          )}

          {recipientAddress && (
            <Box
              pos={"absolute"}
              top={"11px"}
              right={isCorrectFormat && recipientAddress ? "72px" : "8px"}
              zIndex={1}
              onClick={() => setRecipientAddress("")}
              cursor={"pointer"}
            >
              <Image width={16} height={16} alt="cancel" src={CancelIcon} />
            </Box>
          )}
        </Flex>
      ) : (
        <Text fontSize={14} color={"#A0A3AD"}>
          Do not send your funds to a custodial wallet or exchange address! It
          may be impossible to recover your funds.
        </Text>
      )}

      {!isCorrectFormat && (
        <Flex columnGap={2} align={"center"} mt={2}>
          <Image alt="warning" src={WarningIcon} width={16} height={16} />
          <Text fontSize={12} color={"#DD3A44"}>
            Incorrect address format
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default function Setting() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { mode } = useGetMode();

  return (
    <Flex flexDir={"column"} pos={"relative"}>
      <Image
        src={SettingIcon}
        alt={"SettingIcon"}
        style={{ cursor: "pointer" }}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && mode === "Swap" ? (
        <SettingContainer setIsVisible={setIsVisible} />
      ) : isVisible && mode === "Deposit" ? (
        <CustomRecipient setIsVisible={setIsVisible} />
      ) : (
        ""
      )}
    </Flex>
  );
}
