import axios from "axios";
import { BigNumber } from "bignumber.js";

export async function calculateFee(transactionSize: number = 140) {
    const feeRate = await fetchFeeRate();
    const satPerVbyte = feeRate / transactionSize;
    const estimatedFeeInSatoshi = satPerVbyte * transactionSize;

    return parseSatoshiToBTC(estimatedFeeInSatoshi);
}

export function parseSatoshiToBTC(satoshi: number) {
    return BigNumber(satoshi * 10e-9);
}

export async function fetchFeeRate(): Promise<number> {
    try {
        return axios.get('https://bitcoiner.live/api/fees/estimates/latest')
            .then(({ data }) => data.estimates['30']?.total?.p2wpkh?.satoshi);

    } catch (error) {
        console.log(error);
    }
}
