import axios from "axios";
import { BigNumber } from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";

const currency = 'BTC';
type NextBlocksInMinutes = '30' | '60' | '120' | '180' | '360' | '720' | '1440';

export async function calculateFee(transactionSize: number = 140): Promise<CalculateFeeResult> {
    try {
        const feeRateInSatoshi = await fetchFeeRateInSatoshi();
        const estimatedFeeInBTC = feeRateInSatoshi.multipliedBy(transactionSize);
    
        return {
            currency,
            value: parseSatoshiToBTC(estimatedFeeInBTC)
        }
    } catch (error) {
        throw error;
    }
}

export function parseSatoshiToBTC(satoshi: BigNumber) {
    return satoshi.multipliedBy(1e-8);
}

export async function fetchFeeRateInSatoshi(nextBlocksInMinutes: NextBlocksInMinutes = '30'): Promise<BigNumber> {
    try {
        const data = await axios.get('https://bitcoiner.live/api/fees/estimates/latest')
            .then(({ data }) => data);

        const satPerVbyte = BigNumber(data?.estimates[nextBlocksInMinutes]?.sat_per_vbyte);

        if (satPerVbyte.isNaN())
            throw Error('Error to get satoshi per vbyte');

        return BigNumber(satPerVbyte);

    } catch (error) {
        throw error;
    }
}
