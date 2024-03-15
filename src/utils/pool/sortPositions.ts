import { PoolCardDetail } from "@/app/pools/components/PoolCard";

export function sortPositions(positions: PoolCardDetail[]) {
  const sortedResult = positions.sort(
    (a: PoolCardDetail, b: PoolCardDetail) => {
      // Custom order for status: Closed  < Inactive < Active
      const closedStatusOrder: { [key: string]: number } = {
        false: 0,
        true: 1,
      };
      const closedStatusA = a.isClosed.toString();
      const closedStatusB = b.isClosed.toString();
      const closedStatusComparison =
        closedStatusOrder[closedStatusA] - closedStatusOrder[closedStatusB];

      if (closedStatusComparison !== 0) {
        return closedStatusComparison;
      }

      const rangeStatusOrder: { [key: string]: number } = {
        false: 1,
        true: 0,
      };
      const rangeStatusA = a.inRange.toString();
      const rangeStatusB = b.inRange.toString();
      const rangeStatusComparison =
        rangeStatusOrder[rangeStatusA] - rangeStatusOrder[rangeStatusB];

      if (rangeStatusComparison !== 0) {
        return rangeStatusComparison;
      }

      // Custom order for status: Amount + Fee market value
      const valueStatusA = a.token0Value + a.token1Value + a.feeValue;
      const valueStatusB = b.token0Value + b.token1Value + b.feeValue;
      const valueStatusComparison = valueStatusB - valueStatusA;

      if (valueStatusComparison !== 0) {
        return valueStatusComparison;
      }

      return 0;
    }
  );
  return sortedResult;
}
