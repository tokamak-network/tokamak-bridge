import commafy from "@/utils/trim/commafy";

function testcase() {
  console.log(formatNumber(0.0000001));
  console.log(formatNumber(0));
  console.log(formatNumber(123));
  console.log(formatNumber(999));
  console.log(formatNumber(1001));
  console.log(formatNumber(2048));
  console.log(formatNumber(53000));
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
  value: string | number | undefined | null
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
  const formattedNumber: string =
    absNum >= 1e15
      ? `${commafy(num / 1e15, 1)}Q`
      : absNum >= 1e12
      ? `${commafy(num / 1e12, 1)}T`
      : absNum >= 1e9
      ? `${commafy(num / 1e9, 1)}B`
      : absNum >= 1e7
      ? `${commafy(num / 1e6, 1)}M`
      : Math.floor(num) === 0
      ? commafy(value, 4)
      : commafy(value, 2);

  if (formattedNumber.includes(".")) {
    const [integerPart, decimalPart] = formattedNumber.split(".");
    if (/^0+$/.test(decimalPart.replace(/,/g, ""))) {
      return integerPart;
    }
  }

  return formattedNumber;
}

testcase();

export default formatNumber;
