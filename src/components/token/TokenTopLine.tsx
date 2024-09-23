import { Box } from "@chakra-ui/react";
import "@fontsource/quicksand/500.css";

type TokenTopLineProps = {
  mainSchemCol: string;
};

export default function TokenTopLine(props: TokenTopLineProps) {
  const { mainSchemCol } = props;
  return (
    <>
      <Box
        pos={"absolute"}
        w={"400px"}
        h={"100px"}
        top={"-83px"}
        left={"-100px"}
        bg={mainSchemCol}
        transform={"rotate(-30deg)"}
        opacity={0.15}
      ></Box>
      <Box
        pos={"absolute"}
        w={"400px"}
        h={"4.63px"}
        top={"15px"}
        left={"-100px"}
        bg={"rgba(255, 255, 255, 0.5)"}
        transform={"rotate(-30deg)"}
      ></Box>
      <Box
        pos={"absolute"}
        w={"400px"}
        h={"47px"}
        top={"28px"}
        left={"-100px"}
        bg={`linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)`}
        transform={"rotate(-30deg)"}
      ></Box>
      {/* <Box
        pos={"absolute"}
        w={"400px"}
        h={"20px"}
        top={"25px"}
        left={"-100px"}
        bg={`linear-gradient(180deg, #fff, mainSchemCol)`}
        transform={"rotate(-30deg)"}
      ></Box> */}
    </>
  );
}
