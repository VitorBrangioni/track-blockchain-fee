import BigNumber from "bignumber.js";

export interface CalculateFeeResult {
    currency: 'BTC' | 'BNB',
    value: BigNumber
}

export enum Currency {
    BTC = 'Bitcoin',
    BNB = 'BNB'
}