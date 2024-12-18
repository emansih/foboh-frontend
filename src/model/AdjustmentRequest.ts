export type AdjustmentRequests = {
    adjustmentType: string;
    adjustmentMode: string;
    adjustedPrices: { id: string; adjustment: number }[];
}