import { extendTheme } from "@chakra-ui/theme-utils";
import "@fontsource/poppins";

const fonts = {
  Poppins: "Poppins",
};

const theme = extendTheme({
  fonts: {
    body: fonts.Poppins,
  },
  styles: {
    global: () => ({
      "html, body": {
        backgroundColor: "#2A2E3E",
        color: "#FFFFFF",
      },
      ".header-right-common": {
        backgroundColor: "#1F2128",
        borderRadius: "8px",
        cursor: "pointer",
      },
    }),
  },
});

export { theme };
