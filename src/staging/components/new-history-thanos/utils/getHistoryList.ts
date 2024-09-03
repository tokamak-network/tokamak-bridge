import { CT_History, isInCT_REQUEST, isInCT_REQUEST_CANCEL } from "@/staging/types/transaction";

export const getHistoryList = (txData: CT_History) => {
    const { status, transactionHashes } = txData;

    const isCT_REQUEST = isInCT_REQUEST(status);
    const isCT_REQUEST_CANCEL = isInCT_REQUEST_CANCEL(status);

    if (isCT_REQUEST) {
        
    }


}