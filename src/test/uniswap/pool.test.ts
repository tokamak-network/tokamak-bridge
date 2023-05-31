require("dotenv").config();
import { createTrade } from "@/utils/uniswap/tests/trading";
import { quote } from "../../utils/uniswap/tests/quote";

describe("**start Uniswap Pool test**", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  //   test("Uniswap - quote test", async () => {
  //     const _quoteR = await quote();
  //     console.log(_quoteR);
  //   });

  test("Uniswap - swap test", async () => {
    const _createTradeR = await createTrade();
    console.log(_createTradeR);
  });
});
