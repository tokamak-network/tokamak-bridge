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
        backgroundColor: "#0F0F12",
        color: "#FFFFFF",
      },
      ".header-right-common": {
        backgroundColor: "#1F2128",
        borderRadius: "8px",
        cursor: "pointer",
      },
      ".card": {
        width: "208px",
        height: "270px",
      },
      ".card-empty": {
        border: "1px dashed #313442",
        borderRadius: "16px",
      },
    }),
  },
});

export { theme };
