import commafy from "@/utils/trim/commafy";

function testcase() {
  console.log(formatNumber(0.0000001)); // 0.000000

  console.log(formatNumber(0)); // 0
  console.log(formatNumber(123)); // 123
  console.log(formatNumber(999)); // 999
  console.log(formatNumber(1001)); // 1,001
  console.log(formatNumber(2048)); // 2,048
  console.log(formatNumber(53000)); // 53,000
  console.log(formatNumber(105000)); // 105,000
  console.log(formatNumber(999999)); // 999,999
  console.log(formatNumber(1000000)); // 1,000,000
  console.log(formatNumber(50000000)); // 50,000,000

  console.log(formatNumber(0.123456)); // 0.123456
  console.log(formatNumber(0.001234)); // 0.001234
  console.log(formatNumber(0.000001)); // 0.000001
  console.log(formatNumber(0.987654321)); // 0.987654
  console.log(formatNumber(0.0000001)); // 0.000000

  console.log(formatNumber(123.456)); // 123.456
  console.log(formatNumber(1100.1234)); // 1,100.1234
  console.log(formatNumber(98765.4321)); // 98,765.4321
  console.log(formatNumber(150000.987654)); // 150,000.9876
  console.log(formatNumber(12000.00001)); // 12,000

  console.log(formatNumber(1000000000)); // 1.0B
  console.log(formatNumber(2500000000)); // 2.5B
  console.log(formatNumber(1000000000000)); // 1.0T
  console.log(formatNumber(3500000000000)); // 3.5T
  console.log(formatNumber(1000000000000000)); // 1.0Q
  console.log(formatNumber(1230000000000000)); // 1.2Q
  console.log(formatNumber(4500000000000000)); // 4.5Q
  console.log(formatNumber(7200000000000000)); // 7.2Q
  console.log(formatNumber(1000000000.1231123)); // 1.0B
  console.log(formatNumber(2500000000.314890180239132)); // 2.5B
  console.log(formatNumber(1000000000000.1)); // 1.0T
  console.log(formatNumber(3500000000000.1238123)); // 3.5T
  console.log(formatNumber(1000000000000000.308923409)); // 1.0Q
  console.log(formatNumber(1230000000000000.123123123)); // 1.2Q
  console.log(formatNumber(4500000000000000.99999)); // 4.5Q
  console.log(formatNumber(7200000000000000.43820234)); // 7.2Q
  console.log(formatNumber(990000000000000)); // 990.0T
  console.log(formatNumber(120000000000000)); // 120.0T
}

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

  if (Math.abs(num) < 1e-6) {
    return "0.000000";
  }

  const absNum = Math.abs(num);
  const formattedNumber: string =
    absNum >= 1e15
      ? `${commafy(num / 1e15, 1)}Q`
      : absNum >= 1e12
      ? `${commafy(num / 1e12, 1)}T`
      : absNum >= 1e9
      ? `${commafy(num / 1e9, 1)}B`
      : Math.floor(num) === 0
      ? commafy(value, 6)
      : commafy(value, 4);

  // 소수점 이하가 모두 0인 경우, 정수 부분만 반환
  if (formattedNumber.includes(".")) {
    const [integerPart, decimalPart] = formattedNumber.split(".");
    if (/^0+$/.test(decimalPart.replace(/,/g, ""))) {
      return integerPart;
    }
  }

  return formattedNumber;
}

//testcase();

export default formatNumber;
