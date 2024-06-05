import axios from "axios";

export const getCurretStatus = async (l2BlockNumber: number) => {
  const resTxs = await axios.post(
    `${"https://api.studio.thegraph.com/query/77358/tokamak-bridge-history/version/latest"}`,
    {
      query: `
        {
            stateBatchAppendeds(where:{and: [{rollUpBatch_gte: ${l2BlockNumber}}, {_prevTotalElements_lt: ${l2BlockNumber}}]}) {
                blockTimestamp
        }
        `,
    }
  );
  if (resTxs?.data?.data?.stateBatchAppendeds.length > 0) {
    return 4;
  }
  return 2;
};
