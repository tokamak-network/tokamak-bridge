import {
  Box,
  Text,
  Flex,
  Circle,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { FwTooltip } from "@/componenets/fw/components/FwTooltip";

export default function FwOptionCrossDetail() {
  const [inputValueCheck, setInputValueCheck] = useState<boolean>(false);

  interface Effect {
    warnings: string;
    color: string | null;
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const shouldShowRightElement = value !== "";
    if (inputValueCheck !== shouldShowRightElement) {
      setInputValueCheck(shouldShowRightElement);
    }
  };

  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      border='1px solid #DB00FF'
      py={"16px"}
      px={"20px"}
      borderRadius={"8px"}
      cursor='pointer'
    >
      <Box>
        <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
          Cross Trade Bridge
        </Text>
        <Box mt={"12px"}>
          <Flex>
            <Text
              fontWeight={400}
              fontSize={"10px"}
              lineHeight={"20px"}
              color={"#A0A3AD"}
            >
              Receive
            </Text>
            <FwTooltip
              tooltipLabel={"text will be changed"}
              style={{ marginLeft: "2px", marginTop: "1px" }}
            />
          </Flex>
          <Text
            fontWeight={600}
            fontSize={"22px"}
            lineHeight={"33px"}
            color={"#DB00FF"}
          >
            9.988 USDC
          </Text>
        </Box>
        <Box mt={"12px"}>
          <Flex>
            <Button
              width='99px'
              height='26px'
              padding='4px 10px'
              gap='8px'
              borderRadius='4px'
              sx={{
                backgroundColor: "#15161D",
                color: "#A0A3AD",
                border: "1px solid #313442",
              }}
            >
              <Text fontSize={"12px"} fontWeight={"400"} lineHeight={"18px"}>
                Recommend
              </Text>
            </Button>
            <Button
              width='82px'
              height='26px'
              padding='4px 10px'
              ml={"8px"}
              gap='8px'
              borderRadius='4px'
              sx={{
                backgroundColor: "#DB00FF",
                color: "#FFFFFF",
              }}
            >
              <Text fontSize={"12px"} fontWeight={"600"} lineHeight={"18px"}>
                Advanced
              </Text>
            </Button>
          </Flex>
        </Box>
        <Box mt={"12px"}>
          <Flex>
            <Text
              fontWeight={400}
              fontSize={"10px"}
              lineHeight={"20px"}
              color={"#A0A3AD"}
            >
              Service fee
            </Text>
            <FwTooltip
              tooltipLabel={"text will be changed"}
              style={{ marginLeft: "2px", marginTop: "1px" }}
            />
          </Flex>
          <InputGroup my={"4px"}>
            <Input
              w={"189px"}
              h={"34px"}
              px='12px'
              py='4px'
              type='number'
              pattern='\d*'
              inputMode='decimal'
              border={"1px solid #313442"}
              borderRadius={"4px"}
              fontSize={"16px"}
              fontWeight={600}
              lineHeight={"26px"}
              placeholder='Enter amount'
              onChange={onChange}
              _hover={{}}
              _placeholder={{
                fontSize: "12px",
                fontWeight: "400",
                lineHeight: "26px",
                color: "#A0A3AD",
              }}
              _focus={{
                borderColor: "#59628D",
                boxShadow: "0 0 0 0.1px #59628D",
              }}
            />
            {inputValueCheck && (
              <InputRightElement height={"34px"}>
                <Text
                  pr={"12px"}
                  fontSize={"12px"}
                  fontWeight={400}
                  color={"#A0A3AD"}
                  lineHeight={"26px"}
                >
                  USDC
                </Text>
              </InputRightElement>
            )}
          </InputGroup>
        </Box>

        <Box mt={"12px"}>
          <Text
            fontSize={"10px"}
            fontWeight={400}
            lineHeight={"15px"}
            color={"#A0A3AD"}
          >
            It can be received faster depending on
          </Text>
          <Text
            fontSize={"10px"}
            fontWeight={400}
            lineHeight={"15px"}
            color={"#A0A3AD"}
          >
            the liquidity provider situation
          </Text>
        </Box>
      </Box>
      <Circle
        size='56px'
        border='1px solid #DB00FF'
        bg='#15161D'
        pb={"8px"}
        pt={"6px"}
      >
        <Box>
          <Text
            fontWeight={600}
            fontSize={"22px"}
            lineHeight={"33px"}
            letterSpacing={"-0.05em"}
            color={"#DB00FF"}
            textAlign='center'
          >
            ?
          </Text>
          <Text
            fontWeight={400}
            fontSize={"10px"}
            lineHeight={"15px"}
            color={"#DB00FF"}
            textAlign='center'
          >
            day
          </Text>
        </Box>
      </Circle>
    </Flex>
  );
}
