require("dotenv").config();
import { quote } from "../../utils/uniswap/quote/quote";

describe("**start Uniswap Pool test**", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("Uniswap - quote test", async () => {
    console.log(process.env.NEXT_PUBLIC_GOERLI_RPC);
    const result = await quote();
    console.log(result);
  });
});
