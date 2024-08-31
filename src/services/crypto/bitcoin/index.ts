import axios from "axios";
import { BigNumber } from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";

const currency = 'BTC';

export async function calculateFee(transactionSize: number = 140): Promise<CalculateFeeResult> {
    const estimatedFeeInBTC = await calculateSatPerVbyte(transactionSize);

    return {
        currency,
        value: parseSatoshiToBTC(estimatedFeeInBTC)
    }
}

export async function calculateSatPerVbyte(transactionSize: number = 140) {
    const feeRateInSatoshi = await fetchFeeRateInSatoshi();
    const satPerVbyte = feeRateInSatoshi / transactionSize;

    return satPerVbyte * transactionSize;
}

export function parseSatoshiToBTC(satoshi: number) {
    return BigNumber(satoshi * (10e-9));
}

export async function fetchFeeRateInSatoshi(): Promise<number> {
    const next3blocks = '30';
    return axios.get('https://bitcoiner.live/api/fees/estimates/latest')
        .then(({ data }) => data?.estimates[next3blocks]?.total?.p2wpkh?.satoshi);
}
