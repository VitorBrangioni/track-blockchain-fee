import BigNumber from "bignumber.js";

export interface CalculateFeeResult {
    currency: 'BTC' | 'BNB' | 'ETH',
    value: BigNumber
}

export enum Currency {
    BTC = 'Bitcoin',
    BNB = 'BNB',
    ETH = 'ETH'
}

export enum BlockchainNetwork {
    BTC = 'Bitcoin',
    BNB = 'Binance Smart Chain',
    ETH = 'Ethereum'
}