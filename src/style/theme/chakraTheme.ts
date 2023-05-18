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
      // Reset all styles
      "*": {
        // all: "unset",
        // animation: "none",
        // transition: "none",
        // transform: "none",
        outline: "none",
        boxshadow: "none",
      },

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
    // Additional overrides for specific components can be added here
    // For example, to reset the button styles
    Button: {
      baseStyle: {
        // Reset button styles
        borderRadius: "none",
        boxShadow: "none",
        fontWeight: "normal",
        _hover: { backgroundColor: "none" },
        _active: {},
      },
    },
    Input: {
      baseStyle: {
        // Reset button styles
        borderRadius: "none",
        boxShadow: "none",
        fontWeight: "normal",
        _hover: { backgroundColor: "none" },
        _active: {},
      },
    },
  },
});

export { theme };
