import Header from "@/components/header/Index";
import { Center, useMediaQuery } from "@chakra-ui/react";
import { GlobalComponents } from "./layout";
import Modals from "./Modals";
import MobileView from "./Mobile";

export default function Entry({ children }: { children: React.ReactNode }) {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");

  if (isMobile) {
    return (
      <Center h={"100vh"}>
        <MobileView />
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Center h={"100vh"}>{children}</Center>
      <GlobalComponents />
      <Modals />
    </>
  );
}
