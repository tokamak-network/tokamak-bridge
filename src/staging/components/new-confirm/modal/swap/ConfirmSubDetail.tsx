import { Box, Text, Flex, Button } from "@chakra-ui/react";
import Image from "next/image";
import GasStationSymbol from "assets/icons/ct/gas_station_ct.svg";
import GradientSpinner from "@/components/ui/GradientSpinner";

export enum ConfirmDetailType {
  Rate = "Rate",
  MinReceived = "Min. received",
  GasFee = "Gas Fee",
}

interface ConfirmSubDetailProps {
  type: ConfirmDetailType;
  tokenValue: string;
  gasValue?: string | undefined | null;
  isLoading: boolean;
}

export default function ConfirmSubDetail(props: ConfirmSubDetailProps) {
  const { type, tokenValue, gasValue, isLoading } = props;
  return (
    <>
      <Flex
        justifyContent='space-between'
        my={type == ConfirmDetailType.MinReceived ? "6px" : ""}
      >
        <Text
          color={"#A0A3AD"}
          fontSize={"12px"}
          fontWeight={400}
          lineHeight={"18px"}
        >
          {type}
        </Text>
        {isLoading ? (
          <Flex
            w={
              type === ConfirmDetailType.Rate
                ? "172px"
                : type === ConfirmDetailType.MinReceived
                ? "100px"
                : "115px"
            }
            h={"18px"}
          >
            <GradientSpinner />
          </Flex>
        ) : (
          <>
            {type == ConfirmDetailType.Rate && (
              <Flex>
                <Text
                  color={"#FFFFFF"}
                  fontSize={"12px"}
                  fontWeight={600}
                  lineHeight={"18px"}
                >
                  {tokenValue}
                </Text>
                <Flex>
                  <Flex ml={"4px"} alignItems={"center"}>
                    <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
                      <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                        (
                      </span>
                      ${gasValue}
                      <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                        )
                      </span>
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
            {type == ConfirmDetailType.MinReceived && (
              <Flex>
                <Text
                  color={"#FFFFFF"}
                  fontSize={"12px"}
                  fontWeight={600}
                  lineHeight={"18px"}
                >
                  {tokenValue}
                </Text>
              </Flex>
            )}
            {type == ConfirmDetailType.GasFee && (
              <Flex>
                <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
                <Text
                  color={"#FFFFFF"}
                  fontSize={"12px"}
                  fontWeight={600}
                  lineHeight={"18px"}
                  mx={"6px"}
                >
                  {tokenValue}
                </Text>
                <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
                  <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                    (
                  </span>
                  ${gasValue}
                  <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                    )
                  </span>
                </Text>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </>
  );
}
