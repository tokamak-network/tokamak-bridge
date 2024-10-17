import commafy from "@/utils/trim/commafy";

function testcase() {
  console.log(formatNumber(0.0000001));
  console.log(formatNumber(0));
  console.log(formatNumber(123.12345));
  console.log(formatNumber(999.1212345));
  console.log(formatNumber(1001.1234565));
  console.log(formatNumber(2048.127391273));
  console.log(formatNumber(53000.123128390123));
  console.log(formatNumber(105000));
  console.log(formatNumber(999999));
  console.log(formatNumber(1000000));
  console.log(formatNumber(9999999));
  console.log(formatNumber(9999999.123789123));
  console.log(formatNumber(10000000));
  console.log(formatNumber(10199999.234890234809234));
  console.log(formatNumber(50000000));
  console.log(formatNumber(57510000));
  console.log(formatNumber(50000000.12345));
  console.log(formatNumber(0.123456));
  console.log(formatNumber(0.001234));
  console.log(formatNumber(0.000001));
  console.log(formatNumber(0.987654321));
  console.log(formatNumber(0.0000001));
  console.log(formatNumber(123.456));
  console.log(formatNumber(1100.1234));
  console.log(formatNumber(98765.4321));
  console.log(formatNumber(150000.987654));
  console.log(formatNumber(12000.00001));
  console.log(formatNumber(1000000000));
  console.log(formatNumber(2500000000));
  console.log(formatNumber(1000000000000));
  console.log(formatNumber(3500000000000));
  console.log(formatNumber(1000000000000000));
  console.log(formatNumber(1230000000000000));
  console.log(formatNumber(4500000000000000));
  console.log(formatNumber(7200000000000000));
  console.log(formatNumber(1000000000.1231123));
  console.log(formatNumber(2500000000.314890180239132));
  console.log(formatNumber(1000000000000.1));
  console.log(formatNumber(3500000000000.1238123));
  console.log(formatNumber(1000000000000000.308923409));
  console.log(formatNumber(1230000000000000.123123123));
  console.log(formatNumber(4500000000000000.99999));
  console.log(formatNumber(7200000000000000.43820234));
  console.log(formatNumber(990000000000000));
  console.log(formatNumber(120000000000000));
}

// formatNumber.ts
function formatNumber(
  value: string | number | undefined | null,
): string | undefined {
  if (value === undefined || value === null) {
    return commafy(value);
  }

  const num = Number(value);
  if (isNaN(num)) {
    return commafy(value);
  }

  if (num === 0) {
    return "0";
  }

  if (Math.abs(num) < 1e-4) {
    return "<0.0001";
  }

  const absNum = Math.abs(num);
  const formattedNumber = (() => {
    if (absNum >= 1e15) {
      return `${commafy(num / 1e15, 1)}Q`;
    }
    if (absNum >= 1e12) {
      return `${commafy(num / 1e12, 1)}T`;
    }
    if (absNum >= 1e9) {
      return `${commafy(num / 1e9, 1)}B`;
    }
    if (absNum >= 1e6) {
      return `${commafy(num / 1e6, 1)}M`;
    }
    const integerPart = Math.floor(absNum).toString();
    if (integerPart.length <= 3) {
      return commafy(value, 4);
    }
    if (integerPart.length === 4) {
      return commafy(value, 2);
    }
    return commafy(Math.floor(num).toString());
  })();

  // We deiced to display 4 decimal points if the number has more value after 4 decimals points
  if (formattedNumber.includes(".")) {
    const [integerPart, decimalPart] = formattedNumber.split(".");

    //check if the number has more value after 4 decimal points
    const decimalPartForRawValue = String(value).split(".")[1];
    const afterFourthDecimal = decimalPartForRawValue?.slice(4);
    const hasNonZeroAfterFourthDecimal = /[1-9]/.test(afterFourthDecimal);
    if (hasNonZeroAfterFourthDecimal) {
      return formattedNumber;
    }
    if (/^0+$/.test(decimalPart.replace(/,/g, ""))) {
      return integerPart;
    }
    return formattedNumber;
  }

  return formattedNumber;
}

// testcase();

export default formatNumber;
